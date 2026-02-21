import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Header from '../../components/layout/Header'

describe('Header — edge cases, interactions, structure', () => {
  const defaultProps = {
    mode: 'executive',
    onModeChange: vi.fn(),
  }

  beforeEach(() => {
    defaultProps.onModeChange.mockClear()
  })

  describe('three-column layout structure', () => {
    it('has left section with logo and agency badge', () => {
      render(<Header {...defaultProps} />)
      // HQ appears in both logomark and wordmark, so use getAllByText
      const hqElements = screen.getAllByText('HQ')
      expect(hqElements.length).toBeGreaterThanOrEqual(1)
      expect(screen.getByText('Tombras')).toBeInTheDocument()
    })

    it('has center section with mode toggle', () => {
      render(<Header {...defaultProps} />)
      expect(screen.getByText('Morning Coffee')).toBeInTheDocument()
      expect(screen.getByText('Campaign Manager')).toBeInTheDocument()
    })

    it('has right section with user info', () => {
      render(<Header {...defaultProps} />)
      expect(screen.getByText('Alexander Potts')).toBeInTheDocument()
      expect(screen.getByText('AP')).toBeInTheDocument()
    })
  })

  describe('mode toggle interaction through Header', () => {
    it('clicking Morning Coffee calls onModeChange("executive")', async () => {
      const user = userEvent.setup()
      render(<Header {...defaultProps} mode="manager" />)
      await user.click(screen.getByText('Morning Coffee'))
      expect(defaultProps.onModeChange).toHaveBeenCalledWith('executive')
    })

    it('clicking Campaign Manager calls onModeChange("manager")', async () => {
      const user = userEvent.setup()
      render(<Header {...defaultProps} mode="executive" />)
      await user.click(screen.getByText('Campaign Manager'))
      expect(defaultProps.onModeChange).toHaveBeenCalledWith('manager')
    })
  })

  describe('wordmark rendering', () => {
    it('outcomeHQ text contains styled "HQ" span', () => {
      render(<Header {...defaultProps} />)
      const hqElements = screen.getAllByText('HQ')
      expect(hqElements.length).toBeGreaterThanOrEqual(1)
    })

    it('wordmark "HQ" span has blue accent color', () => {
      render(<Header {...defaultProps} />)
      const hqElements = screen.getAllByText('HQ')
      // The wordmark HQ is in a span with blue color
      const wordmarkHQ = hqElements.find((el) => el.tagName === 'SPAN' && !el.classList.contains('w-7'))
      expect(wordmarkHQ).toHaveStyle({ color: '#5C70D6' })
    })
  })

  describe('user context section', () => {
    it('user name has white text', () => {
      render(<Header {...defaultProps} />)
      expect(screen.getByText('Alexander Potts')).toHaveClass('text-white')
    })

    it('user title has muted color', () => {
      render(<Header {...defaultProps} />)
      expect(screen.getByText('Head of Ad Tech & Media Investment')).toHaveStyle({ color: '#AFADAD' })
    })

    it('avatar circle is 32x32 with rounded-full', () => {
      render(<Header {...defaultProps} />)
      const avatar = screen.getByText('AP')
      expect(avatar).toHaveClass('w-8', 'h-8', 'rounded-full')
    })

    it('user info text is right-aligned', () => {
      render(<Header {...defaultProps} />)
      const nameEl = screen.getByText('Alexander Potts')
      expect(nameEl.parentElement).toHaveClass('text-right')
    })
  })

  describe('semantic HTML', () => {
    it('uses <header> as root element', () => {
      const { container } = render(<Header {...defaultProps} />)
      expect(container.firstChild.tagName).toBe('HEADER')
    })

    it('header has glass-header for visual separation', () => {
      const { container } = render(<Header {...defaultProps} />)
      expect(container.firstChild).toHaveClass('glass-header')
    })
  })

  describe('responsiveness to mode prop', () => {
    it('passes mode to ModeToggle correctly for executive', () => {
      render(<Header {...defaultProps} mode="executive" />)
      const executiveBtn = screen.getByText('Morning Coffee')
      expect(executiveBtn).toHaveClass('text-white')
    })

    it('passes mode to ModeToggle correctly for manager', () => {
      render(<Header {...defaultProps} mode="manager" />)
      const managerBtn = screen.getByText('Campaign Manager')
      expect(managerBtn).toHaveClass('text-white')
    })
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - All user data is hardcoded (Alexander Potts, AP, Head of Ad Tech & Media Investment) — not reusable across users
 * - Agency context (Tombras) is hardcoded — should be a prop or context value
 * - The Header wraps ModeToggle directly — integration test overlap, could mock ModeToggle in unit tests
 * - The "HQ" text appearing in both logomark and wordmark creates ambiguity in text queries
 * - No skip-to-content link or other accessibility navigation landmarks
 */
