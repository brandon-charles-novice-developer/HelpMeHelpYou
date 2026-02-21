import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import LevelHeader from '../../components/manager/LevelHeader'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

function renderHeader(props = {}) {
  const defaults = {
    crumbs: [{ label: 'Root', path: '/' }, { label: 'Current' }],
    title: 'Test Title',
  }
  return render(
    <MemoryRouter>
      <LevelHeader {...defaults} {...props} />
    </MemoryRouter>
  )
}

describe('LevelHeader (backup — styling and layout focus)', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  it('has glass-card class for glassmorphism background', () => {
    const { container } = renderHeader()
    const card = container.firstChild
    expect(card).toHaveClass('glass-card')
  })

  it('has glass-card class which provides box shadow via CSS', () => {
    const { container } = renderHeader()
    const card = container.firstChild
    expect(card).toHaveClass('glass-card')
  })

  it('renders title as an h2 element', () => {
    renderHeader({ title: 'My Title' })
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading).toHaveTextContent('My Title')
  })

  it('renders subtitle with muted color', () => {
    renderHeader({ subtitle: 'Some subtitle' })
    const subtitle = screen.getByText('Some subtitle')
    expect(subtitle.style.color).toBe('rgb(175, 173, 173)')
  })

  it('back button has glass-card class for hover effects via CSS', () => {
    renderHeader()
    const backBtn = screen.getByRole('button', { name: /back/i })
    expect(backBtn).toHaveClass('glass-card')
  })

  it('back button has correct initial styling', () => {
    renderHeader()
    const backBtn = screen.getByRole('button', { name: /back/i })
    expect(backBtn).toHaveClass('glass-card')
    expect(backBtn.style.color).toBe('rgb(175, 173, 173)')
  })

  it('renders the back button text with arrow', () => {
    renderHeader()
    const backBtn = screen.getByRole('button', { name: /back/i })
    expect(backBtn.textContent).toContain('Back')
  })

  it('title and badge sit side by side', () => {
    renderHeader({
      title: 'Side by Side',
      badge: <span data-testid="badge">Badge</span>,
    })
    const heading = screen.getByRole('heading', { level: 2 })
    const badge = screen.getByTestId('badge')
    // Both should share the same parent flex container
    expect(heading.parentElement).toBe(badge.parentElement)
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - The component uses both className (Tailwind) and inline styles. Consolidating to one approach would simplify.
 * - The #252040 background color is used in virtually every card component — defining it as a CSS variable or Tailwind custom color would reduce repetition.
 * - box-shadow values are also repeated across components — another candidate for shared token.
 * - Tests: backup focuses on visual/DOM structure rather than behavior. Useful for catching regressions in styling choices.
 * - The layout structure (flex items-start justify-between) is tested indirectly through parent/child relationships.
 */
