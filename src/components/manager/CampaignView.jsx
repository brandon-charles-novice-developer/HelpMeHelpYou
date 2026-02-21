import { useParams, useNavigate } from 'react-router-dom'
import { clientsById } from '../../data/clients'
import { campaignsById } from '../../data/campaigns'
import { adGroupsByCampaign } from '../../data/adGroups'
import LevelHeader from './LevelHeader'
import SectionLabel from '../shared/SectionLabel'
import StatusBadge from '../shared/StatusBadge'
import PurchaseImpactPanel from '../measurement/PurchaseImpactPanel'
import SalesLiftChart from '../measurement/SalesLiftChart'
import ChannelSplitBar from '../measurement/ChannelSplitBar'

export default function CampaignView() {
  const { clientId, campaignId } = useParams()
  const navigate = useNavigate()

  const client = clientsById[clientId]
  const campaign = campaignsById[campaignId]
  const adGroups = adGroupsByCampaign[campaignId] || []

  if (!client || !campaign) return null

  const budgetPct = Math.round((campaign.spent / campaign.budget) * 100)

  return (
    <div className="p-6 max-w-[1280px] mx-auto">
      <LevelHeader
        crumbs={[
          { label: 'Tombras', path: '/manager' },
          { label: client.name, path: `/manager/${clientId}` },
          { label: campaign.name },
        ]}
        title={campaign.name}
        subtitle={`${campaign.dsp} · ${campaign.buyingType} · ${campaign.flightStart} – ${campaign.flightEnd}`}
        badge={<StatusBadge status={campaign.status} />}
      />

      {/* Campaign summary cards */}
      <div className="grid grid-cols-5 gap-4 mb-5">
        {[
          { label: 'Budget', value: `$${(campaign.budget / 1000).toFixed(0)}K`, sub: `$${(campaign.spent / 1000).toFixed(0)}K spent · ${budgetPct}%` },
          { label: 'Impressions', value: `${(campaign.impressions / 1000000).toFixed(1)}M`, sub: null },
          { label: 'Reach', value: `${(campaign.reach / 1000000).toFixed(1)}M`, sub: null },
          { label: 'Frequency', value: `${campaign.frequency}x`, sub: 'avg freq.' },
          { label: 'Conv. Rate', value: `${(campaign.metrics.conversionRate * 100).toFixed(1)}%`, sub: 'vs 2.8% benchmark', positive: true },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="glass-card rounded-card p-4"
          >
            <div className="text-[11px] uppercase tracking-widest font-semibold mb-2" style={{ color: '#AFADAD' }}>
              {kpi.label}
            </div>
            <div className="text-2xl font-bold text-white">{kpi.value}</div>
            {kpi.sub && <div className="text-[11px] mt-1" style={{ color: kpi.positive ? '#22C55E' : '#AFADAD' }}>{kpi.sub}</div>}
          </div>
        ))}
      </div>

      {/* Purchase Impact + Sales Lift */}
      <div className="grid grid-cols-3 gap-5 mb-5">
        <PurchaseImpactPanel metrics={campaign.metrics} />
        <div className="col-span-2 flex flex-col gap-4">
          <SalesLiftChart data={campaign.metrics.salesLiftData} />
          <ChannelSplitBar
            onlineSplit={client.metrics.onlineSplit}
            inStoreSplit={client.metrics.inStoreSplit}
          />
        </div>
      </div>

      {/* Ad Groups drill-down */}
      <SectionLabel>Ad Groups ({adGroups.length})</SectionLabel>

      <div
        className="glass-card rounded-card overflow-hidden"
      >
        <div
          className="grid px-5 py-3 text-[11px] uppercase tracking-widest font-semibold"
          style={{
            color: '#AFADAD',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            gridTemplateColumns: '260px 160px 1fr 1fr 1fr',
          }}
        >
          <span>Ad Group</span>
          <span>Audience Type</span>
          <span>Size</span>
          <span>Conv. Rate</span>
          <span>Propensity (30-day)</span>
        </div>

        {adGroups.map((ag) => {
          const prop30 = ag.propensityWindows?.find((w) => w.window === '30-day')
          return (
            <button
              key={ag.id}
              className="w-full text-left grid px-5 py-4 items-center row-hover"
              style={{
                gridTemplateColumns: '260px 160px 1fr 1fr 1fr',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
              }}
              onClick={() => navigate(`/manager/${clientId}/${campaignId}/${ag.id}`)}
            >
              <div>
                <div className="text-sm font-semibold text-white truncate pr-2">{ag.name}</div>
                <div className="text-[11px] mt-0.5 truncate" style={{ color: '#AFADAD' }}>
                  {ag.audienceSegment}
                </div>
              </div>

              <span
                className="text-[11px] px-2.5 py-1 rounded-full font-semibold inline-flex"
                style={{ backgroundColor: 'rgba(92,112,214,0.15)', color: '#5C70D6' }}
              >
                {ag.audienceType}
              </span>

              <div className="text-sm text-white">
                {(ag.audienceSize / 1000000).toFixed(1)}M
              </div>

              <div className="text-sm font-bold text-white">
                {(ag.metrics.conversionRate * 100).toFixed(1)}%
              </div>

              <div>
                {prop30 && (
                  <span
                    className="text-sm font-bold"
                    style={{
                      color: prop30.score >= 90 ? '#22C55E' : prop30.score >= 80 ? '#5C70D6' : '#F59E0B',
                    }}
                  >
                    {prop30.score} <span className="text-xs font-normal" style={{ color: '#AFADAD' }}>· {prop30.label}</span>
                  </span>
                )}
              </div>
            </button>
          )
        })}

        {adGroups.length === 0 && (
          <div className="px-5 py-8 text-center text-sm" style={{ color: '#AFADAD' }}>
            No ad groups configured
          </div>
        )}
      </div>
    </div>
  )
}
