// Generic drill-down table used at every level

export default function DrillTable({ columns, rows, onRowClick }) {
  return (
    <div
      className="glass-card rounded-card overflow-hidden"
    >
      {/* Header */}
      <div
        className="grid px-5 py-3 text-[11px] uppercase tracking-widest font-semibold"
        style={{
          color: '#AFADAD',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          gridTemplateColumns: columns.map((c) => c.width || '1fr').join(' '),
        }}
      >
        {columns.map((col) => (
          <span key={col.key}>{col.label}</span>
        ))}
      </div>

      {/* Rows */}
      {rows.map((row, i) => (
        <button
          key={row.id || i}
          className="w-full text-left grid px-5 py-4 items-center row-hover"
          style={{
            gridTemplateColumns: columns.map((c) => c.width || '1fr').join(' '),
            borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
          }}
          onClick={() => onRowClick && onRowClick(row)}
        >
          {columns.map((col) => (
            <span key={col.key}>
              {col.render ? col.render(row[col.key], row) : (
                <span className="text-sm text-white">{row[col.key]}</span>
              )}
            </span>
          ))}
        </button>
      ))}

      {rows.length === 0 && (
        <div className="px-5 py-8 text-center text-sm" style={{ color: '#AFADAD' }}>
          No records found
        </div>
      )}
    </div>
  )
}
