import { useFadeIn } from '../../hooks/useFadeIn'
import { agencyLevelCards } from '../../data/outcomeAI'
import SectionLabel from '../shared/SectionLabel'
import OutcomeAICard from './OutcomeAICard'

export default function OutcomeAIPanel() {
  const { ref, className } = useFadeIn()

  return (
    <div ref={ref} className={className}>
      <SectionLabel>OutcomeAI Insights</SectionLabel>
      <div className="grid grid-cols-3 gap-4">
        {agencyLevelCards.map((card, i) => (
          <OutcomeAICard key={card.id} card={card} index={i + 1} />
        ))}
      </div>
    </div>
  )
}
