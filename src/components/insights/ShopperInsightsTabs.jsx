import { useState } from 'react'
import { shopperInsights } from '../../data/shopperInsights'
import { bg, semantic, brand } from '../../tokens/colors'
import SwitchingBehaviorChart from './SwitchingBehaviorChart'
import LoyaltySegmentsChart from './LoyaltySegmentsChart'
import CrossPurchaseChart from './CrossPurchaseChart'
import BasketAssociationChart from './BasketAssociationChart'
import PropensityWindowChart from './PropensityWindowChart'
import CategoryInsightsChart from './CategoryInsightsChart'

const TABS = [
  { id: 'switching',   label: 'Switching Behavior' },
  { id: 'loyalty',     label: 'Loyalty Segments' },
  { id: 'cross',       label: 'Cross-Purchase' },
  { id: 'category',    label: 'Category Insights' },
  { id: 'basket',      label: 'Basket Association' },
  { id: 'propensity',  label: 'Purchase Propensity' },
]

export default function ShopperInsightsTabs({ clientId }) {
  const [activeTab, setActiveTab] = useState('switching')
  const data = shopperInsights[clientId]

  if (!data) return null

  return (
    <div
      className="rounded-card overflow-hidden"
      style={{
        backgroundColor: bg.card,
        boxShadow: 'rgba(0, 0, 0, 0.2) 0px 1px 30px 0px',
      }}
    >
      {/* Tab bar */}
      <div
        className="flex items-center gap-1 px-4 pt-4 pb-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        {TABS.map((tab) => {
          const active = tab.id === activeTab
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all duration-150"
              style={{
                color: active ? '#FFFFFF' : semantic.muted,
                backgroundColor: active ? bg.base : 'transparent',
                borderBottom: active ? `2px solid ${brand.primary}` : '2px solid transparent',
                marginBottom: -1,
              }}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      <div className="p-5">
        {activeTab === 'switching'  && <SwitchingBehaviorChart data={data.switching} />}
        {activeTab === 'loyalty'    && <LoyaltySegmentsChart data={data.loyalty} />}
        {activeTab === 'cross'      && <CrossPurchaseChart data={data.crossPurchase} />}
        {activeTab === 'category'   && <CategoryInsightsChart data={data.category} />}
        {activeTab === 'basket'     && <BasketAssociationChart data={data.basket} />}
        {activeTab === 'propensity' && <PropensityWindowChart data={data.propensity} />}
      </div>
    </div>
  )
}
