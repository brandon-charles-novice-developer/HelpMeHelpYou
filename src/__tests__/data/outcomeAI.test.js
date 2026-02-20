import { outcomeAICards, agencyLevelCards, cardsByClient } from '../../data/outcomeAI'
import { clients } from '../../data/clients'

describe('outcomeAI data', () => {
  describe('outcomeAICards array', () => {
    it('has 8 total cards (3 agency + 5 client)', () => {
      expect(outcomeAICards).toHaveLength(8)
    })

    it('all cards have required fields', () => {
      outcomeAICards.forEach((card) => {
        expect(card).toHaveProperty('id')
        expect(card).toHaveProperty('scope')
        expect(card).toHaveProperty('clientId')
        expect(card).toHaveProperty('priority')
        expect(card).toHaveProperty('insight')
        expect(card).toHaveProperty('recommendation')
        expect(card).toHaveProperty('expectedImpact')
        expect(card).toHaveProperty('impactPositive')
      })
    })

    it('all IDs are unique', () => {
      const ids = outcomeAICards.map((c) => c.id)
      expect(new Set(ids).size).toBe(ids.length)
    })

    it('scope is agency or client', () => {
      outcomeAICards.forEach((card) => {
        expect(['agency', 'client']).toContain(card.scope)
      })
    })

    it('agency cards have null clientId', () => {
      outcomeAICards
        .filter((c) => c.scope === 'agency')
        .forEach((card) => {
          expect(card.clientId).toBeNull()
        })
    })

    it('client cards have valid clientId', () => {
      const clientIds = new Set(clients.map((c) => c.id))
      outcomeAICards
        .filter((c) => c.scope === 'client')
        .forEach((card) => {
          expect(clientIds.has(card.clientId)).toBe(true)
        })
    })

    it('priority is a positive integer', () => {
      outcomeAICards.forEach((card) => {
        expect(Number.isInteger(card.priority)).toBe(true)
        expect(card.priority).toBeGreaterThan(0)
      })
    })

    it('all impacts are positive', () => {
      outcomeAICards.forEach((card) => {
        expect(card.impactPositive).toBe(true)
      })
    })

    it('insight, recommendation, and expectedImpact are non-empty strings', () => {
      outcomeAICards.forEach((card) => {
        expect(card.insight.length).toBeGreaterThan(20)
        expect(card.recommendation.length).toBeGreaterThan(20)
        expect(card.expectedImpact.length).toBeGreaterThan(10)
      })
    })
  })

  describe('agencyLevelCards', () => {
    it('has exactly 3 agency-level cards', () => {
      expect(agencyLevelCards).toHaveLength(3)
    })

    it('all have scope agency', () => {
      agencyLevelCards.forEach((card) => {
        expect(card.scope).toBe('agency')
      })
    })

    it('priorities are 1, 2, 3', () => {
      const priorities = agencyLevelCards.map((c) => c.priority).sort()
      expect(priorities).toEqual([1, 2, 3])
    })
  })

  describe('cardsByClient', () => {
    it('has 5 client keys', () => {
      expect(Object.keys(cardsByClient)).toHaveLength(5)
    })

    it('each client has exactly 1 card', () => {
      Object.values(cardsByClient).forEach((cards) => {
        expect(cards).toHaveLength(1)
      })
    })

    it('maps to correct client IDs', () => {
      clients.forEach((c) => {
        expect(cardsByClient).toHaveProperty(c.id)
        cardsByClient[c.id].forEach((card) => {
          expect(card.clientId).toBe(c.id)
        })
      })
    })
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - All impactPositive values are true — the field serves no purpose in the current dataset
 * - The 3-zone structure (insight, recommendation, expectedImpact) is consistent and well-designed
 * - Agency cards and client cards could be separate exports from the start, eliminating the filter at module level
 * - The priority field on client cards is always 1 (since each client has exactly one card); could be removed
 * - The insight and recommendation strings reference specific data from other files; no programmatic validation of these references
 */
