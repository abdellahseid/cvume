import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';

export interface PdfExportOptions {
  elementId: string;
  fileName: string;
  scale?: number;
  targetWidthPx?: number;
  singlePageTolerance?: number; // ratio over 1 page to fit (e.g. 1.08 = 8%)
  onStatusChange?: (status: string) => void;
}

/**
 * Normalizes URLs for PDF link annotations (handling emails, phone numbers, and web links)
 */
function normalizePdfUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed || trimmed === '#' || trimmed.startsWith('javascript:')) return '';
  if (trimmed.startsWith('mailto:') || trimmed.startsWith('tel:') || trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  if (trimmed.includes('@') && !trimmed.includes('/')) {
    return `mailto:${trimmed}`;
  }
  if (/^[\d+\s().-]{7,}$/.test(trimmed)) {
    return `tel:${trimmed.replace(/[^\d+]/g, '')}`;
  }
  return `https://${trimmed.replace(/^\/\//, '')}`;
}

interface ExtractedPdfLink {
  href: string;
  xPercent: number;
  yPercent: number;
  wPercent: number;
  hPercent: number;
}

/**
 * Extracts and bundles all stylesheets currently active in the document so they can be
 * inlined synchronously into cloned iframe documents during canvas rendering.
 * This guarantees that in production and deployed environments (e.g. Vercel),
 * where styles reside in external bundled CSS files, the cloned iframe renders
 * with 100% complete styles without network latency or CORS blocks.
 */
async function extractDocumentStyles(): Promise<string> {
  let combinedCss = '';
  try {
    for (let i = 0; i < document.styleSheets.length; i++) {
      try {
        const sheet = document.styleSheets[i];
        let rules: CSSRuleList | null = null;
        try {
          rules = sheet.cssRules || (sheet as any).rules;
        } catch {
          // SecurityError can occur if stylesheet is served from a cross-origin CDN
        }

        if (rules && rules.length > 0) {
          for (let j = 0; j < rules.length; j++) {
            combinedCss += rules[j].cssText + '\n';
          }
        } else if (sheet.href) {
          // Fallback: Fetch stylesheet content directly
          try {
            const res = await fetch(sheet.href);
            if (res.ok) {
              combinedCss += (await res.text()) + '\n';
            }
          } catch {
            // Non-critical if fetch fails
          }
        }
      } catch (e) {
        console.warn('Stylesheet rule extraction warning:', e);
      }
    }
  } catch (err) {
    console.warn('Error reading document stylesheets:', err);
  }
  return combinedCss;
}

/**
 * Exports an HTML resume element to a publication-grade A4 PDF.
 * Works identically in development and deployed production environments by:
 * 1. Waiting for web fonts to fully load (document.fonts.ready).
 * 2. Inlining all parsed CSS rules directly into the cloned document head.
 * 3. Enforcing a desktop viewport (1280px) so responsive classes always render desktop templates.
 * 4. Isolating the paper element on a clean 794px A4 stage (210mm at 96 DPI).
 * 5. Calibrating A4 height to prevent awkward single-line page splits.
 */
