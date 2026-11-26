/**
 * The résumé's print text: every word /resume renders outside a `print:hidden`
 * subtree, in document order, whitespace collapsed. scripts/resume-pdf.ts reads
 * it from the served page and stores its hash as line 2 of
 * scripts/resume-pdf.sha256; src/lib/__tests__/resume-pdf-drift.test.ts reads
 * it from the same components rendered in jsdom and fails when the two differ.
 * Line 1 (the data hash) cannot see text typed into the components themselves:
 * section headings, the About years/location template, the contact-line
 * separators.
 *
 * Self-contained on purpose: it runs both in Playwright's `page.evaluate`
 * (which serialises the function source and runs it in the page) and in jsdom,
 * so it must not import or reference anything outside its own body.
 *
 * Text only, by construction: it reads text nodes and decides what prints from
 * the `print:hidden` class token rather than computed style (jsdom has no
 * Tailwind), so className and layout edits never change it while every printed
 * word does. Nothing the résumé prints derives from the clock, so the text does
 * not change with the calendar either.
 */
export function extractResumePrintText(root?: ParentNode | null): string {
  const start = root === undefined ? document.querySelector('main#main-content') : root
  if (!start) return ''
  const skippedTags = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE'])
  const parts: string[] = []
  const walk = (node: Node): void => {
    if (node.nodeType === 3) {
      parts.push(node.nodeValue ?? '')
      return
    }
    if (node.nodeType === 1) {
      const element = node as Element
      if (skippedTags.has(element.tagName.toUpperCase())) return
      if (element.classList.contains('print:hidden')) return
    }
    for (const child of Array.from(node.childNodes)) walk(child)
  }
  walk(start as unknown as Node)
  return parts.join(' ').replace(/\s+/g, ' ').trim()
}
