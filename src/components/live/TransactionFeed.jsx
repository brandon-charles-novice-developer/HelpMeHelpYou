import { useState, useEffect, useRef } from 'react'
import { useLiveTick } from '../../hooks/useLiveTick'
import { generateFeedBatch, generateFeedEntry } from '../../data/transactionFeed'
import { fmt } from '../../utils/fmt'
import LiveDot from '../shared/LiveDot'

const MAX_ENTRIES = 30

function FeedEntry({ entry }) {
  return (
    <div
      className="feed-entry flex items-center gap-3 py-2.5 px-4"
      style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}
    >
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
        style={{ backgroundColor: entry.color }}
      >
        {entry.initial}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm font-semibold text-white truncate">{entry.brand}</span>
          <span className="text-[11px] flex-shrink-0" style={{ color: '#AFADAD' }}>
            {entry.category}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <span className="text-sm font-bold text-white">{fmt(entry.amount, '$full')}</span>
        <span
          className="text-[10px] px-2 py-0.5 rounded-full font-medium"
          style={{
            backgroundColor:
              entry.channel === 'Online'
                ? 'rgba(92, 112, 214, 0.15)'
                : 'rgba(45, 212, 191, 0.12)',
            color: entry.channel === 'Online' ? '#5C70D6' : '#2DD4BF',
          }}
        >
          {entry.channel}
        </span>
      </div>
    </div>
  )
}

export default function TransactionFeed() {
  const [entries, setEntries] = useState(() => generateFeedBatch(20))
  const { count, value } = useLiveTick()
  const intervalRef = useRef(null)

  useEffect(() => {
    const delay = () => 2000 + Math.random() * 1200

    const schedule = () => {
      intervalRef.current = setTimeout(() => {
        const newEntry = generateFeedEntry()
        setEntries((prev) => [newEntry, ...prev.slice(0, MAX_ENTRIES - 1)])
        schedule()
      }, delay())
    }

    schedule()
    return () => clearTimeout(intervalRef.current)
  }, [])

  return (
    <div
      className="rounded-card overflow-hidden flex flex-col"
      style={{
        backgroundColor: '#252040',
        boxShadow: 'rgba(0, 0, 0, 0.2) 0px 1px 30px 0px',
        maxHeight: 480,
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 flex items-center justify-between flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-2">
          <LiveDot />
          <span
            className="text-[11px] uppercase tracking-widest font-semibold"
            style={{ color: '#AFADAD' }}
          >
            Live Transactions
          </span>
        </div>

        {/* Ticking aggregates */}
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-xs font-bold text-white tick-number">
              {fmt(count, '#')}
            </div>
            <div className="text-[10px]" style={{ color: '#AFADAD' }}>Today's Transactions</div>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-white tick-number">
              {fmt(value, '$')}
            </div>
            <div className="text-[10px]" style={{ color: '#AFADAD' }}>Today's Value</div>
          </div>
        </div>
      </div>

      {/* Feed scroll */}
      <div className="overflow-y-auto flex-1">
        {entries.map((entry) => (
          <FeedEntry key={entry.id} entry={entry} />
        ))}
      </div>

      {/* Footer */}
      <div
        className="px-5 py-2.5 flex items-center gap-2 flex-shrink-0"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <span className="text-[11px]" style={{ color: '#AFADAD' }}>
          5,000,014,000+ total transactions ·
        </span>
        <span className="text-[11px] font-semibold" style={{ color: '#67579E' }}>
          Real people. Real purchases. Real outcomes.
        </span>
      </div>
    </div>
  )
}
