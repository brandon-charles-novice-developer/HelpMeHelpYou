import { render, screen } from '@testing-library/react'
import Header from '../../components/layout/Header'

describe('Header', () => {
  const defaultProps = {
    mode: 'executive',
    onModeChange: vi.fn(),
  }

  it('renders without error', () => {
    const { container } = render(<Header {...defaultProps} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders as a header element', () => {
    const { container } = render(<Header {...defaultProps} />)
    expect(container.firstChild.tagName).toBe('HEADER')
  })

  it('displays the HQ logomark', () => {
    render(<Header {...defaultProps} />)
    // HQ appears in both the logomark and wordmark, so use getAllByText
    const hqElements = screen.getAllByText('HQ')
    expect(hqElements.length).toBeGreaterThanOrEqual(1)
  })

  it('displays the outcomeHQ wordmark', () => {
    render(<Header {...defaultProps} />)
    // The wordmark is split: "outcome" + "HQ" span
    expect(screen.getByText(/outcome/)).toBeInTheDocument()
  })

  it('displays the Tombras agency badge', () => {
    render(<Header {...defaultProps} />)
    expect(screen.getByText('Tombras')).toBeInTheDocument()
  })

  it('displays the user name Alexander Potts', () => {
    render(<Header {...defaultProps} />)
    expect(screen.getByText('Alexander Potts')).toBeInTheDocument()
  })

  it('displays the user title', () => {
    render(<Header {...defaultProps} />)
    expect(screen.getByText('Head of Ad Tech & Media Investment')).toBeInTheDocument()
  })

  it('displays the user initials avatar', () => {
    render(<Header {...defaultProps} />)
    expect(screen.getByText('AP')).toBeInTheDocument()
  })

  it('includes the ModeToggle component', () => {
    render(<Header {...defaultProps} />)
    // ModeToggle renders two buttons
    expect(screen.getByText('Morning Coffee')).toBeInTheDocument()
    expect(screen.getByText('Campaign Manager')).toBeInTheDocument()
  })

  it('has dark background color', () => {
    const { container } = render(<Header {...defaultProps} />)
    expect(container.firstChild).toHaveStyle({ backgroundColor: '#1E1A2E' })
  })

  it('has bottom border', () => {
    const { container } = render(<Header {...defaultProps} />)
    expect(container.firstChild).toHaveClass('border-b')
    expect(container.firstChild).toHaveStyle({ borderColor: 'rgba(255,255,255,0.08)' })
  })

  it('uses flex layout with justify-between for 3-column layout', () => {
    const { container } = render(<Header {...defaultProps} />)
    expect(container.firstChild).toHaveClass('flex', 'items-center', 'justify-between')
  })

  it('has horizontal padding and vertical padding', () => {
    const { container } = render(<Header {...defaultProps} />)
    expect(container.firstChild).toHaveClass('px-6', 'py-3')
  })

  it('logomark has purple background', () => {
    render(<Header {...defaultProps} />)
    // The "HQ" in the square logomark
    const hqElements = screen.getAllByText('HQ')
    // Find the one that's the logomark (inside a div with bg)
    const logomark = hqElements.find(
      (el) => el.classList.contains('w-7') && el.classList.contains('h-7')
    )
    expect(logomark).toHaveStyle({ backgroundColor: '#67579E' })
  })

  it('Tombras badge has purple-tinted background', () => {
    render(<Header {...defaultProps} />)
    const tombras = screen.getByText('Tombras')
    expect(tombras).toHaveStyle({ backgroundColor: 'rgba(103,87,158,0.25)' })
    expect(tombras).toHaveStyle({ color: '#C4B5FD' })
  })

  it('avatar has purple background', () => {
    render(<Header {...defaultProps} />)
    const avatar = screen.getByText('AP')
    expect(avatar).toHaveStyle({ backgroundColor: '#4D4176' })
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - User info (name, title, initials) is hardcoded — should be props for multi-user support
 * - Agency name "Tombras" is hardcoded — should be a prop
 * - The HQ text appears in both the logomark and the wordmark, making queries slightly ambiguous
 * - The header has three visual sections (left, center, right) but no landmark roles for accessibility
 * - ModeToggle is tightly coupled — the Header always renders it, no way to hide or swap it
 */
