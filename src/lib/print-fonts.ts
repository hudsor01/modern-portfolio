/**
 * The static print faces declared in src/app/resume/print-fonts.css, as
 * CSS font shorthands. Shared by the résumé page (which warms them so a
 * visitor's first print already has them) and `scripts/resume-pdf.ts`
 * (which refuses to print until every one is loaded).
 */
export const PRINT_FONT_FACES = [
  '400 1em "Spline Sans Print"',
  '500 1em "Spline Sans Print"',
  '600 1em "Spline Sans Print"',
  '500 1em "Playfair Display Print"',
  '600 1em "Playfair Display Print"',
] as const

/** PostScript names the résumé PDF may embed (subset prefixes stripped). */
export const PRINT_FONT_POSTSCRIPT_NAMES = [
  'SplineSans-Regular',
  'SplineSans-Medium',
  'SplineSans-SemiBold',
  'PlayfairDisplay-Medium',
  'PlayfairDisplay-SemiBold',
] as const

const IDLE_TIMEOUT_MS = 2000

export type PrintFontWindow = Pick<Window, 'addEventListener' | 'setTimeout'> & {
  document: Pick<Document, 'readyState' | 'fonts'>
  requestIdleCallback?: Window['requestIdleCallback']
}

/**
 * Load the print faces once the page has loaded and the browser is idle
 * (at most 2 s later). Print layout only starts fetching them when printing
 * begins, too late for that print; warming them keeps screen rendering and
 * first load untouched, since nothing on screen uses these families.
 */
export function preloadPrintFonts(win: PrintFontWindow = window): void {
  const load = () => {
    for (const face of PRINT_FONT_FACES) {
      win.document.fonts.load(face).catch(() => {
        // A failed warm-up only means printing falls back to the screen fonts.
      })
    }
  }
  const schedule = () => {
    if (win.requestIdleCallback) win.requestIdleCallback(load, { timeout: IDLE_TIMEOUT_MS })
    else win.setTimeout(load, IDLE_TIMEOUT_MS)
  }
  if (win.document.readyState === 'complete') schedule()
  else win.addEventListener('load', schedule, { once: true })
}
