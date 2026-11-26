// @vitest-environment node
import { describe, expect, it } from 'vitest'
import {
  isBioBoilerplate,
  LEDE_MAX,
  resolveExcerpt,
  resolveMetaDescription,
  truncateAtBoundary,
} from '../blog-excerpt'

const F1_EXCERPT =
  'I spent six years in the Texas Army National Guard as an Information Technology Specialist, including a deployment to Iraq. I learned quickly that when equipment fails in the field, you don’t ignore it. You fix it, or you replace it. You do not leave it to rust.'
const F1_META =
  'I spent six years in the Texas Army National Guard as an Information Technology Specialist, including a deployment to Iraq. I learned quickly that when equ...'
const F1_PARA =
  'I see too many sales organizations treat "closed-lost" deals as final. They archive them in Salesforce, mark them as history, and move on. This is a waste of resources.'
const F1_BODY = [
  '# Re-engagement campaigns',
  F1_EXCERPT,
  'Sales pipelines are no different.',
  F1_PARA,
].join('\n\n')

const F2_META =
  'I spent six years in the Texas Army National Guard as an Information Technology Specialist. That service included a deployment to Iraq. In the military, am...'
const F2_EXCERPT =
  'I spent six years in the Texas Army National Guard as an Information Technology Specialist. That service included a deployment to Iraq. In the military, ambiguity gets people hurt. If your orders aren’t clear, your radio isn’t working, or your data is wrong, the mission fails. I carry that mindset i'
const F2_BODY = [
  '# Salesloft admin basics',
  `${F2_EXCERPT}nto every system I manage.`,
  'Salesloft is one of the most powerful sales engagement platforms available. But I see it configured poorly more often than I care to admit. I’ve held roles ranging from Business Systems Specialist to Revenue Operations Consultant.',
].join('\n\n')

const F3_META =
  'I spent six years as an IT Specialist in the Texas Army National Guard, including a deployment to Iraq. Soldiers don’t have the luxury of guessing. If your...'
const F3_EXCERPT =
  'I spent six years as an IT Specialist in the Texas Army National Guard, including a deployment to Iraq. Soldiers don’t have the luxury of guessing. If your gear is dirty, it jams. If your intel is wrong, you get hurt. The same logic applies to revenue operations. I’ve spent the last nine years fixin'
const F3_BODY = [
  'I spent six years as an IT Specialist in the Texas Army National Guard, including a deployment to Iraq. Soldiers don’t have the luxury of guessing. The same logic applies to revenue operations. I’ve spent the last nine years fixing broken systems.',
  'When I look at a pipeline, I don’t just see opportunities. I see noise, duplicates and stages that mean different things to different reps.',
].join('\n\n')

const C_EXCERPT =
  'A pipeline can show healthy coverage and green dashboards and still miss badly, because the CRM records what reps say instead of what buyers do. Here are the seven ways pipeline data goes wrong, how to detect each one, and how to keep it accurate.'
const C_META =
  'Seven ways CRM pipeline data drifts from reality, the reports that catch each one, and the systems, metrics and weekly inspection that keep pipeline accurate.'

