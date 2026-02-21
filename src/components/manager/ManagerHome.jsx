import { useNavigate } from 'react-router-dom'
import { clients } from '../../data/clients'
import { fmt } from '../../utils/fmt'
import SectionLabel from '../shared/SectionLabel'
import BuyingTypeBadge from '../shared/BuyingTypeBadge'

export default function ManagerHome() {
  const navigate = useNavigate()

  return (
    <div className="p-6 max-w-[1280px] mx-auto">
      {/* Page header */}
      <div className="mb-6">
        <div
          className="text-[11px] uppercase tracking-widest font-semibold mb-1"
          style={{ color: '#AFADAD' }}
        >
          Campaign Manager · Tombras
        </div>
        <h1 className="text-2xl font-bold text-white">Client Overview</h1>
        <p className="text-sm mt-1" style={{ color: '#AFADAD' }}>
          5 clients · 11 active campaigns · Click a client to drill in
        </p>
      </div>

      {/* Client cards grid */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {clients.map((client) => (
          <button
            key={client.id}
            className="glass-card rounded-card p-5 text-left transition-all duration-200 hover:-translate-y-0.5"
            onClick={() => navigate(`/manager/${client.id}`)}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white mb-3"
              style={{ backgroundColor: client.logoColor }}
            >
              {client.logo}
            </div>
            <div className="text-sm font-bold text-white mb-0.5">{client.name}</div>
            <div className="text-[11px] mb-3" style={{ color: '#AFADAD' }}>{client.vertical}</div>

            <div className="text-xl font-bold text-white">
              {fmt(client.metrics.incrementalRevenue, '$')}
            </div>
            <div className="text-[11px]" style={{ color: '#22C55E' }}>
              incremental revenue
            </div>

            <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <BuyingTypeBadge type={client.buyingType} />
            </div>
          </button>
        ))}
      </div>

      {/* Detailed client table */}
      <SectionLabel>All Clients</SectionLabel>
      <div
        className="glass-card rounded-card overflow-hidden"
      >
        <div
          className="grid px-5 py-3 text-[11px] uppercase tracking-widest font-semibold"
          style={{
            color: '#AFADAD',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            gridTemplateColumns: '180px 1fr 1fr 1fr 1fr 120px',
          }}
        >
          <span>Client</span>
          <span>Conv. Rate</span>
          <span>New Buyer ROAS</span>
          <span>New Buyer CPA</span>
          <span>Campaigns</span>
          <span>Channels</span>
        </div>

        {clients.map((client) => (
          <button
            key={client.id}
            className="w-full text-left grid px-5 py-4 items-center row-hover"
            style={{
              gridTemplateColumns: '180px 1fr 1fr 1fr 1fr 120px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
            }}
            onClick={() => navigate(`/manager/${client.id}`)}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                style={{ backgroundColor: client.logoColor }}
              >
                {client.logo}
              </div>
              <span className="text-sm font-semibold text-white">{client.name}</span>
            </div>

            <div>
              <span className="text-sm font-bold text-white">
                {(client.metrics.conversionRate * 100).toFixed(1)}%
              </span>
            </div>

            <div>
              <span className="text-sm font-bold text-white">
                {client.metrics.newBuyerRoas.toFixed(1)}x
              </span>
            </div>

            <div>
              <span className="text-sm font-bold text-white">
                ${client.metrics.newBuyerCpa}
              </span>
            </div>

            <div>
              <span className="text-sm text-white">{client.metrics.activeCampaigns} active</span>
            </div>

            <div className="flex flex-wrap gap-1">
              {client.channels.slice(0, 2).map((ch) => (
                <span
                  key={ch}
                  className="text-[10px] px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: 'rgba(92, 112, 214, 0.15)', color: '#5C70D6' }}
                >
                  {ch}
                </span>
              ))}
              {client.channels.length > 2 && (
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: 'rgba(175,173,173,0.1)', color: '#AFADAD' }}
                >
                  +{client.channels.length - 2}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
