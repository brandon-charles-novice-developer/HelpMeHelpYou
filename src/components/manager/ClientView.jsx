import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { clientsById } from '../../data/clients'
import { campaignsByClient } from '../../data/campaigns'
import { cardsByClient } from '../../data/outcomeAI'
import LevelHeader from './LevelHeader'
import SectionLabel from '../shared/SectionLabel'
import StatusBadge from '../shared/StatusBadge'
import BuyingTypeBadge from '../shared/BuyingTypeBadge'
import OutcomeAICard from '../executive/OutcomeAICard'
import ShopperInsightsTabs from '../insights/ShopperInsightsTabs'
import PurchaseImpactPanel from '../measurement/PurchaseImpactPanel'
import ChannelSplitBar from '../measurement/ChannelSplitBar'
import RetailerBreakdown from '../measurement/RetailerBreakdown'

const TABS = ['Campaigns', 'Shopper Insights', 'Purchase Impact']

function PacingPill({ pacing, status }) {
  const color =
    status === 'on_track' ? '#22C55E'
    : status === 'underpacing' ? '#EF4444'
    : '#F59E0B'
  return (
    <span className="text-xs font-semibold" style={{ color }}>
      {Math.round(pacing * 100)}%
    </span>
  )
}

export default function ClientView() {
  const { clientId } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Campaigns')

  const client = clientsById[clientId]
  const campaigns = campaignsByClient[clientId] || []
  const aiCards = cardsByClient[clientId] || []

  if (!client) {
    return (
      <div className="p-6 text-center" style={{ color: '#AFADAD' }}>
        Client not found
      </div>
    )
  }

  return (
    <div className="p-6 max-w-[1280px] mx-auto">
      <LevelHeader
        crumbs={[
          { label: 'Tombras', path: '/manager' },
          { label: client.name },
        ]}
        title={client.name}
        subtitle={`${client.vertical} · ${client.description}`}
        badge={<BuyingTypeBadge type={client.buyingType} />}
      />

      {/* Alert banner */}
      {client.alert && (
        <div
          className="rounded-card px-5 py-3 mb-5 flex items-start gap-2"
          style={{
            backgroundColor:
              client.alert.type === 'positive'
                ? 'rgba(34,197,94,0.08)'
                : 'rgba(245,158,11,0.08)',
            border: `1px solid ${client.alert.type === 'positive' ? 'rgba(34,197,94,0.2)' : 'rgba(245,158,11,0.2)'}`,
          }}
        >
          <span style={{ color: client.alert.type === 'positive' ? '#22C55E' : '#F59E0B' }}>
            {client.alert.type === 'positive' ? '✓' : '⚠'}
          </span>
          <span className="text-sm" style={{ color: '#D4D2D2' }}>{client.alert.message}</span>
        </div>
      )}

      {/* OutcomeAI cards for this client */}
      {aiCards.length > 0 && (
        <div className="mb-5">
          <SectionLabel>OutcomeAI for {client.name}</SectionLabel>
          <div className="grid grid-cols-1 gap-4">
            {aiCards.map((card) => (
              <OutcomeAICard key={card.id} card={card} />
            ))}
          </div>
        </div>
      )}

      {/* Tab navigation */}
      <div
        className="flex gap-1 mb-5 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}
      >
        {TABS.map((tab) => {
          const active = tab === activeTab
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-2.5 text-xs font-semibold transition-all"
              style={{
                color: active ? '#FFFFFF' : '#AFADAD',
                borderBottom: active ? '2px solid #67579E' : '2px solid transparent',
                marginBottom: -1,
              }}
            >
              {tab}
            </button>
          )
        })}
      </div>

      {/* Campaigns tab */}
      {activeTab === 'Campaigns' && (
        <div
          className="glass-card rounded-card overflow-hidden"
        >
          <div
            className="grid px-5 py-3 text-[11px] uppercase tracking-widest font-semibold"
            style={{
              color: '#AFADAD',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              gridTemplateColumns: '220px 100px 1fr 1fr 1fr 80px',
            }}
          >
            <span>Campaign</span>
            <span>Status</span>
            <span>Conv. Rate</span>
            <span>New Buyer ROAS</span>
            <span>Budget Pacing</span>
            <span>DSP</span>
          </div>

          {campaigns.map((campaign) => (
            <button
              key={campaign.id}
              className="w-full text-left grid px-5 py-4 items-center row-hover"
              style={{
                gridTemplateColumns: '220px 100px 1fr 1fr 1fr 80px',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
              }}
              onClick={() => navigate(`/manager/${clientId}/${campaign.id}`)}
            >
              <div>
                <div className="text-sm font-semibold text-white truncate pr-2">{campaign.name}</div>
                <div className="text-[11px] mt-0.5" style={{ color: '#AFADAD' }}>
                  {campaign.flightStart} – {campaign.flightEnd}
                </div>
              </div>

              <StatusBadge status={campaign.status} size="xs" />

              <div className="text-sm font-bold text-white">
                {(campaign.metrics.conversionRate * 100).toFixed(1)}%
              </div>

              <div className="text-sm font-bold text-white">
                {campaign.metrics.newBuyerRoas.toFixed(1)}x
              </div>

              <PacingPill pacing={campaign.pacing} status={campaign.pacingStatus} />

              <div className="text-[11px]" style={{ color: '#AFADAD' }}>
                {campaign.dsp?.split(' ')[0]}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Shopper Insights tab */}
      {activeTab === 'Shopper Insights' && (
        <ShopperInsightsTabs clientId={clientId} />
      )}

      {/* Purchase Impact tab */}
      {activeTab === 'Purchase Impact' && (
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <PurchaseImpactPanel metrics={client.metrics} />
          </div>
          <div className="flex flex-col gap-4">
            <ChannelSplitBar
              onlineSplit={client.metrics.onlineSplit}
              inStoreSplit={client.metrics.inStoreSplit}
            />
            {client.retailerBreakdown && (
              <RetailerBreakdown retailers={client.retailerBreakdown} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
