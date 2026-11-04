<div align="center">

# cvume

**The intelligent resume builder and career studio.**  
Craft ATS-compliant, role-tailored resumes, cover letters, and outreach kits powered by Google Gemini.

[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Gemini](https://img.shields.io/badge/Google%20Gemini-AI-orange?style=flat-square&logo=google)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

</div>

---

## Concept

Most resumes fail either in automated **Applicant Tracking Systems (ATS)** or during the initial **6-second human review** because they are static documents submitted to dynamic job descriptions.

**Cvume** treats your career history as a single, living master profile. When applying for a target role, Cvume analyzes the job posting against your background, measures keyword match affinity, generates role-tailored bullet points highlighting quantifiable achievements, and produces clean, ATS-optimized single-page PDFs.

---

## Key Features

- **Master Career Profile** — Maintain your complete career history (work experience, projects, technical skills, education, and links) synchronized with PostgreSQL.
- **Job Application Studio** — Paste target job postings to instantly compute skill match scores, discover keyword gaps, and generate tailored resume variations.
- **AI-Powered Adaptation** — Leverages Google Gemini to formulate impactful bullet points (Action Verb + Context + Measurable Result), customized cover letters, and recruiter outreach messages.
- **ATS-Compliant Design** — Thoughtfully crafted, distraction-free typographic layouts with high-contrast hierarchy designed for seamless algorithmic parsing and human readability.
- **Single-Page PDF Engine** — High-fidelity client-side rendering via `jsPDF` and `html2canvas-pro` with dynamic scaling to eliminate page overflow and awkward page breaks.
- **Keyboard-First Experience** — Built-in Command Menu (`Cmd/Ctrl + K`) and shortcut navigation for rapid editing and workflow transitions.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Tailwind CSS v4, Motion, Lucide Icons |
| **Build & Tooling** | Vite, TSX, PostCSS |
| **Backend** | Express, Node.js (`http` / REST API) |
| **Database & Auth** | PostgreSQL (`pg`), salted `scrypt` hashing, session token management |
| **Intelligence** | Google Gemini API (`@google/genai`) |
| **Document Export** | jsPDF, html2canvas-pro |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20+ recommended)
- [PostgreSQL](https://www.postgresql.org/) (local or cloud instance)
- [Google Gemini API Key](https://aistudio.google.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/abdellahseid/cvume.git
   cd cvume
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Update `.env.local` with your credentials:
   ```env
   GEMINI_API_KEY="your-gemini-api-key"
   DATABASE_URL="postgresql://postgres@localhost:5432/cvumedb"
   ```

4. **Start the application:**
   ```bash
   npm run dev
   ```
   The application will be running at [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```text
cvume/
├── server/               # Database connection, schemas, and queries
│   └── db.ts
├── src/
│   ├── components/       # React UI components and studio views
│   │   ├── JobApplicationStudio.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── ResumeTemplateStudio.tsx
│   │   └── ...
│   ├── services/         # API clients, profile sync & PDF export
│   │   ├── api.ts
│   │   ├── pdfExportService.ts
│   │   └── profileService.ts
│   ├── types/            # TypeScript interfaces (resume, profile, auth)
│   └── App.tsx           # Primary application container and routing
├── server.ts             # Express server with Gemini integration
├── vite.config.ts        # Vite build and server proxy configuration
└── .env.example          # Environment variable template
```

---

## Available Scripts

- `npm run dev` — Starts the unified Express API server and Vite development server.
- `npm run build` — Builds the production bundle.
- `npm run test` — Runs database and authentication integration tests.
- `npm run lint` — Performs TypeScript type checking without emitting files.

---

## License

This project is licensed under the [MIT License](LICENSE).
