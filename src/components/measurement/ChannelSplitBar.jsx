// Online vs In-Store split visualization

export default function ChannelSplitBar({ onlineSplit, inStoreSplit }) {
  const onlinePct = Math.round(onlineSplit * 100)
  const inStorePct = Math.round(inStoreSplit * 100)

  return (
    <div
      className="rounded-card p-4"
      style={{
        backgroundColor: '#252040',
        boxShadow: 'rgba(0, 0, 0, 0.15) 0px 1px 20px 0px',
      }}
    >
      <div
        className="text-[11px] uppercase tracking-widest font-semibold mb-3"
        style={{ color: '#AFADAD' }}
      >
        Purchase Channel Split
      </div>

      <div className="flex h-3 rounded-full overflow-hidden mb-3">
        <div
          className="h-full transition-all duration-700"
          style={{ width: `${onlinePct}%`, backgroundColor: '#5C70D6' }}
        />
        <div
          className="h-full transition-all duration-700"
          style={{ width: `${inStorePct}%`, backgroundColor: '#2DD4BF' }}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: '#5C70D6' }} />
          <span className="text-xs text-white font-semibold">{onlinePct}%</span>
          <span className="text-xs" style={{ color: '#AFADAD' }}>Online</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: '#2DD4BF' }} />
          <span className="text-xs text-white font-semibold">{inStorePct}%</span>
          <span className="text-xs" style={{ color: '#AFADAD' }}>In Store</span>
        </div>
      </div>
    </div>
  )
}
