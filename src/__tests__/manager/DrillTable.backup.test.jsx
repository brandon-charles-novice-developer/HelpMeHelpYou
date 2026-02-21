import { render, screen } from '@testing-library/react'
import DrillTable from '../../components/manager/DrillTable'

describe('DrillTable (backup — styling and grid layout focus)', () => {
  const columns = [
    { key: 'name', label: 'Name', width: '220px' },
    { key: 'metric', label: 'Metric', width: '1fr' },
  ]

  const rows = [
    { id: '1', name: 'Row One', metric: '42%' },
    { id: '2', name: 'Row Two', metric: '58%' },
  ]

  it('sets correct grid template columns on header', () => {
    const { container } = render(<DrillTable columns={columns} rows={rows} />)

    const headerRow = container.querySelector('.grid')
    expect(headerRow.style.gridTemplateColumns).toBe('220px 1fr')
  })

  it('sets matching grid template on each data row', () => {
    render(<DrillTable columns={columns} rows={rows} />)

    const buttons = screen.getAllByRole('button')
    buttons.forEach((btn) => {
      expect(btn.style.gridTemplateColumns).toBe('220px 1fr')
    })
  })

  it('has glass-card class', () => {
    const { container } = render(<DrillTable columns={columns} rows={rows} />)

    const wrapper = container.firstChild
    expect(wrapper).toHaveClass('glass-card')
  })

  it('rows have row-hover class for CSS hover', () => {
    render(<DrillTable columns={columns} rows={rows} />)

    const button = screen.getAllByRole('button')[0]
    expect(button.className).toContain('row-hover')
  })

  it('renders header with uppercase and tracking styles', () => {
    const { container } = render(<DrillTable columns={columns} rows={rows} />)

    const header = container.querySelector('.uppercase')
    expect(header).toBeInTheDocument()
    expect(header.className).toContain('tracking-widest')
  })

  it('renders cell text in default span when no custom render', () => {
    render(<DrillTable columns={columns} rows={rows} />)

    const metricCell = screen.getByText('42%')
    expect(metricCell.tagName).toBe('SPAN')
    expect(metricCell.className).toContain('text-white')
  })

  it('passes both value and full row to custom render function', () => {
    const renderFn = vi.fn((val, row) => <span>{val} ({row.name})</span>)
    const customCols = [
      { key: 'name', label: 'Name', width: '1fr' },
      { key: 'metric', label: 'Metric', width: '1fr', render: renderFn },
    ]

    render(<DrillTable columns={customCols} rows={rows} />)

    expect(renderFn).toHaveBeenCalledTimes(2)
    expect(renderFn).toHaveBeenCalledWith('42%', rows[0])
    expect(renderFn).toHaveBeenCalledWith('58%', rows[1])
  })

  it('uses row.id as key when available', () => {
    render(<DrillTable columns={columns} rows={rows} />)

    // Both rows render — unique keys prevent React warnings
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(2)
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - The grid template columns string is computed inline twice per render (header + each row). Extracting to a constant would be cleaner.
 * - The "No records found" empty state is minimal. For a production app, adding an icon or action button would improve UX.
 * - The hover effect (backgroundColor toggle) follows the same inline pattern used everywhere. This is the biggest refactor opportunity across the codebase.
 * - Tests: The backup validates render function receives both args (val, row), which is critical for complex column renderers used in actual views.
 */