describe('truncateAtBoundary', () => {
  it('returns short text unchanged', () => {
    expect(truncateAtBoundary('Short.', 160)).toBe('Short.')
  })

  it('prefers a sentence end without an ellipsis', () => {
    expect(truncateAtBoundary(F1_PARA, 160)).toBe(
      'I see too many sales organizations treat "closed-lost" deals as final. They archive them in Salesforce, mark them as history, and move on.'
    )
  })

  it('cuts at a word boundary with one ellipsis when no sentence ends in range', () => {
    const text = `${'alpha beta gamma '.repeat(13)}`.trim()
    expect(text.length).toBeGreaterThan(160)
    const out = truncateAtBoundary(text, 160)
    expect(out.length).toBeLessThanOrEqual(160)
    expect(out.endsWith('…')).toBe(true)
    const head = out.slice(0, -1)
    expect(text.startsWith(head)).toBe(true)
    expect(text[head.length]).toBe(' ')
    expect(out).not.toMatch(/……|\.\.\./)
    expect(out).not.toMatch(/[,;:.\-–—]…$/)
  })

  it('drops the partial word of an ASCII hard cut', () => {
    expect(
      truncateAtBoundary(
        'Pipelines decay when nobody owns stage definitions and nobody audits the fields reps actually use when equ...',
        160
      )
    ).toBe(
      'Pipelines decay when nobody owns stage definitions and nobody audits the fields reps actually use when…'
    )
  })

  it('keeps a stored unicode ellipsis once', () => {
    expect(truncateAtBoundary('Forecasts miss because…', 160)).toBe('Forecasts miss because…')
  })

  it('treats a mixed trailing run as one hard cut', () => {
    expect(truncateAtBoundary('Owners audit fields weekly… ...', 160)).toBe('Owners audit fields…')
  })

  it('handles long dot runs in linear time', () => {
    const dots = '.'.repeat(10_000)
    const inputs = [
      `a ${dots} b`,
      `Pipeline review checklist: stage definitions ${dots} page 4 of the playbook.`,
      `Stage definitions drift ${dots}`,
      `Stage definitions drift ${'... '.repeat(2_500)}`,
    ]
    const started = performance.now()
    const outs = inputs.map((input) => truncateAtBoundary(input, 160))
    expect(performance.now() - started).toBeLessThan(100)
    for (const out of outs) expect(out.length).toBeLessThanOrEqual(160)
    expect(outs[2]).toBe('Stage definitions…')
    expect(outs[3]).toBe('Stage definitions…')
  })
})

describe('resolveExcerpt caps', () => {
  it('cuts the control excerpt to its first sentence at 160 but keeps it whole as a lede', () => {
    const short = resolveExcerpt({ excerpt: C_EXCERPT, content: '' })
    expect(short).toHaveLength(144)
    expect(short.endsWith('do.')).toBe(true)
    expect(resolveExcerpt({ excerpt: C_EXCERPT, content: '' }, { maxLength: LEDE_MAX })).toBe(
      C_EXCERPT
    )
  })

  it('replaces the live bio excerpts with a bio-free lede', () => {
    expect(resolveExcerpt({ excerpt: F1_EXCERPT, content: F1_BODY }, { maxLength: LEDE_MAX })).toBe(
      F1_PARA
    )
    const f2 = resolveExcerpt({ excerpt: F2_EXCERPT, content: F2_BODY }, { maxLength: LEDE_MAX })
    expect(f2.startsWith('Salesloft is one of the most powerful')).toBe(true)
    const f3 = resolveExcerpt({ excerpt: F3_EXCERPT, content: F3_BODY }, { maxLength: LEDE_MAX })
    expect(f3.startsWith('When I look at a pipeline')).toBe(true)
    for (const out of [f2, f3]) expect(out).not.toContain('National Guard')
  })
})

describe('resolveMetaDescription', () => {
  it('replaces the bio meta with the first real sentences', () => {
    expect(
      resolveMetaDescription({ metaDescription: F1_META, excerpt: F1_EXCERPT, content: F1_BODY })
    ).toBe(
      'I see too many sales organizations treat "closed-lost" deals as final. They archive them in Salesforce, mark them as history, and move on.'
    )
    const f2 = resolveMetaDescription({
      metaDescription: F2_META,
      excerpt: F2_EXCERPT,
      content: F2_BODY,
    })
    expect(f2.startsWith('Salesloft is one of the most powerful')).toBe(true)
    expect(f2.length).toBeLessThanOrEqual(160)
    const f3 = resolveMetaDescription({
      metaDescription: F3_META,
      excerpt: F3_EXCERPT,
      content: F3_BODY,
    })
    expect(f3.startsWith('When I look at a pipeline')).toBe(true)
    expect(f3.length).toBeLessThanOrEqual(160)
  })

  it('passes a clean stored meta through unchanged', () => {
    expect(C_META).toHaveLength(158)
    expect(
      resolveMetaDescription({ metaDescription: C_META, excerpt: C_EXCERPT, content: '' })
    ).toBe(C_META)
  })

  it('falls back to the excerpt for blank metas', () => {
    for (const metaDescription of [null, '', '   ']) {
      expect(resolveMetaDescription({ metaDescription, excerpt: C_EXCERPT, content: '' })).toBe(
        resolveExcerpt({ excerpt: C_EXCERPT, content: '' }, { maxLength: 160 })
      )
    }
  })

  it('returns a stored meta as plain text', () => {
    expect(
      resolveMetaDescription({
        metaDescription: 'Why **pipeline** reviews fail &amp; what to do.',
        excerpt: null,
        content: null,
      })
    ).toBe('Why pipeline reviews fail & what to do.')
  })
})

