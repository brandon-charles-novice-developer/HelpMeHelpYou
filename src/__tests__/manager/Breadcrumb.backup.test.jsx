import { render, screen, fireEvent } from '@testing-library/react'
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

describe('Breadcrumb (backup — structure and styling focus)', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  it('applies font-semibold styling to the last crumb', () => {
    const crumbs = [
      { label: 'Root', path: '/' },
      { label: 'Leaf' },
    ]
    renderBreadcrumb(crumbs)

    const leaf = screen.getByText('Leaf')
    expect(leaf.className).toContain('font-semibold')
    expect(leaf.className).toContain('text-white')
  })

  it('applies correct base color to clickable crumbs via inline style', () => {
    const crumbs = [
      { label: 'Clickable', path: '/test' },
      { label: 'Last' },
    ]
    renderBreadcrumb(crumbs)

    const btn = screen.getByRole('button', { name: 'Clickable' })
    expect(btn.style.color).toBe('rgb(103, 87, 158)')
  })

  it('changes crumb color on hover enter and restores on hover leave', () => {
    const crumbs = [
      { label: 'Hover Me', path: '/test' },
      { label: 'Last' },
    ]
    renderBreadcrumb(crumbs)

    const btn = screen.getByRole('button', { name: 'Hover Me' })

    fireEvent.mouseEnter(btn)
    expect(btn.style.color).toBe('rgb(196, 181, 253)')

    fireEvent.mouseLeave(btn)
    expect(btn.style.color).toBe('rgb(103, 87, 158)')
  })

  it('renders exactly N-1 dividers for N crumbs', () => {
    const crumbs = [
      { label: 'A', path: '/a' },
      { label: 'B', path: '/b' },
      { label: 'C', path: '/c' },
      { label: 'D', path: '/d' },
      { label: 'E' },
    ]
    renderBreadcrumb(crumbs)

    const dividers = screen.getAllByText('/')
    expect(dividers).toHaveLength(4)
  })

  it('wraps content in a flex container with correct classes', () => {
    const crumbs = [{ label: 'Single' }]
    const { container } = renderBreadcrumb(crumbs)

    const wrapper = container.firstChild
    expect(wrapper.className).toContain('flex')
    expect(wrapper.className).toContain('items-center')
    expect(wrapper.className).toContain('flex-wrap')
  })

  it('renders a deep breadcrumb path (8 levels like GeoView)', () => {
    const crumbs = [
      { label: 'Tombras', path: '/manager' },
      { label: 'Kayak', path: '/manager/kayak' },
      { label: 'Spring Travel', path: '/manager/kayak/kayak-c1' },
      { label: 'Frequent Travelers', path: '/manager/kayak/kayak-c1/kayak-c1-ag1' },
      { label: 'CTV Premium', path: '/manager/kayak/kayak-c1/kayak-c1-ag1/kayak-c1-ag1-pk1' },
      { label: 'Hulu PMP', path: '/manager/kayak/kayak-c1/kayak-c1-ag1/kayak-c1-ag1-pk1/kayak-c1-ag1-pk1-d1' },
      { label: 'Spring Getaways', path: '/full/path' },
      { label: 'New York, NY' },
    ]
    renderBreadcrumb(crumbs)

    // 7 clickable buttons + 1 plain text
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(7)
    expect(screen.getByText('New York, NY')).toBeInTheDocument()
    expect(screen.getAllByText('/')).toHaveLength(7)
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - The inline hover handlers could be replaced with CSS/Tailwind hover pseudo-classes, eliminating JavaScript event handling for pure style changes.
 * - The component does not handle null/undefined crumbs gracefully — would throw. A crumbs?.map would be safer.
 * - Tests: fireEvent.mouseEnter/mouseLeave is the right approach for testing inline style hover. Backup focuses on styling where primary focuses on behavior.
 * - Both primary and backup mock useNavigate identically — this pattern could be extracted to a shared test helper.
 */
