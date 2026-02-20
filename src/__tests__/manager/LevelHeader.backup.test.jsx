import { render, screen, fireEvent } from '@testing-library/react'
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

  it('has a dark card background', () => {
    const { container } = renderHeader()
    const card = container.firstChild
    expect(card.style.backgroundColor).toBe('rgb(37, 32, 64)')
  })

  it('applies box shadow to the card', () => {
    const { container } = renderHeader()
    const card = container.firstChild
    expect(card.style.boxShadow).toBeTruthy()
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

  it('back button changes background on hover', () => {
    renderHeader()
    const backBtn = screen.getByRole('button', { name: /back/i })

    fireEvent.mouseEnter(backBtn)
    expect(backBtn.style.backgroundColor).toBe('rgb(45, 39, 80)')

    fireEvent.mouseLeave(backBtn)
    expect(backBtn.style.backgroundColor).toBe('rgba(255, 255, 255, 0.06)')
  })

  it('back button has correct initial styling', () => {
    renderHeader()
    const backBtn = screen.getByRole('button', { name: /back/i })
    expect(backBtn.style.backgroundColor).toBe('rgba(255, 255, 255, 0.06)')
    expect(backBtn.style.color).toBe('rgb(175, 173, 173)')
    expect(backBtn.style.border).toContain('1px solid')
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
