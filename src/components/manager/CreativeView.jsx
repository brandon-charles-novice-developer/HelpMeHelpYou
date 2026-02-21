import { useParams, useNavigate } from 'react-router-dom'
import { clientsById } from '../../data/clients'
import { campaignsById } from '../../data/campaigns'
import { adGroupsById } from '../../data/adGroups'
import { packagesById } from '../../data/packages'
import { dealsById } from '../../data/deals'
import { creativesById } from '../../data/creatives'
import { geosByCreative } from '../../data/geos'
import LevelHeader from './LevelHeader'
import DrillTable from './DrillTable'
import SectionLabel from '../shared/SectionLabel'
import StatusBadge from '../shared/StatusBadge'

export default function CreativeView() {
  const { clientId, campaignId, adGroupId, packageId, dealId, creativeId } = useParams()
  const navigate = useNavigate()

  const client = clientsById[clientId]
  const campaign = campaignsById[campaignId]
  const adGroup = adGroupsById[adGroupId]
  const pkg = packagesById[packageId]
  const deal = dealsById[dealId]
  const creative = creativesById[creativeId]
  const geos = geosByCreative[creativeId] || []

  if (!client || !campaign || !creative) return null

  return (
    <div className="p-6 max-w-[1280px] mx-auto">
      <LevelHeader
        crumbs={[
          { label: 'Tombras', path: '/manager' },
          { label: client.name, path: `/manager/${clientId}` },
          { label: campaign.name, path: `/manager/${clientId}/${campaignId}` },
          { label: adGroup?.name || 'Ad Group', path: `/manager/${clientId}/${campaignId}/${adGroupId}` },
          { label: pkg?.name || 'Package', path: `/manager/${clientId}/${campaignId}/${adGroupId}/${packageId}` },
          { label: deal?.name || 'Deal', path: `/manager/${clientId}/${campaignId}/${adGroupId}/${packageId}/${dealId}` },
          { label: creative.name },
        ]}
        title={creative.name}
        subtitle={`${creative.format} · ${creative.size}`}
        badge={<StatusBadge status={creative.approvalStatus} size="xs" />}
      />

      {/* Creative metrics */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {[
          { label: 'Impressions', value: `${(creative.impressions / 1000000).toFixed(1)}M` },
          { label: 'Conv. Rate', value: `${(creative.metrics.conversionRate * 100).toFixed(1)}%`, positive: true },
          ...(creative.metrics.completionRate ? [{ label: 'Completion Rate', value: `${Math.round(creative.metrics.completionRate * 100)}%`, positive: creative.metrics.completionRate >= 0.90 }] : []),
          ...(creative.metrics.vtr ? [{ label: 'VTR', value: `${Math.round(creative.metrics.vtr * 100)}%` }] : []),
          ...(creative.metrics.ctr ? [{ label: 'CTR', value: `${(creative.metrics.ctr * 100).toFixed(2)}%` }] : []),
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="glass-card rounded-card p-4"
          >
            <div className="text-[11px] uppercase tracking-widest font-semibold mb-2" style={{ color: '#AFADAD' }}>
              {kpi.label}
            </div>
            <div
              className="text-2xl font-bold"
              style={{ color: kpi.positive ? '#22C55E' : '#FFFFFF' }}
            >
              {kpi.value}
            </div>
          </div>
        ))}
      </div>

      {/* Tags */}
      {creative.tags?.length > 0 && (
        <div className="flex gap-2 mb-5">
          {creative.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2.5 py-1 rounded-full"
              style={{ backgroundColor: 'rgba(103,87,158,0.2)', color: '#C4B5FD', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Geo breakdown */}
      <SectionLabel>Geo Performance ({geos.length} DMAs)</SectionLabel>
      {geos.length > 0 ? (
        <DrillTable
          columns={[
            { key: 'dma', label: 'DMA', width: '220px', render: (v) => (
              <span className="text-sm font-semibold text-white">{v}</span>
            )},
            { key: 'impressions', label: 'Impressions', render: (v) => (
              <span className="text-sm text-white">{(v / 1000000).toFixed(1)}M</span>
            )},
            { key: 'spend', label: 'Spend', render: (v) => (
              <span className="text-sm text-white">${(v / 1000).toFixed(1)}K</span>
            )},
            { key: 'conversionRate', label: 'Conv. Rate', render: (_, row) => (
              <span
                className="text-sm font-bold"
                style={{ color: row.metrics.conversionRate >= 0.05 ? '#22C55E' : '#FFFFFF' }}
              >
                {(row.metrics.conversionRate * 100).toFixed(1)}%
              </span>
            )},
          ]}
          rows={geos}
          onRowClick={(row) => navigate(`/manager/${clientId}/${campaignId}/${adGroupId}/${packageId}/${dealId}/${creativeId}/${row.id}`)}
        />
      ) : (
        <div
          className="glass-card rounded-card overflow-hidden"
        >
          <div className="px-5 py-8 text-center text-sm" style={{ color: '#AFADAD' }}>
            No geo data available for this creative
          </div>
        </div>
      )}
    </div>
  )
}
