import { useParams } from 'react-router-dom'
import { clientsById } from '../../data/clients'
import { campaignsById } from '../../data/campaigns'
import { adGroupsById } from '../../data/adGroups'
import { packagesById } from '../../data/packages'
import { dealsById } from '../../data/deals'
import { creativesById } from '../../data/creatives'
import { geosById } from '../../data/geos'
import LevelHeader from './LevelHeader'

export default function GeoView() {
  const { clientId, campaignId, adGroupId, packageId, dealId, creativeId, geoId } = useParams()

  const client = clientsById[clientId]
  const campaign = campaignsById[campaignId]
  const adGroup = adGroupsById[adGroupId]
  const pkg = packagesById[packageId]
  const deal = dealsById[dealId]
  const creative = creativesById[creativeId]
  const geo = geosById[geoId]

  if (!client || !campaign || !creative || !geo) return null

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
          { label: creative.name, path: `/manager/${clientId}/${campaignId}/${adGroupId}/${packageId}/${dealId}/${creativeId}` },
          { label: geo.dma },
        ]}
        title={geo.dma}
        subtitle={`DMA ${geo.dmaCode} · ${creative.name} · ${campaign.name}`}
      />

      {/* Geo metrics */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {[
          { label: 'DMA', value: `#${geo.dmaCode}` },
          { label: 'Impressions', value: `${(geo.impressions / 1000000).toFixed(1)}M` },
          { label: 'Spend', value: `$${(geo.spend / 1000).toFixed(1)}K` },
          { label: 'Conv. Rate', value: `${(geo.metrics.conversionRate * 100).toFixed(1)}%`, positive: true },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-card p-4"
            style={{ backgroundColor: '#252040', boxShadow: 'rgba(0,0,0,0.15) 0px 1px 20px 0px' }}
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

      {/* New Buyer breakdown */}
      <div
        className="rounded-card p-5"
        style={{ backgroundColor: '#252040', boxShadow: 'rgba(0,0,0,0.15) 0px 1px 20px 0px' }}
      >
        <div className="text-[11px] uppercase tracking-widest font-semibold mb-4" style={{ color: '#AFADAD' }}>
          New Buyer Performance
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-[11px]" style={{ color: '#AFADAD' }}>New Buyer CVR</div>
            <div className="text-xl font-bold text-white mt-1">
              {(geo.metrics.newBuyerCvr * 100).toFixed(2)}%
            </div>
          </div>
          <div>
            <div className="text-[11px]" style={{ color: '#AFADAD' }}>vs. Campaign Avg</div>
            <div
              className="text-xl font-bold mt-1"
              style={{
                color: geo.metrics.conversionRate >= 0.05 ? '#22C55E' : '#AFADAD',
              }}
            >
              {geo.metrics.conversionRate >= 0.05 ? '↑ Above avg' : '≈ On avg'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
