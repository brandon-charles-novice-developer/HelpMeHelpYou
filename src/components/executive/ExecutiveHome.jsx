import AgencyScoreboard from './AgencyScoreboard'
import ImpactBrief from './ImpactBrief'
import ClientPerformanceMap from './ClientPerformanceMap'
import OutcomeAIPanel from './OutcomeAIPanel'
import ShopperInsightsPanel from './ShopperInsightsPanel'
import InsightPulse from './InsightPulse'
import ConversionChart from './ConversionChart'
import TransactionFeed from '../live/TransactionFeed'

export default function ExecutiveHome() {
  return (
    <div className="p-6 flex flex-col gap-6 max-w-[1280px] mx-auto">

      {/* KPI Scoreboard — 5 count-up tiles */}
      <AgencyScoreboard />

      {/* Top row: Impact Brief + Conversion Chart */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <ImpactBrief />
        </div>
        <ConversionChart />
      </div>

      {/* OutcomeAI — 3 cards */}
      <OutcomeAIPanel />

      {/* Client Performance — full-width table */}
      <ClientPerformanceMap />

      {/* Shopper Insights highlights */}
      <ShopperInsightsPanel />

      {/* Bottom row: Live feed + Pulse alerts */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <TransactionFeed />
        </div>
        <InsightPulse />
      </div>
    </div>
  )
}
