import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { extractResumePrintText } from '../resume-print-text'

describe('extractResumePrintText', () => {
  it('reads text in document order, skipping print:hidden and collapsing whitespace', () => {
    render(
      <main id="main-content" tabIndex={-1}>
        <h2>About</h2>
        <div className="print:hidden">Download PDF</div>
        <p className="hidden print:block">Dallas, TX | 214…</p>
        <p>{'  a\n  b '}</p>
      </main>
    )
    expect(extractResumePrintText()).toBe('About Dallas, TX | 214… a b')
  })

  it('reads only main#main-content by default', () => {
    render(
      <>
        <header>Site header</header>
        <main id="main-content" tabIndex={-1}>
          <p>Résumé</p>
        </main>
        <footer>Site footer</footer>
      </>
    )
    expect(extractResumePrintText()).toBe('Résumé')
  })

  it('skips nested print:hidden subtrees, SVG ones included, and keeps their siblings', () => {
    render(
      <main id="main-content" tabIndex={-1}>
        <section>
          <span>
            <svg className="lucide print:hidden" aria-hidden="true">
              <title>Calendar icon</title>
            </svg>
            2020 - 2024
          </span>
          <div className="flex print:hidden">
            <span>Chip</span>
            <span>Another chip</span>
          </div>
          <p>Kept</p>
        </section>
      </main>
    )
    expect(extractResumePrintText()).toBe('2020 - 2024 Kept')
  })

  it('skips script, style and noscript content', () => {
    // Built with the DOM API: React would not render a script's text content.
    const root = document.createElement('div')
    const add = (tag: string, text: string): void => {
      const el = document.createElement(tag)
      el.textContent = text
      root.append(el)
    }
    add('p', 'One')
    add('script', 'var hidden = 1')
    add('style', 'p{color:red}')
    add('noscript', 'No JS')
    add('template', 'Inert')
    add('p', 'Two')
    expect(extractResumePrintText(root)).toBe('One Two')
  })

  it('joins separate text nodes with a space, as React renders adjacent values', () => {
    render(
      <main id="main-content" tabIndex={-1}>
        <p>
          {'10+'} {'Years Experience'} | {'Dallas, TX'}
        </p>
      </main>
    )
    expect(extractResumePrintText()).toBe('10+ Years Experience | Dallas, TX')
  })

  it('reads an explicit root instead of the document main', () => {
    const { container } = render(
      <div>
        <p>Inside</p>
      </div>
    )
    expect(extractResumePrintText(container)).toBe('Inside')
  })

  it('returns an empty string when the page has no main#main-content', () => {
    render(<div>Not a résumé</div>)
    expect(extractResumePrintText()).toBe('')
  })

  it('returns an empty string for a print:hidden root', () => {
    const { container } = render(<div className="print:hidden">Screen only</div>)
    expect(extractResumePrintText(container.firstElementChild ?? container)).toBe('')
  })

  it('ignores className-only changes', () => {
    render(
      <main id="main-content" tabIndex={-1}>
        <h2 className="look-h3">About</h2>
        <p className="text-base">Summary</p>
      </main>
    )
    const before = extractResumePrintText()
    document.querySelector('h2')?.setAttribute('class', 'look-h2 print:text-xl')
    document.querySelector('p')?.setAttribute('class', 'text-lg print:leading-snug')
    expect(extractResumePrintText()).toBe(before)
  })

  // scripts/resume-pdf.ts hands the function to Playwright's page.evaluate,
  // which serialises its source and runs it in the page: it must not reference
  // anything outside its own body.
  it('still works when rebuilt from its own source, outside this module', () => {
    render(
      <main id="main-content" tabIndex={-1}>
        <h2>About</h2>
        <span className="print:hidden">Screen</span>
        <p>Text</p>
      </main>
    )
    const rebuilt = new Function(`return (${extractResumePrintText.toString()})`)() as (
      root?: ParentNode | null
    ) => string
    expect(rebuilt()).toBe('About Text')
    expect(rebuilt()).toBe(extractResumePrintText())
  })
})
