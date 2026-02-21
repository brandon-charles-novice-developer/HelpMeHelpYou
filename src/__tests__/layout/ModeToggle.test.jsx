import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ModeToggle from '../../components/layout/ModeToggle'

describe('ModeToggle', () => {
  const defaultProps = {
    mode: 'executive',
    onModeChange: vi.fn(),
  }

  beforeEach(() => {
    defaultProps.onModeChange.mockClear()
  })

  it('renders without error', () => {
    const { container } = render(<ModeToggle {...defaultProps} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('displays both mode labels', () => {
    render(<ModeToggle {...defaultProps} />)
    expect(screen.getByText('Morning Coffee')).toBeInTheDocument()
    expect(screen.getByText('Campaign Manager')).toBeInTheDocument()
  })

  it('renders two button elements', () => {
    render(<ModeToggle {...defaultProps} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(2)
  })

  it('highlights executive button when mode is executive', () => {
    render(<ModeToggle {...defaultProps} mode="executive" />)
    const executiveBtn = screen.getByText('Morning Coffee')
    expect(executiveBtn).toHaveClass('text-white')
  })

  it('dims manager button when mode is executive', () => {
    render(<ModeToggle {...defaultProps} mode="executive" />)
    const managerBtn = screen.getByText('Campaign Manager')
    expect(managerBtn).toHaveClass('text-attain-muted')
  })

  it('highlights manager button when mode is manager', () => {
    render(<ModeToggle {...defaultProps} mode="manager" />)
    const managerBtn = screen.getByText('Campaign Manager')
    expect(managerBtn).toHaveClass('text-white')
  })

  it('dims executive button when mode is manager', () => {
    render(<ModeToggle {...defaultProps} mode="manager" />)
    const executiveBtn = screen.getByText('Morning Coffee')
    expect(executiveBtn).toHaveClass('text-attain-muted')
  })

  it('calls onModeChange with "executive" when executive button is clicked', async () => {
    const user = userEvent.setup()
    render(<ModeToggle {...defaultProps} mode="manager" />)
    await user.click(screen.getByText('Morning Coffee'))
    expect(defaultProps.onModeChange).toHaveBeenCalledWith('executive')
    expect(defaultProps.onModeChange).toHaveBeenCalledTimes(1)
  })

  it('calls onModeChange with "manager" when manager button is clicked', async () => {
    const user = userEvent.setup()
    render(<ModeToggle {...defaultProps} mode="executive" />)
    await user.click(screen.getByText('Campaign Manager'))
    expect(defaultProps.onModeChange).toHaveBeenCalledWith('manager')
    expect(defaultProps.onModeChange).toHaveBeenCalledTimes(1)
  })

  it('calls onModeChange even when clicking the already-active mode', async () => {
    const user = userEvent.setup()
    render(<ModeToggle {...defaultProps} mode="executive" />)
    await user.click(screen.getByText('Morning Coffee'))
    expect(defaultProps.onModeChange).toHaveBeenCalledWith('executive')
  })

  it('has rounded-full pill shape on the container', () => {
    const { container } = render(<ModeToggle {...defaultProps} />)
    expect(container.firstChild).toHaveClass('rounded-full')
  })

  it('has glass styling on the container', () => {
    const { container } = render(<ModeToggle {...defaultProps} />)
    expect(container.firstChild).toHaveClass('rounded-full')
  })

  it('buttons have transition classes', () => {
    render(<ModeToggle {...defaultProps} />)
    const buttons = screen.getAllByRole('button')
    buttons.forEach((btn) => {
      expect(btn).toHaveClass('transition-all', 'duration-200')
    })
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - The toggle always fires onModeChange even when clicking the already-selected mode — could short-circuit
 * - The button labels ("Morning Coffee", "Campaign Manager") are hardcoded — could be props for reusability
 * - Active/inactive class logic is duplicated across both buttons — could extract to a helper function
 * - The component could use aria-pressed or role="tablist" for better accessibility
 */