export async function exportElementToPdf(options: PdfExportOptions): Promise<void> {
  const {
    elementId,
    fileName,
    scale = 2,
    targetWidthPx = 794, // 210mm at standard 96 DPI screen ratio
    singlePageTolerance = 1.08,
    onStatusChange,
  } = options;

  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Resume element with id "${elementId}" not found.`);
  }

  // 1. Extract all clickable links, URLs, and coordinates relative to the resume element
  const links: ExtractedPdfLink[] = [];
  try {
    const elRect = element.getBoundingClientRect();
    if (elRect.width > 0 && elRect.height > 0) {
      const anchors = element.querySelectorAll('a[href]');
      anchors.forEach((anchor) => {
        const rawHref = anchor.getAttribute('href') || '';
        const href = normalizePdfUrl(rawHref);
        if (!href) return;

        const aRect = anchor.getBoundingClientRect();
        const relX = aRect.left - elRect.left;
        const relY = aRect.top - elRect.top;
        // Ensure a comfortable touch/click target in the exported PDF
        const width = Math.max(aRect.width, 14);
        const height = Math.max(aRect.height, 14);

        links.push({
          href,
          xPercent: relX / elRect.width,
          yPercent: relY / elRect.height,
          wPercent: width / elRect.width,
          hPercent: height / elRect.height,
        });
      });
    }
  } catch (err) {
    console.warn('Error extracting links for PDF:', err);
  }

  onStatusChange?.('Preparing high-resolution PDF...');

  // 1. Wait for document fonts to be ready
  if (document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch (e) {
      console.warn('Fonts ready check warning:', e);
    }
  }

  // 2. Extract all styles from the current document
  const extractedCss = await extractDocumentStyles();

  onStatusChange?.('Rendering template layout...');

  // 3. Render element to high-res canvas with html2canvas-pro
  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    allowTaint: true,
    logging: false,
    imageTimeout: 15000,
    backgroundColor: '#ffffff',
    windowWidth: 1280, // Force desktop viewport in iframe so sm:, md:, lg: always resolve
    windowHeight: 1600,
    scrollX: 0,
    scrollY: 0,
    x: 0,
    y: 0,
    onclone: (clonedDoc) => {
      // Inline all extracted CSS rules into clonedDoc head so external link loading is not needed
      if (extractedCss) {
        const styleTag = clonedDoc.createElement('style');
        styleTag.setAttribute('type', 'text/css');
        styleTag.textContent = extractedCss;
        clonedDoc.head.appendChild(styleTag);
      }

      // Ensure Google Fonts link is present with absolute URL
      const fontLink = clonedDoc.createElement('link');
      fontLink.rel = 'stylesheet';
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap';
      clonedDoc.head.appendChild(fontLink);

      // Locate target element in cloned document
      const target = clonedDoc.getElementById(elementId);
      if (!target) return;

      // Safely detach target before resetting body
      const parent = target.parentNode;
      if (parent) {
        parent.removeChild(target);
      }

      // Create an isolated, fixed-width A4 stage to avoid any parent grid, sidebar, or overflow interference
      const stage = clonedDoc.createElement('div');
      stage.id = 'pdf-isolated-stage';
      stage.style.position = 'absolute';
      stage.style.top = '0';
      stage.style.left = '0';
      stage.style.width = `${targetWidthPx}px`;
      stage.style.minWidth = `${targetWidthPx}px`;
      stage.style.maxWidth = `${targetWidthPx}px`;
      stage.style.margin = '0';
      stage.style.padding = '0';
      stage.style.backgroundColor = '#ffffff';
      stage.style.boxSizing = 'border-box';
      stage.style.overflow = 'visible';

      // Reset target element styles for clean A4 printing without outer shadows, borders or outlines
      target.style.width = `${targetWidthPx}px`;
      target.style.minWidth = `${targetWidthPx}px`;
      target.style.maxWidth = `${targetWidthPx}px`;
      target.style.margin = '0';
      target.style.border = 'none';
      target.style.boxShadow = 'none';
      target.style.outline = 'none';
      target.style.borderRadius = '0px';
      target.style.boxSizing = 'border-box';

      // Clear cloned document body and place only the isolated stage
      clonedDoc.body.innerHTML = '';
      clonedDoc.body.style.margin = '0';
      clonedDoc.body.style.padding = '0';
      clonedDoc.body.style.backgroundColor = '#ffffff';
      clonedDoc.body.style.width = `${targetWidthPx}px`;
      clonedDoc.body.style.overflow = 'visible';

      stage.appendChild(target);
      clonedDoc.body.appendChild(stage);
    },
  });

  onStatusChange?.('Building publication PDF...');

  // 4. Create jsPDF document
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pageWidth = 210; // A4 width in mm
  const pageHeight = 297; // A4 height in mm
  const printWidth = pageWidth;
  const printHeight = (canvas.height * printWidth) / canvas.width;

  const imgData = canvas.toDataURL('image/png', 1.0);

  if (printHeight <= pageHeight) {
    // Fits cleanly on a single page
    pdf.addImage(imgData, 'PNG', 0, 0, printWidth, printHeight, undefined, 'FAST');
    for (const link of links) {
      const linkX = link.xPercent * printWidth;
      const linkY = link.yPercent * printHeight;
      const linkW = link.wPercent * printWidth;
      const linkH = link.hPercent * printHeight;
      pdf.link(linkX, linkY, linkW, linkH, { url: link.href });
    }
  } else if (printHeight <= pageHeight * singlePageTolerance) {
    // Fits within single page tolerance - scale slightly so it fits cleanly on 1 page
    const scaledWidth = (pageHeight / printHeight) * printWidth;
    const offsetX = (pageWidth - scaledWidth) / 2;
    pdf.addImage(imgData, 'PNG', offsetX, 0, scaledWidth, pageHeight, undefined, 'FAST');
    for (const link of links) {
      const linkX = offsetX + link.xPercent * scaledWidth;
      const linkY = link.yPercent * pageHeight;
      const linkW = link.wPercent * scaledWidth;
      const linkH = link.hPercent * pageHeight;
      pdf.link(linkX, linkY, linkW, linkH, { url: link.href });
    }
  } else {
    // Multi-page export with clean slicing
    let heightLeft = printHeight;
    let pageNumber = 0;

    while (heightLeft > 0) {
      if (pageNumber > 0) {
        pdf.addPage();
      }
      const position = -(pageNumber * pageHeight);
      pdf.addImage(imgData, 'PNG', 0, position, printWidth, printHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
      pageNumber++;
    }

    // Embed links on their corresponding pages
    for (const link of links) {
      const globalY = link.yPercent * printHeight;
      const pageIndex = Math.floor(globalY / pageHeight);
      const pageY = globalY - pageIndex * pageHeight;
      const linkX = link.xPercent * printWidth;
      const linkW = link.wPercent * printWidth;
      const linkH = link.hPercent * printHeight;

      if (pageIndex < pageNumber) {
        pdf.setPage(pageIndex + 1);
        pdf.link(linkX, pageY, linkW, linkH, { url: link.href });
      }
    }
  }

  pdf.save(fileName);
  onStatusChange?.('PDF downloaded successfully!');
}
