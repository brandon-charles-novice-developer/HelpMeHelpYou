import { useParams, useNavigate } from 'react-router-dom'
import { clientsById } from '../../data/clients'
import { campaignsById } from '../../data/campaigns'
import { adGroupsById } from '../../data/adGroups'
import { packagesByAdGroup } from '../../data/packages'
import LevelHeader from './LevelHeader'
import SectionLabel from '../shared/SectionLabel'

function scoreColor(score) {
  if (score >= 90) return '#22C55E'
  if (score >= 80) return '#5C70D6'
  if (score >= 65) return '#F59E0B'
  return '#AFADAD'
}

export default function AdGroupView() {
  const { clientId, campaignId, adGroupId } = useParams()
  const navigate = useNavigate()

  const client = clientsById[clientId]
  const campaign = campaignsById[campaignId]
  const adGroup = adGroupsById[adGroupId]
  const packages = packagesByAdGroup[adGroupId] || []

  if (!client || !campaign || !adGroup) return null

  return (
    <div className="p-6 max-w-[1280px] mx-auto">
      <LevelHeader
        crumbs={[
          { label: 'Tombras', path: '/manager' },
          { label: client.name, path: `/manager/${clientId}` },
          { label: campaign.name, path: `/manager/${clientId}/${campaignId}` },
          { label: adGroup.name },
        ]}
        title={adGroup.name}
        subtitle={adGroup.audienceSegment}
        badge={
          <span
            className="text-xs px-2.5 py-1 rounded-full font-semibold"
            style={{ backgroundColor: 'rgba(92,112,214,0.2)', color: '#5C70D6' }}
          >
            {adGroup.audienceType}
          </span>
        }
      />

      {/* Outcome Audience detail */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {/* Audience overview card */}
        <div
          className="glass-card col-span-2 rounded-card p-5"
        >
          <div className="text-[11px] uppercase tracking-widest font-semibold mb-4" style={{ color: '#AFADAD' }}>
            Outcome Audience Detail
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-[11px]" style={{ color: '#AFADAD' }}>Audience Size</div>
              <div className="text-2xl font-bold text-white mt-1">
                {(adGroup.audienceSize / 1000000).toFixed(1)}M
              </div>
              <div className="text-xs mt-0.5" style={{ color: '#AFADAD' }}>opted-in consumers</div>
            </div>
            <div>
              <div className="text-[11px]" style={{ color: '#AFADAD' }}>Verification</div>
              <div
                className="text-sm font-bold mt-1 flex items-center gap-1"
                style={{ color: '#22C55E' }}
              >
                <span>✓</span> Verified Purchase
              </div>
              <div className="text-xs mt-0.5" style={{ color: '#AFADAD' }}>purchase-linked</div>
            </div>
            <div>
              <div className="text-[11px]" style={{ color: '#AFADAD' }}>Demo Filter</div>
              <div className="text-sm text-white mt-1">{adGroup.selfReportedFilter}</div>
            </div>
          </div>

          <div
            className="mt-4 pt-4"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="text-[11px] uppercase tracking-widest font-semibold mb-3" style={{ color: '#AFADAD' }}>
              Purchase Propensity Windows
            </div>
            <div className="grid grid-cols-4 gap-3">
              {adGroup.propensityWindows.map((w) => (
                <div
                  key={w.window}
                  className="rounded-lg p-3 text-center"
                  style={{ backgroundColor: 'rgba(30, 26, 46, 0.6)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
                >
                  <div className="text-[11px] font-semibold mb-1" style={{ color: '#AFADAD' }}>
                    {w.window}
                  </div>
                  <div className="text-xl font-bold" style={{ color: scoreColor(w.score) }}>
                    {w.score}
                  </div>
                  <div
                    className="text-[10px] mt-0.5 font-semibold uppercase tracking-wider"
                    style={{ color: scoreColor(w.score) }}
                  >
                    {w.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Metrics card */}
        <div
          className="glass-card rounded-card p-5 flex flex-col gap-4"
        >
          <div className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: '#AFADAD' }}>
            Performance
          </div>
          {[
            { label: 'Conv. Rate', value: `${(adGroup.metrics.conversionRate * 100).toFixed(1)}%` },
            { label: 'Impressions', value: `${(adGroup.metrics.impressions / 1000000).toFixed(1)}M` },
            { label: 'Spend', value: `$${(adGroup.metrics.spend / 1000).toFixed(0)}K` },
          ].map((m) => (
            <div key={m.label} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <span className="text-sm" style={{ color: '#AFADAD' }}>{m.label}</span>
              <span className="text-sm font-bold text-white">{m.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Packages */}
      <SectionLabel>Packages ({packages.length || 0})</SectionLabel>
      <div
        className="glass-card rounded-card overflow-hidden"
      >
        {packages.length > 0 ? (
          <>
            <div
              className="grid px-5 py-3 text-[11px] uppercase tracking-widest font-semibold"
              style={{
                color: '#AFADAD',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                gridTemplateColumns: '220px 100px 1fr 1fr 1fr',
              }}
            >
              <span>Package</span>
              <span>Environment</span>
              <span>Impressions</span>
              <span>CPM</span>
              <span>Conv. Rate</span>
            </div>
            {packages.map((pkg) => (
              <button
                key={pkg.id}
                className="w-full text-left grid px-5 py-4 items-center row-hover"
                style={{
                  gridTemplateColumns: '220px 100px 1fr 1fr 1fr',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                }}
                onClick={() => navigate(`/manager/${clientId}/${campaignId}/${adGroupId}/${pkg.id}`)}
              >
                <div>
                  <div className="text-sm font-semibold text-white">{pkg.name}</div>
                  <div className="text-[11px] mt-0.5" style={{ color: '#AFADAD' }}>{pkg.format}</div>
                </div>
                <span className="text-xs" style={{ color: '#C4B5FD' }}>{pkg.environment}</span>
                <span className="text-sm text-white">{(pkg.impressions / 1000000).toFixed(1)}M</span>
                <span className="text-sm text-white">${pkg.cpm.toFixed(2)}</span>
                <span className="text-sm font-bold text-white">{(pkg.metrics.conversionRate * 100).toFixed(1)}%</span>
              </button>
            ))}
          </>
        ) : (
          <div className="px-5 py-8 text-center text-sm" style={{ color: '#AFADAD' }}>
            No packages yet — drill from Campaign Manager to configure
          </div>
        )}
      </div>
    </div>
  )
}
