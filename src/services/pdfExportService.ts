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
  if (trimmed.startsWith('mailto:')) {
    return trimmed;
  }
  if (trimmed.startsWith('tel:')) {
    const cleanNum = trimmed.replace(/^tel:/i, '').replace(/[^\d+]/g, '');
    return `tel:${cleanNum}`;
  }
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
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
 * Extracts links and their proportional coordinates from a container element.
 * Expands small hitboxes (like standalone icon buttons) so they are easy to click/tap in the PDF.
 */
function extractLinksFromContainer(container: HTMLElement, targetWidth: number): ExtractedPdfLink[] {
  const extracted: ExtractedPdfLink[] = [];
  try {
    const containerRect = container.getBoundingClientRect();
    const cWidth = containerRect.width > 0 ? containerRect.width : targetWidth;
    const cHeight = containerRect.height > 0 ? containerRect.height : container.scrollHeight;
    if (cWidth <= 0 || cHeight <= 0) return extracted;

    const anchors = container.querySelectorAll('a[href]');
    anchors.forEach((anchor) => {
      const rawHref = anchor.getAttribute('href') || '';
      const href = normalizePdfUrl(rawHref);
      if (!href) return;

      const aRect = anchor.getBoundingClientRect();
      const relX = aRect.left - containerRect.left;
      const relY = aRect.top - containerRect.top;

      // Expand small click targets (like project icon links or single icons)
      // to at least 22px wide x 18px tall, centered on the icon,
      // so they are effortless to tap or click in the exported PDF.
      const minHitW = 22;
      const minHitH = 18;
      let finalW = Math.max(aRect.width, 10);
      let finalH = Math.max(aRect.height, 10);
      let finalX = relX;
      let finalY = relY;

      if (finalW < minHitW) {
        finalX -= (minHitW - finalW) / 2;
        finalW = minHitW;
      }
      if (finalH < minHitH) {
        finalY -= (minHitH - finalH) / 2;
        finalH = minHitH;
      }

      finalX = Math.max(0, finalX);
      finalY = Math.max(0, finalY);

      extracted.push({
        href,
        xPercent: finalX / cWidth,
        yPercent: finalY / cHeight,
        wPercent: Math.min(1, finalW / cWidth),
        hPercent: Math.min(1, finalH / cHeight),
      });
    });
  } catch (err) {
    console.warn('Error extracting links for PDF:', err);
  }
  return extracted;
}

/**
 * Intelligently paginates DOM blocks so that projects, work experiences,
 * section headings, and topics are never sliced or cut in half by A4 page breaks.
 * If a block would straddle a page break, it is pushed down to begin cleanly at the top of the next page.
 */
function applySmartPdfPagination(targetEl: HTMLElement, pageHeightPx: number): void {
  try {
    const targetRect = targetEl.getBoundingClientRect();
    if (targetRect.height <= pageHeightPx) {
      // Content fits cleanly on a single page, no page break adjustment needed
      return;
    }

    // Query candidate blocks:
    // 1. Explicitly tagged blocks: [data-pdf-block], .pdf-item-block
    // 2. Headings: h2, h3, [data-pdf-heading]
    const candidates = Array.from(
      targetEl.querySelectorAll<HTMLElement>(
        '[data-pdf-block="true"], .pdf-item-block, [data-pdf-heading="true"], h2, h3, .pdf-section-header'
      )
    );

    if (candidates.length === 0) return;

    // Filter to top-level candidate blocks (avoid nested candidates shifting twice)
    const blocks: HTMLElement[] = [];
    candidates.forEach((cand) => {
      const isNested = blocks.some((parent) => parent.contains(cand));
      if (!isNested) {
        blocks.push(cand);
      }
    });

    // Safety threshold in pixels before the page boundary
    const bottomSafetyMargin = 32;

    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      // Recalculate positions on every iteration because previous block shifts move subsequent elements down
      const targetCurrentRect = targetEl.getBoundingClientRect();
      const blockRect = block.getBoundingClientRect();
      const topRel = blockRect.top - targetCurrentRect.top;
      const blockH = blockRect.height;
      const bottomRel = topRel + blockH;

      // Skip elements that are naturally taller than an entire page
      if (blockH >= pageHeightPx - 80) continue;

      const pageIndex = Math.floor(topRel / pageHeightPx);
      const pageBoundary = (pageIndex + 1) * pageHeightPx;

      const isHeading = block.tagName === 'H2' || block.tagName === 'H3' || block.getAttribute('data-pdf-heading') === 'true';
      // If a heading falls within 85px of the page boundary, avoid leaving an orphan heading alone at page bottom
      const threshold = isHeading ? pageBoundary - 85 : pageBoundary - bottomSafetyMargin;

      if (topRel < pageBoundary && bottomRel > threshold) {
        // Block straddles the page break! Push it to start cleanly at the top of the next page
        const shift = (pageBoundary - topRel) + (isHeading ? 24 : 18);
        const prevMarginTop = parseFloat(block.style.marginTop || '0') || 0;
        block.style.marginTop = `${prevMarginTop + shift}px`;
      }
    }
  } catch (err) {
    console.warn('Smart pagination adjustment warning:', err);
  }
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
  let links: ExtractedPdfLink[] = extractLinksFromContainer(element, targetWidthPx);

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

  const fullHeightPx = Math.max(3200, (element.scrollHeight || 0) + 800);

  // 3. Render element to high-res canvas with html2canvas-pro without vertical clipping
  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    allowTaint: true,
    logging: false,
    imageTimeout: 15000,
    backgroundColor: '#ffffff',
    windowWidth: 1280, // Force desktop viewport in iframe so sm:, md:, lg: always resolve
    windowHeight: fullHeightPx,
    height: element.scrollHeight || undefined,
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

      // Apply smart pagination so no project, topic, heading, or item is sliced across page boundaries!
      const pageHeightPx = Math.round(targetWidthPx * (297 / 210)); // 1123px at 794px width
      applySmartPdfPagination(target, pageHeightPx);

      // Extract precise link positions from the cloned 794px stage AFTER pagination
      try {
        const clonedLinks = extractLinksFromContainer(target, targetWidthPx);
        if (clonedLinks.length > 0) {
          links = clonedLinks;
        }
      } catch (e) {
        // Fall back to initial links
      }
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

    // Embed links on their corresponding pages with boundary clamping
    for (const link of links) {
      const globalY = link.yPercent * printHeight;
      const pageIndex = Math.floor(globalY / pageHeight);
      const pageY = globalY - pageIndex * pageHeight;
      const linkX = link.xPercent * printWidth;
      const linkW = link.wPercent * printWidth;
      const linkH = link.hPercent * printHeight;

      if (pageIndex < pageNumber) {
        pdf.setPage(pageIndex + 1);
        const clampedH = Math.min(linkH, pageHeight - pageY);
        if (clampedH > 0.5) {
          pdf.link(linkX, pageY, linkW, clampedH, { url: link.href });
        }
        // If the click hitbox straddles the page boundary, place the continuation on the next page
        if (pageY + linkH > pageHeight && pageIndex + 1 < pageNumber) {
          pdf.setPage(pageIndex + 2);
          const remainderH = (pageY + linkH) - pageHeight;
          if (remainderH > 0.5) {
            pdf.link(linkX, 0, linkW, remainderH, { url: link.href });
          }
        }
      }
    }
  }

  pdf.save(fileName);
  onStatusChange?.('PDF downloaded successfully!');
}