describe('ellipsis-only stored values', () => {
  it('truncates nothing-but-ellipsis text to empty', () => {
    for (const text of ['...', '…', ' … ... ', '.....']) {
      expect(truncateAtBoundary(text, 160)).toBe('')
    }
  })

  it('falls back to the body for an ellipsis-only excerpt', () => {
    for (const excerpt of ['...', '…']) {
      expect(resolveExcerpt({ excerpt, content: F1_PARA })).toBe(
        'I see too many sales organizations treat "closed-lost" deals as final. They archive them in Salesforce, mark them as history, and move on.'
      )
    }
  })

  it('skips an ellipsis-only body paragraph', () => {
    const content = `${'.'.repeat(60)}\n\n${F1_PARA}`
    expect(resolveExcerpt({ excerpt: null, content }, { maxLength: LEDE_MAX })).toBe(F1_PARA)
  })

  it('falls back to the excerpt for an ellipsis-only meta', () => {
    for (const metaDescription of ['...', '…']) {
      expect(resolveMetaDescription({ metaDescription, excerpt: C_EXCERPT, content: '' })).toBe(
        resolveExcerpt({ excerpt: C_EXCERPT, content: '' }, { maxLength: 160 })
      )
    }
  })
})

describe('abbreviations are not sentence ends', () => {
  const lead = 'Our forecast review moved to a weekly cadence across every region last spring, and'

  it.each([
    [
      'Dr.',
      `${lead} then we met with Dr. Jones to rebuild the stage definitions that reps had quietly redefined over time.`,
    ],
    [
      'e.g.',
      `${lead} we audited every integration, e.g. Salesforce and Outreach, to find the fields that reps no longer trusted.`,
    ],
    [
      'U.S.',
      `${lead} we split the U.S. Enterprise team from mid-market so each segment carried its own conversion benchmarks.`,
    ],
    [
      'vs.',
      `${lead} we compared this quarter vs. Last quarter for every stage so the drift showed up before the commit call.`,
    ],
    [
      'J.',
      `${lead} we asked J. Smith to own the definitions so every stage change went through one accountable reviewer.`,
    ],
    [
      'Jan.',
      `${lead} the new process has run since Jan. 2024 without a single missed commit call across any of the regions.`,
    ],
    [
      'No.',
      `${lead} the team now ranks No. 1 in forecast accuracy across every region we track in the quarterly review.`,
    ],
    [
      'approx.',
      `${lead} we cut approx. 30% of stale pipeline before the quarterly commit call so the forecast reflected reality.`,
    ],
    [
      'Fig.',
      `${lead} see Fig. 3 for the full stage conversion picture that the old dashboards had hidden from every rep.`,
    ],
    [
      'a.m.',
      `${lead} the review now starts at 9 a.m. Eastern so every region can join before the first customer calls.`,
    ],
    [
      'Inc.',
      `${lead} we moved the Acme Inc. Renewal team onto the same stage definitions as the new business reps.`,
    ],
    [
      'U.K.',
      `${lead} we split the U.K. Enterprise team from mid-market so each segment carried its own conversion benchmarks.`,
    ],
  ])('does not stop after %s', (abbr, text) => {
    expect(text.length).toBeGreaterThan(160)
    const out = truncateAtBoundary(text, 160)
    expect(out.endsWith('…')).toBe(true)
    expect(out.endsWith(abbr)).toBe(false)
    expect(out.length).toBeLessThanOrEqual(160)
  })

  it('drops the partial word when a hard cut lands after "No."', () => {
    expect(truncateAtBoundary('The team now ranks No. ...', 160)).toBe('The team now ranks…')
  })

  it('does not stop at a period followed by a lowercase word', () => {
    const text = `${lead} the version 2. rollout covered every team, region and segment before the quarterly commit call in June.`
    const out = truncateAtBoundary(text, 160)
    expect(out.endsWith('…')).toBe(true)
  })

  it('still stops at a real sentence end before a capital, digit or quote', () => {
    for (const next of ['Then', '40%', '“Stage']) {
      const text = `${lead} we rebuilt the stage definitions from scratch. ${next} the reps who ignored the old ones started to follow the new rules.`
      expect(truncateAtBoundary(text, 160)).toBe(
        `${lead} we rebuilt the stage definitions from scratch.`
      )
    }
  })

  it.each([
    ['a year', 'we closed the books on the second quarter. 2024 opened'],
    ['a number', 'the stage review covered every open deal. 30% of them'],
    ['the word "no" before a capital', 'the answer from every region was no. Then'],
    ['the word "no" before a quote', 'the answer from every region was no. “Stage'],
    ['a word ending in an abbreviation', 'the expansion team opened in Morocco. Then'],
  ])('still stops at a sentence end before %s', (_label, body) => {
    const text = `${lead} ${body} the reps who ignored the old definitions started to follow the new rules.`
    const firstSentence = text.slice(0, text.indexOf('. ', lead.length) + 1)
    expect(truncateAtBoundary(text, 160)).toBe(firstSentence)
  })
})

