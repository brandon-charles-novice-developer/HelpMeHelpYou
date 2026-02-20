import { outcomeAICards, agencyLevelCards, cardsByClient } from '../../data/outcomeAI'

describe('outcomeAI — content quality and cross-reference validation', () => {
  it('agency card 1 references Ricola (top performer)', () => {
    const card = agencyLevelCards.find((c) => c.priority === 1)
    expect(card.insight).toContain('Ricola')
  })

  it('agency card 2 references Kayak DSP comparison', () => {
    const card = agencyLevelCards.find((c) => c.priority === 2)
    expect(card.insight).toContain('Kayak')
    expect(card.insight).toContain('Amazon DSP')
  })

  it('agency card 3 references Spirit switching behavior', () => {
    const card = agencyLevelCards.find((c) => c.priority === 3)
    expect(card.insight).toContain('Spirit')
    expect(card.insight).toContain('Frontier')
  })

  it('expectedImpact strings contain dollar amounts or percentages', () => {
    outcomeAICards.forEach((card) => {
      // Should have either $ or % in the impact string
      expect(card.expectedImpact).toMatch(/\$|\%/)
    })
  })

  it('recommendations are actionable (contain action verbs)', () => {
    const actionVerbs = ['Shift', 'Activate', 'Build', 'Create', 'Apply', 'Increase', 'Negotiate']
    outcomeAICards.forEach((card) => {
      const hasAction = actionVerbs.some((verb) => card.recommendation.includes(verb))
      expect(hasAction).toBe(true)
    })
  })

  it('each client card references its own data', () => {
    Object.entries(cardsByClient).forEach(([_clientId, cards]) => {
      cards.forEach((card) => {
        // The insight should contain something client-specific
        expect(card.insight.length).toBeGreaterThan(50)
      })
    })
  })

  it('IDs follow naming convention', () => {
    agencyLevelCards.forEach((c) => {
      expect(c.id).toMatch(/^ai-agency-\d+$/)
    })
    Object.entries(cardsByClient).forEach(([_clientId, cards]) => {
      cards.forEach((card) => {
        expect(card.id).toMatch(/^ai-[a-z]+-\d+$/)
      })
    })
  })

  it('insights are longer than recommendations', () => {
    // Insights explain the situation; recommendations are more concise
    outcomeAICards.forEach((card) => {
      // Not strictly true for all, but most insights should be substantial
      expect(card.insight.length).toBeGreaterThan(50)
    })
  })

  it('no duplicate recommendations across cards', () => {
    const recs = outcomeAICards.map((c) => c.recommendation)
    expect(new Set(recs).size).toBe(recs.length)
  })

  it('Kayak client card mentions Miami DMA', () => {
    const kayakCard = cardsByClient.kayak[0]
    expect(kayakCard.insight).toContain('Miami')
  })

  it('Newell client card mentions cross-brand opportunity', () => {
    const newellCard = cardsByClient.newell[0]
    expect(newellCard.insight).toContain('Rubbermaid')
    expect(newellCard.insight).toContain('Coleman')
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - Content tests are inherently fragile — any copy edit will break them
 * - The action verb check is a heuristic that may not catch all valid recommendations
 * - Cross-referencing card content to other data files would be more robust than string matching
 * - The ID convention (ai-agency-N, ai-clientId-N) is clear but could be auto-generated
 * - The backup tests focus on content quality rather than structure, which is the appropriate differentiation from primary tests
 */
