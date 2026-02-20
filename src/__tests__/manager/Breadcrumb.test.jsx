import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Breadcrumb from '../../components/manager/Breadcrumb'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

function renderBreadcrumb(crumbs) {
  return render(
    <MemoryRouter>
      <Breadcrumb crumbs={crumbs} />
    </MemoryRouter>
  )
}

describe('Breadcrumb', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  it('renders all crumb labels', () => {
    const crumbs = [
      { label: 'Tombras', path: '/manager' },
      { label: 'Kayak', path: '/manager/kayak' },
      { label: 'Spring Travel Q1 2026' },
    ]
    renderBreadcrumb(crumbs)

    expect(screen.getByText('Tombras')).toBeInTheDocument()
    expect(screen.getByText('Kayak')).toBeInTheDocument()
    expect(screen.getByText('Spring Travel Q1 2026')).toBeInTheDocument()
  })

  it('renders dividers between crumbs but not before the first', () => {
    const crumbs = [
      { label: 'Tombras', path: '/manager' },
      { label: 'Kayak', path: '/manager/kayak' },
      { label: 'Current' },
    ]
    renderBreadcrumb(crumbs)

    const dividers = screen.getAllByText('/')
    expect(dividers).toHaveLength(2)
  })

  it('renders non-last crumbs as buttons and last crumb as plain text', () => {
    const crumbs = [
      { label: 'Tombras', path: '/manager' },
      { label: 'Kayak', path: '/manager/kayak' },
      { label: 'Current' },
    ]
    renderBreadcrumb(crumbs)

    // First two are buttons (clickable)
    expect(screen.getByRole('button', { name: 'Tombras' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Kayak' })).toBeInTheDocument()

    // Last is not a button — it's a plain span
    const currentText = screen.getByText('Current')
    expect(currentText.tagName).toBe('SPAN')
    expect(currentText.closest('button')).toBeNull()
  })

  it('navigates to correct path when clickable crumb is clicked', async () => {
    const user = userEvent.setup()
    const crumbs = [
      { label: 'Tombras', path: '/manager' },
      { label: 'Kayak', path: '/manager/kayak' },
      { label: 'Current' },
    ]
    renderBreadcrumb(crumbs)

    await user.click(screen.getByRole('button', { name: 'Tombras' }))
    expect(mockNavigate).toHaveBeenCalledWith('/manager')

    await user.click(screen.getByRole('button', { name: 'Kayak' }))
    expect(mockNavigate).toHaveBeenCalledWith('/manager/kayak')
  })

  it('renders a single crumb without dividers or buttons', () => {
    renderBreadcrumb([{ label: 'Only One' }])

    expect(screen.getByText('Only One')).toBeInTheDocument()
    expect(screen.queryAllByText('/')).toHaveLength(0)
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('handles crumb without path gracefully (does not navigate)', async () => {
    const user = userEvent.setup()
    const crumbs = [
      { label: 'No Path' },
      { label: 'Current' },
    ]
    renderBreadcrumb(crumbs)

    await user.click(screen.getByRole('button', { name: 'No Path' }))
    // navigate called but with undefined path — the component calls navigate(crumb.path) only if crumb.path is truthy
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('renders empty when given an empty crumbs array', () => {
    const { container } = renderBreadcrumb([])
    // The container wrapper exists but has no crumb content
    expect(container.querySelector('.flex')).toBeInTheDocument()
    expect(screen.queryByRole('button')).toBeNull()
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - Breadcrumb component mixes inline styles with Tailwind. Could use Tailwind-only approach.
 * - Hover color changes use inline onMouseEnter/onMouseLeave — could use Tailwind hover: classes.
 * - The crumb.path && navigate(crumb.path) guard is a good pattern but the button still renders for pathless crumbs (except the last). Could skip rendering a button if no path.
 * - Tests: The mockNavigate pattern is straightforward. Could use renderWithRouter from test utils but direct MemoryRouter is clearer here since we mock useNavigate anyway.
 * - No redundant patterns found — component is appropriately minimal.
 */
