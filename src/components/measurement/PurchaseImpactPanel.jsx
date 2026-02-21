// Purchase Impact Measurement — core In-Flight metrics panel
// Shows: CVR vs benchmark, New Buyer CVR, ROAS, CPA, Sales Driven, Avg Transaction

import { semantic, accent } from '../../tokens/colors'

const CTV_BENCHMARK = 0.028

function MetricRow({ label, value, sub, positive, benchmark }) {
  return (
    <div
      className="flex items-center justify-between py-3"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div>
        <div className="text-sm font-medium text-white">{label}</div>
        {sub && <div className="text-[11px] mt-0.5" style={{ color: semantic.muted }}>{sub}</div>}
      </div>
      <div className="text-right">
        <div
          className="text-base font-bold"
          style={{
            color:
              positive === true ? semantic.positive : positive === false ? '#EF4444' : '#FFFFFF',
          }}
        >
          {value}
        </div>
        {benchmark && (
          <div className="text-[10px]" style={{ color: semantic.muted }}>{benchmark}</div>
        )}
      </div>
    </div>
  )
}

function CvrBar({ cvr }) {
  const benchmarkPct = (CTV_BENCHMARK / 0.06) * 100
  const cvrPct = (cvr / 0.06) * 100
  const delta = cvr - CTV_BENCHMARK
  const deltaSign = delta >= 0 ? '+' : ''

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-white">Conversion Rate</span>
        <span className="text-sm font-bold text-white">{(cvr * 100).toFixed(1)}%</span>
      </div>
      <div
        className="h-2.5 rounded-full relative overflow-visible"
        style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
      >
        {/* benchmark marker */}
        <div
          className="absolute top-0 bottom-0 w-0.5 rounded"
          style={{
            left: `${benchmarkPct}%`,
            backgroundColor: '#2DD4BF',
            zIndex: 2,
          }}
        />
        {/* CVR fill */}
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${cvrPct}%`, backgroundColor: accent.blue }}
        />
      </div>
      <div className="flex items-center justify-between mt-1">
        <span className="text-[10px]" style={{ color: '#2DD4BF' }}>2.8% CTV benchmark</span>
        <span
          className="text-[10px] font-semibold"
          style={{ color: delta >= 0 ? semantic.positive : '#EF4444' }}
        >
          {deltaSign}{(delta * 100).toFixed(1)}pts vs benchmark
        </span>
      </div>
    </div>
  )
}

export default function PurchaseImpactPanel({ metrics }) {
  return (
    <div
      className="glass-card rounded-card p-5"
    >
      <div
        className="text-[11px] uppercase tracking-widest font-semibold mb-4"
        style={{ color: semantic.muted }}
      >
        Purchase Impact Measurement
      </div>

      <CvrBar cvr={metrics.conversionRate} />

      <MetricRow
        label="New Buyer CVR"
        value={`${(metrics.newBuyerCvr * 100).toFixed(2)}%`}
        sub="First-time purchasers"
        positive={metrics.newBuyerCvr >= 0.003}
        benchmark="0.22%–0.40% range"
      />
      <MetricRow
        label="New Buyer ROAS"
        value={`${metrics.newBuyerRoas.toFixed(1)}x`}
        sub="Return on ad spend, new buyers"
        positive={metrics.newBuyerRoas >= 1.5}
        benchmark="1.2x–2.1x range"
      />
      <MetricRow
        label="New Buyer Sales Driven"
        value={`$${(metrics.newBuyerSalesDriven / 1000).toFixed(0)}K`}
        sub="Incremental verified purchases"
        positive={true}
      />
      <MetricRow
        label="New Buyer CPA"
        value={`$${metrics.newBuyerCpa}`}
        sub="Avg cost per new buyer"
        positive={metrics.newBuyerCpa <= 120}
        benchmark="$94–$140 range"
      />
      <MetricRow
        label="Avg Transaction"
        value={`$${metrics.newBuyerAvgTransaction.toFixed(2)}`}
        sub="New buyer avg purchase value"
        positive={null}
      />
    </div>
  )
}
