import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DrillTable from '../../components/manager/DrillTable'

const sampleColumns = [
  { key: 'name', label: 'Name', width: '200px' },
  { key: 'value', label: 'Value', width: '1fr' },
  { key: 'status', label: 'Status', width: '100px' },
]

const sampleRows = [
  { id: 'row-1', name: 'Alpha', value: '100', status: 'active' },
  { id: 'row-2', name: 'Beta', value: '200', status: 'paused' },
  { id: 'row-3', name: 'Gamma', value: '300', status: 'active' },
]

describe('DrillTable', () => {
  it('renders column headers', () => {
    render(<DrillTable columns={sampleColumns} rows={sampleRows} />)

    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Value')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
  })

  it('renders all rows', () => {
    render(<DrillTable columns={sampleColumns} rows={sampleRows} />)

    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.getByText('Beta')).toBeInTheDocument()
    expect(screen.getByText('Gamma')).toBeInTheDocument()
  })

  it('renders rows as buttons for click interaction', () => {
    render(<DrillTable columns={sampleColumns} rows={sampleRows} />)

    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(3)
  })

  it('calls onRowClick with the row data when a row is clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(<DrillTable columns={sampleColumns} rows={sampleRows} onRowClick={handleClick} />)

    const buttons = screen.getAllByRole('button')
    await user.click(buttons[0])

    expect(handleClick).toHaveBeenCalledWith(sampleRows[0])
  })

  it('calls onRowClick with correct row for each row', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(<DrillTable columns={sampleColumns} rows={sampleRows} onRowClick={handleClick} />)

    const buttons = screen.getAllByRole('button')
    await user.click(buttons[2])

    expect(handleClick).toHaveBeenCalledWith(sampleRows[2])
  })

  it('shows "No records found" when rows is empty', () => {
    render(<DrillTable columns={sampleColumns} rows={[]} />)

    expect(screen.getByText('No records found')).toBeInTheDocument()
  })

  it('does not show "No records found" when rows exist', () => {
    render(<DrillTable columns={sampleColumns} rows={sampleRows} />)

    expect(screen.queryByText('No records found')).toBeNull()
  })

  it('renders custom column renderers', () => {
    const customColumns = [
      { key: 'name', label: 'Name', width: '1fr' },
      {
        key: 'value',
        label: 'Value',
        width: '1fr',
        render: (val) => <span data-testid="custom-render">{`$${val}`}</span>,
      },
    ]
    const rows = [{ id: 'r1', name: 'Test', value: '42' }]

    render(<DrillTable columns={customColumns} rows={rows} />)

    expect(screen.getByTestId('custom-render')).toHaveTextContent('$42')
  })

  it('handles rows without onRowClick prop gracefully', async () => {
    const user = userEvent.setup()
    render(<DrillTable columns={sampleColumns} rows={sampleRows} />)

    const buttons = screen.getAllByRole('button')
    // Should not throw when clicked without onRowClick
    await user.click(buttons[0])
  })

  it('uses default width (1fr) for columns without explicit width', () => {
    const cols = [
      { key: 'a', label: 'A' },
      { key: 'b', label: 'B' },
    ]
    const rows = [{ id: '1', a: 'x', b: 'y' }]

    const { container } = render(<DrillTable columns={cols} rows={rows} />)

    const header = container.querySelector('.grid')
    expect(header.style.gridTemplateColumns).toBe('1fr 1fr')
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - DrillTable recalculates gridTemplateColumns on every render by mapping columns. This string could be memoized.
 * - The inline hover handlers on rows (onMouseEnter/onMouseLeave) repeat the same pattern from Breadcrumb and LevelHeader. A shared HoverRow component or Tailwind hover: would eliminate this.
 * - Each row is a <button> element which is good for accessibility, but the button has no accessible label — adding aria-label based on the first column value would improve screen reader experience.
 * - Tests: The custom render test validates the render function column config, which is the most complex part of the component.
 * - The component is appropriately generic and reusable. No over-engineering detected.
 */
