import { converterInsights } from '../../data/converterInsights'

describe('converterInsights — demographic skew and domain validation', () => {
  const clientIds = Object.keys(converterInsights)

  it('all clients have an Age dimension', () => {
    clientIds.forEach((id) => {
      const ageDim = converterInsights[id].demographics.find((d) => d.label === 'Age')
      expect(ageDim).toBeDefined()
    })
  })

  it('all clients have a Gender dimension', () => {
    clientIds.forEach((id) => {
      const genderDim = converterInsights[id].demographics.find((d) => d.label === 'Gender')
      expect(genderDim).toBeDefined()
    })
  })

  it('Age dimension segments cover standard ranges', () => {
    clientIds.forEach((id) => {
      const ageDim = converterInsights[id].demographics.find((d) => d.label === 'Age')
      const segments = ageDim.attain.map((s) => s.segment)
      expect(segments).toContain('18\u201324')
      expect(segments).toContain('25\u201334')
    })
  })

  it('Attain pct differs from census (showing audience skew)', () => {
    clientIds.forEach((id) => {
      converterInsights[id].demographics.forEach((d) => {
        const allSame = d.attain.every((seg) => seg.pct === seg.census)
        expect(allSame).toBe(false) // There should be some skew
      })
    })
  })

  it('Spirit skews younger than Ricola (18-34 share)', () => {
    const spiritAge = converterInsights.spirit.demographics.find((d) => d.label === 'Age')
    const ricolaAge = converterInsights.ricola.demographics.find((d) => d.label === 'Age')

    const spiritYoung = spiritAge.attain
      .filter((s) => ['18\u201324', '25\u201334'].includes(s.segment))
      .reduce((sum, s) => sum + s.pct, 0)

    const ricolaYoung = ricolaAge.attain
      .filter((s) => ['18\u201324', '25\u201334'].includes(s.segment))
      .reduce((sum, s) => sum + s.pct, 0)

    expect(spiritYoung).toBeGreaterThan(ricolaYoung)
  })

  it('Indeed has LinkedIn in psychographics (recruiting platform)', () => {
    const social = converterInsights.indeed.psychographics.find(
      (p) => p.label === 'Social Media'
    )
    expect(social.top.some((item) => item.includes('LinkedIn'))).toBe(true)
  })

  it('Ricola has health-related life events', () => {
    const lifeEvents = converterInsights.ricola.psychographics.find(
      (p) => p.label === 'Life Events'
    )
    expect(lifeEvents.top.some((item) => item.includes('Illness'))).toBe(true)
  })

  it('psychographic percentages in strings are between 1% and 99%', () => {
    clientIds.forEach((id) => {
      converterInsights[id].psychographics.forEach((p) => {
        p.top.forEach((item) => {
          const match = item.match(/\((\d+)%\)/)
          if (match) {
            const pct = parseInt(match[1])
            expect(pct).toBeGreaterThan(0)
            expect(pct).toBeLessThan(100)
          }
        })
      })
    })
  })

  it('label includes "Verified" keyword (Attain verification)', () => {
    clientIds.forEach((id) => {
      expect(converterInsights[id].label).toContain('Verified')
    })
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - Demographic dimensions vary per client; standardizing to the same 4 dimensions would simplify cross-client comparison
 * - The psychographic strings with embedded percentages ('Netflix (82%)') should be structured as { name, pct }
 * - Business-logic tests (Spirit skews younger) are scenario-dependent and will break if data changes
 * - The 'Verified' keyword in labels is an Attain brand requirement; could be a constant prefix
 * - Census comparison data should reference a single demographic baseline rather than being duplicated per client
 */