describe('hard cut after a finished sentence', () => {
  it('keeps the short sentence whole', () => {
    expect(truncateAtBoundary('Forecasts miss when stages lie. ...', 160)).toBe(
      'Forecasts miss when stages lie.'
    )
    expect(truncateAtBoundary('Forecasts miss when stages lie! ...', 160)).toBe(
      'Forecasts miss when stages lie!'
    )
  })

  it('still drops the partial word after an abbreviation', () => {
    expect(truncateAtBoundary('Book the review with Dr. ...', 160)).toBe('Book the review with…')
  })
})

describe('no-space truncation', () => {
  it('never splits a surrogate pair', () => {
    const out = truncateAtBoundary(`${'x'.repeat(158)}😀${'y'.repeat(20)}`, 160)
    expect(out).toBe(`${'x'.repeat(158)}…`)
    expect(out).not.toMatch(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])/)
  })

  it('keeps a whole pair that fits', () => {
    const out = truncateAtBoundary(`${'x'.repeat(157)}😀${'y'.repeat(20)}`, 160)
    expect(out).toBe(`${'x'.repeat(157)}😀…`)
  })
})

describe('bio detection on plain text', () => {
  // Trips only the opener rule (no "Texas Army National Guard" or "deployment
  // to Iraq" mention), which raw markdown emphasis used to hide.
  const OPENER = 'I served in the National Guard for six years before moving into RevOps.'
  const WRAPPED = [`**${OPENER}**`, `*${OPENER}*`, `[${OPENER}](https://x.test)`]

  it('flags the wrapped fixtures on raw text too, as the schema does', () => {
    expect(isBioBoilerplate(OPENER)).toBe(true)
    for (const text of WRAPPED) expect(isBioBoilerplate(text)).toBe(true)
  })

  it('skips a markdown-wrapped bio excerpt', () => {
    for (const excerpt of WRAPPED) {
      expect(resolveExcerpt({ excerpt, content: F1_BODY }, { maxLength: LEDE_MAX })).toBe(F1_PARA)
    }
  })

  it('skips a markdown-wrapped bio meta', () => {
    for (const metaDescription of WRAPPED) {
      const out = resolveMetaDescription({ metaDescription, excerpt: F1_EXCERPT, content: F1_BODY })
      expect(out.startsWith('I see too many sales organizations')).toBe(true)
    }
  })
})

