import { useParams, useNavigate } from 'react-router-dom'
import { clientsById } from '../../data/clients'
import { campaignsById } from '../../data/campaigns'
import { adGroupsById } from '../../data/adGroups'
import { packagesById } from '../../data/packages'
import { dealsById } from '../../data/deals'
import { creativesByDeal } from '../../data/creatives'
import LevelHeader from './LevelHeader'
import DrillTable from './DrillTable'
import SectionLabel from '../shared/SectionLabel'
import StatusBadge from '../shared/StatusBadge'

export default function DealView() {
  const { clientId, campaignId, adGroupId, packageId, dealId } = useParams()
  const navigate = useNavigate()

  const client = clientsById[clientId]
  const campaign = campaignsById[campaignId]
  const adGroup = adGroupsById[adGroupId]
  const pkg = packagesById[packageId]
  const deal = dealsById[dealId]
  const creatives = creativesByDeal[dealId] || []

  if (!client || !campaign || !adGroup || !pkg || !deal) return null

  return (
    <div className="p-6 max-w-[1280px] mx-auto">
      <LevelHeader
        crumbs={[
          { label: 'Tombras', path: '/manager' },
          { label: client.name, path: `/manager/${clientId}` },
          { label: campaign.name, path: `/manager/${clientId}/${campaignId}` },
          { label: adGroup.name, path: `/manager/${clientId}/${campaignId}/${adGroupId}` },
          { label: pkg.name, path: `/manager/${clientId}/${campaignId}/${adGroupId}/${packageId}` },
          { label: deal.name },
        ]}
        title={deal.name}
        subtitle={`${deal.dealType} · ${deal.publisher} · ${deal.dealId}`}
      />

      {/* Deal detail */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {[
          { label: 'Deal Type', value: deal.dealType, color: '#5C70D6' },
          { label: 'CPM', value: `$${deal.cpm.toFixed(2)}`, color: null },
          { label: 'Imps Bought', value: `${(deal.impressionsBought / 1000000).toFixed(1)}M`, color: null },
          { label: 'Conv. Rate', value: `${(deal.metrics.conversionRate * 100).toFixed(1)}%`, color: '#22C55E' },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-card p-4"
            style={{ backgroundColor: '#252040', boxShadow: 'rgba(0,0,0,0.15) 0px 1px 20px 0px' }}
          >
            <div className="text-[11px] uppercase tracking-widest font-semibold mb-2" style={{ color: '#AFADAD' }}>
              {kpi.label}
            </div>
            <div className="text-2xl font-bold" style={{ color: kpi.color || '#FFFFFF' }}>
              {kpi.value}
            </div>
          </div>
        ))}
      </div>

      {/* Viewability */}
      {deal.metrics.viewability && (
        <div
          className="rounded-card px-5 py-3 mb-5 flex items-center gap-3"
          style={{ backgroundColor: '#252040' }}
        >
          <span className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: '#AFADAD' }}>
            Viewability
          </span>
          <span className="text-sm font-bold" style={{ color: '#22C55E' }}>
            {Math.round(deal.metrics.viewability * 100)}%
          </span>
          <span className="text-xs" style={{ color: '#AFADAD' }}>
            (industry avg: 70%)
          </span>
        </div>
      )}

      {/* Creatives */}
      <SectionLabel>Creatives ({creatives.length})</SectionLabel>
      {creatives.length > 0 ? (
        <DrillTable
          columns={[
            { key: 'name', label: 'Creative', width: '220px', render: (_, row) => (
              <div>
                <div className="text-sm font-semibold text-white truncate pr-2">{row.name}</div>
                <div className="text-[11px] mt-0.5" style={{ color: '#AFADAD' }}>{row.size}</div>
              </div>
            )},
            { key: 'format', label: 'Format', width: '100px', render: (v) => (
              <span className="text-xs" style={{ color: '#AFADAD' }}>{v}</span>
            )},
            { key: 'approvalStatus', label: 'Status', width: '100px', render: (v) => (
              <StatusBadge status={v} size="xs" />
            )},
            { key: 'impressions', label: 'Impressions', render: (v) => (
              <span className="text-sm text-white">{(v / 1000000).toFixed(1)}M</span>
            )},
            { key: 'conversionRate', label: 'Conv. Rate', render: (_, row) => (
              <span className="text-sm font-bold text-white">{(row.metrics.conversionRate * 100).toFixed(1)}%</span>
            )},
            { key: 'completionRate', label: 'Completion', render: (_, row) => (
              <span className="text-sm text-white">
                {row.metrics.completionRate ? `${Math.round(row.metrics.completionRate * 100)}%` : '—'}
              </span>
            )},
          ]}
          rows={creatives}
          onRowClick={(row) => navigate(`/manager/${clientId}/${campaignId}/${adGroupId}/${packageId}/${dealId}/${row.id}`)}
        />
      ) : (
        <div
          className="rounded-card overflow-hidden"
          style={{ backgroundColor: '#252040', boxShadow: 'rgba(0,0,0,0.15) 0px 1px 20px 0px' }}
        >
          <div className="px-5 py-8 text-center text-sm" style={{ color: '#AFADAD' }}>
            No creatives attached to this deal
          </div>
        </div>
      )}
    </div>
  )
}
