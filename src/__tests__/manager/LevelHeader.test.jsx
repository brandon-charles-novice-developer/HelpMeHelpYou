import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import LevelHeader from '../../components/manager/LevelHeader'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

function renderHeader(props = {}) {
  const defaults = {
    crumbs: [
      { label: 'Tombras', path: '/manager' },
      { label: 'Kayak' },
    ],
    title: 'Kayak',
    subtitle: 'Travel · Multi-DSP programmatic',
  }
  return render(
    <MemoryRouter>
      <LevelHeader {...defaults} {...props} />
    </MemoryRouter>
  )
}

describe('LevelHeader', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  it('renders the title as an h2 heading', () => {
    renderHeader()
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading).toHaveTextContent('Kayak')
  })

  it('renders the subtitle when provided', () => {
    renderHeader({ subtitle: 'Travel · Multi-DSP programmatic' })
    expect(screen.getByText('Travel · Multi-DSP programmatic')).toBeInTheDocument()
  })

  it('does not render subtitle when not provided', () => {
    renderHeader({ subtitle: undefined })
    expect(screen.queryByText('Travel · Multi-DSP programmatic')).toBeNull()
  })

  it('renders the breadcrumb with all crumbs', () => {
    renderHeader()
    expect(screen.getByText('Tombras')).toBeInTheDocument()
  })

  it('renders a badge when provided', () => {
    renderHeader({
      badge: <span data-testid="test-badge">Programmatic</span>,
    })
    expect(screen.getByTestId('test-badge')).toBeInTheDocument()
  })

  it('does not render a badge area when badge is not provided', () => {
    renderHeader({ badge: undefined })
    expect(screen.queryByTestId('test-badge')).toBeNull()
  })

  it('renders a back button', () => {
    renderHeader()
    const backBtn = screen.getByRole('button', { name: /back/i })
    expect(backBtn).toBeInTheDocument()
  })

  it('navigates back when the back button is clicked', async () => {
    const user = userEvent.setup()
    renderHeader()

    await user.click(screen.getByRole('button', { name: /back/i }))
    expect(mockNavigate).toHaveBeenCalledWith(-1)
  })

  it('renders actions slot when provided', () => {
    renderHeader({
      actions: <button data-testid="action-btn">Export</button>,
    })
    expect(screen.getByTestId('action-btn')).toBeInTheDocument()
  })

  it('renders with a deep breadcrumb trail', () => {
    renderHeader({
      crumbs: [
        { label: 'Tombras', path: '/manager' },
        { label: 'Kayak', path: '/manager/kayak' },
        { label: 'Spring Travel', path: '/manager/kayak/kayak-c1' },
        { label: 'Current Level' },
      ],
      title: 'Current Level',
    })
    expect(screen.getByRole('button', { name: 'Tombras' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Kayak' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Spring Travel' })).toBeInTheDocument()
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - LevelHeader inlines its background/shadow style. These repeat across nearly every component in the app — a shared utility class or CSS variable would reduce duplication.
 * - The back button uses navigate(-1) which is simple but can fail if there's no history. Could add a fallback path prop.
 * - The hover style on the back button uses inline handlers — same pattern as Breadcrumb. Tailwind hover: classes would be cleaner.
 * - Tests: straightforward props-in, elements-out testing. No complex logic to test.
 * - The badge prop accepts any ReactNode — simple but no type safety or constraints.
 */
