import { useParams, useNavigate } from 'react-router-dom'
import { clientsById } from '../../data/clients'
import { campaignsById } from '../../data/campaigns'
import { adGroupsById } from '../../data/adGroups'
import { packagesById } from '../../data/packages'
import { dealsByPackage } from '../../data/deals'
import LevelHeader from './LevelHeader'
import DrillTable from './DrillTable'
import SectionLabel from '../shared/SectionLabel'

export default function PackageView() {
  const { clientId, campaignId, adGroupId, packageId } = useParams()
  const navigate = useNavigate()

  const client = clientsById[clientId]
  const campaign = campaignsById[campaignId]
  const adGroup = adGroupsById[adGroupId]
  const pkg = packagesById[packageId]
  const deals = dealsByPackage[packageId] || []

  if (!client || !campaign || !adGroup || !pkg) return null

  return (
    <div className="p-6 max-w-[1280px] mx-auto">
      <LevelHeader
        crumbs={[
          { label: 'Tombras', path: '/manager' },
          { label: client.name, path: `/manager/${clientId}` },
          { label: campaign.name, path: `/manager/${clientId}/${campaignId}` },
          { label: adGroup.name, path: `/manager/${clientId}/${campaignId}/${adGroupId}` },
          { label: pkg.name },
        ]}
        title={pkg.name}
        subtitle={`${pkg.environment} · ${pkg.format}`}
      />

      {/* Package metrics */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {[
          { label: 'Impressions', value: `${(pkg.impressions / 1000000).toFixed(1)}M` },
          { label: 'Spend', value: `$${(pkg.spent / 1000).toFixed(0)}K` },
          { label: 'CPM', value: `$${pkg.cpm.toFixed(2)}` },
          { label: 'Conv. Rate', value: `${(pkg.metrics.conversionRate * 100).toFixed(1)}%` },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-card p-4"
            style={{ backgroundColor: '#252040', boxShadow: 'rgba(0,0,0,0.15) 0px 1px 20px 0px' }}
          >
            <div className="text-[11px] uppercase tracking-widest font-semibold mb-2" style={{ color: '#AFADAD' }}>
              {kpi.label}
            </div>
            <div className="text-2xl font-bold text-white">{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Deals */}
      <SectionLabel>Deals ({deals.length})</SectionLabel>
      {deals.length > 0 ? (
        <DrillTable
          columns={[
            { key: 'name', label: 'Deal Name', width: '220px', render: (_, row) => (
              <div>
                <div className="text-sm font-semibold text-white truncate pr-2">{row.name}</div>
                <div className="text-[11px] mt-0.5" style={{ color: '#AFADAD' }}>{row.format}</div>
              </div>
            )},
            { key: 'dealType', label: 'Type', width: '80px', render: (v) => (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: 'rgba(92,112,214,0.15)', color: '#5C70D6' }}>{v}</span>
            )},
            { key: 'dealId', label: 'Deal ID', width: '120px', render: (v) => (
              <span className="text-xs font-mono" style={{ color: '#AFADAD' }}>{v}</span>
            )},
            { key: 'publisher', label: 'Publisher' },
            { key: 'cpm', label: 'CPM', render: (v) => <span className="text-sm text-white">${v.toFixed(2)}</span> },
            { key: 'conversionRate', label: 'Conv. Rate', render: (_, row) => (
              <span className="text-sm font-bold text-white">{(row.metrics.conversionRate * 100).toFixed(1)}%</span>
            )},
          ]}
          rows={deals}
          onRowClick={(row) => navigate(`/manager/${clientId}/${campaignId}/${adGroupId}/${packageId}/${row.id}`)}
        />
      ) : (
        <div
          className="rounded-card overflow-hidden"
          style={{ backgroundColor: '#252040', boxShadow: 'rgba(0,0,0,0.15) 0px 1px 20px 0px' }}
        >
          <div className="px-5 py-8 text-center text-sm" style={{ color: '#AFADAD' }}>
            No deals attached to this package
          </div>
        </div>
      )}
    </div>
  )
}
