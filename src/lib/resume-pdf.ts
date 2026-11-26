/**
 * Single source for the résumé PDF names. Imports nothing, so client
 * components, server code, `bun scripts/resume-pdf.ts` and the e2e specs can
 * all import it. Kept apart from resume-source-hash.ts, which imports
 * node:crypto and must stay out of the browser bundle.
 */
export const RESUME_PDF_FILENAME = 'Richard_Hudson_Revenue_Operations.pdf'
export const RESUME_PDF_PATH = `/${RESUME_PDF_FILENAME}`
/** The user-facing save-as name, deliberately different from the file on disk. */
export const RESUME_PDF_DOWNLOAD_NAME = 'Richard_Hudson_Resume.pdf'