describe('HTML entities in stored excerpts and metas', () => {
  it('decodes numeric and common named entities', () => {
    expect(
      resolveMetaDescription({
        metaDescription:
          'Stage drift&#8217;s real cost&#x2014;and the &ldquo;fix&rdquo;: owners &amp; audits&nbsp;weekly',
        excerpt: null,
        content: null,
      })
    ).toBe('Stage drift’s real cost—and the “fix”: owners & audits weekly')
  })

  it('treats a trailing &hellip; as the author’s ellipsis', () => {
    expect(
      resolveExcerpt({ excerpt: 'Forecasts miss because every forecast&hellip;', content: '' })
    ).toBe('Forecasts miss because every forecast…')
  })

  it('falls back when the stored meta is only an encoded ellipsis', () => {
    for (const metaDescription of ['&hellip;', '&#8230;', '&#x2026;', '&nbsp;']) {
      expect(resolveMetaDescription({ metaDescription, excerpt: C_EXCERPT, content: '' })).toBe(
        resolveExcerpt({ excerpt: C_EXCERPT, content: '' }, { maxLength: 160 })
      )
    }
  })

  it('catches a bio opener hidden behind a leading &nbsp;', () => {
    const excerpt = '&nbsp;I served in the National Guard for six years before moving into RevOps.'
    expect(resolveExcerpt({ excerpt, content: F1_BODY }, { maxLength: LEDE_MAX })).toBe(F1_PARA)
    const out = resolveMetaDescription({
      metaDescription: excerpt,
      excerpt: null,
      content: F1_BODY,
    })
    expect(out.startsWith('I see too many sales organizations')).toBe(true)
  })

  it('decodes a double-encoded entity once', () => {
    expect(
      resolveMetaDescription({
        metaDescription: 'Write &amp;nbsp; and &amp;amp; literally.',
        excerpt: null,
        content: null,
      })
    ).toBe('Write &nbsp; and &amp; literally.')
  })

  it('leaves unknown names and invalid code points as written', () => {
    expect(
      resolveMetaDescription({
        metaDescription: 'Keep &bogus; &constructor; &#0; &#xD800; &#1114112; as written.',
        excerpt: null,
        content: null,
      })
    ).toBe('Keep &bogus; &constructor; &#0; &#xD800; &#1114112; as written.')
  })
})

describe('punctuation-only stored values', () => {
  const PUNCTUATION_ONLY = ['— …', '- …', ', ...', '-- ...', '—', '-', ' ; ', '“”', '&mdash;']

  it('truncates to empty instead of a lone ellipsis or dash', () => {
    // truncateAtBoundary takes plain text; the resolvers decode '&mdash;' first.
    for (const text of PUNCTUATION_ONLY.filter((t) => !t.startsWith('&'))) {
      expect(truncateAtBoundary(text, 160)).toBe('')
    }
  })

  it('falls back to the body for a punctuation-only excerpt', () => {
    for (const excerpt of PUNCTUATION_ONLY) {
      expect(resolveExcerpt({ excerpt, content: F1_PARA }, { maxLength: LEDE_MAX })).toBe(F1_PARA)
    }
  })

  it('falls back to the excerpt for a punctuation-only meta', () => {
    for (const metaDescription of PUNCTUATION_ONLY) {
      expect(resolveMetaDescription({ metaDescription, excerpt: C_EXCERPT, content: '' })).toBe(
        resolveExcerpt({ excerpt: C_EXCERPT, content: '' }, { maxLength: 160 })
      )
    }
  })

  it('skips a punctuation-only body paragraph', () => {
    for (const filler of ['='.repeat(60), '— '.repeat(30), `${'. '.repeat(25)}…`]) {
      const content = `${filler}\n\n${F1_PARA}`
      expect(resolveExcerpt({ excerpt: null, content }, { maxLength: LEDE_MAX })).toBe(F1_PARA)
    }
  })

  it('never ends a word-boundary cut in a lone ellipsis', () => {
    // The only space is right after the dash, so the word cut keeps just '—'.
    expect(truncateAtBoundary(`— ${'x'.repeat(200)}`, 160)).toBe('')
  })

  it('still keeps short text that has a letter or number', () => {
    for (const text of ['Q3', '40%', '— Q3 recap …']) {
      expect(truncateAtBoundary(text, 160)).not.toBe('')
    }
  })
})
