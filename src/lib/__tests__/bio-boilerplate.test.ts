// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { isBioBoilerplate } from '../bio-boilerplate'

const F1_META =
  'I spent six years in the Texas Army National Guard as an Information Technology Specialist, including a deployment to Iraq. I learned quickly that when equ...'
const F2_META =
  'I spent six years in the Texas Army National Guard as an Information Technology Specialist. That service included a deployment to Iraq. In the military, am...'
const F3_META =
  'I spent six years as an IT Specialist in the Texas Army National Guard, including a deployment to Iraq. Soldiers don’t have the luxury of guessing. If your...'
const F3_EXCERPT =
  'I spent six years as an IT Specialist in the Texas Army National Guard, including a deployment to Iraq. Soldiers don’t have the luxury of guessing. If your gear is dirty, it jams. If your intel is wrong, you get hurt. The same logic applies to revenue operations. I’ve spent the last nine years fixin'
const C_EXCERPT =
  'A pipeline can show healthy coverage and green dashboards and still miss badly, because the CRM records what reps say instead of what buyers do. Here are the seven ways pipeline data goes wrong, how to detect each one, and how to keep it accurate.'
const C_META =
  'Seven ways CRM pipeline data drifts from reality, the reports that catch each one, and the systems, metrics and weekly inspection that keep pipeline accurate.'

describe('isBioBoilerplate', () => {
  it('flags the live bio posts', () => {
    for (const text of [F1_META, F2_META, F3_META, F3_EXCERPT]) {
      expect(isBioBoilerplate(text)).toBe(true)
    }
  })

  it('flags other bio openers and mentions', () => {
    expect(isBioBoilerplate('I served in the National Guard for six years')).toBe(true)
    expect(isBioBoilerplate('Lessons from the Texas Army National Guard apply to pipelines.')).toBe(
      true
    )
  })

  it('treats empty input as replaceable', () => {
    for (const v of ['', null, undefined, '   ']) expect(isBioBoilerplate(v)).toBe(true)
  })

  it('does not flag normal text', () => {
    expect(isBioBoilerplate('Forecasts miss because stages are fiction.')).toBe(false)
    expect(isBioBoilerplate('I worked with our IT specialist on the Salesforce migration.')).toBe(
      false
    )
    expect(isBioBoilerplate(C_EXCERPT)).toBe(false)
    expect(isBioBoilerplate(C_META)).toBe(false)
  })

  it('does not flag a late mention', () => {
    const text = `Pipeline reviews fail when ${'x'.repeat(200)} Texas Army National Guard`
    expect(isBioBoilerplate(text)).toBe(false)
  })
})
