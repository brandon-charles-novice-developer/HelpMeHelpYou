import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ModeToggle from '../../components/layout/ModeToggle'

describe('ModeToggle — edge cases, accessibility, rapid interactions', () => {
  describe('edge cases', () => {
    it('renders when mode is undefined', () => {
      const { container } = render(<ModeToggle mode={undefined} onModeChange={vi.fn()} />)
      expect(container.firstChild).toBeInTheDocument()
      // Neither button should have active styling
      const buttons = screen.getAllByRole('button')
      buttons.forEach((btn) => {
        expect(btn).toHaveClass('text-attain-muted')
      })
    })

    it('renders when mode is an unknown string', () => {
      render(<ModeToggle mode="unknown" onModeChange={vi.fn()} />)
      // Both buttons should be in inactive state
      const executiveBtn = screen.getByText('Morning Coffee')
      const managerBtn = screen.getByText('Campaign Manager')
      expect(executiveBtn).toHaveClass('text-attain-muted')
      expect(managerBtn).toHaveClass('text-attain-muted')
    })
  })

  describe('rapid clicking', () => {
    it('handles rapid clicks without error', async () => {
      const onModeChange = vi.fn()
      const user = userEvent.setup()
      render(<ModeToggle mode="executive" onModeChange={onModeChange} />)

      const managerBtn = screen.getByText('Campaign Manager')
      await user.click(managerBtn)
      await user.click(managerBtn)
      await user.click(managerBtn)

      expect(onModeChange).toHaveBeenCalledTimes(3)
      expect(onModeChange).toHaveBeenCalledWith('manager')
    })

    it('handles alternating clicks between modes', async () => {
      const onModeChange = vi.fn()
      const user = userEvent.setup()
      render(<ModeToggle mode="executive" onModeChange={onModeChange} />)

      await user.click(screen.getByText('Campaign Manager'))
      await user.click(screen.getByText('Morning Coffee'))
      await user.click(screen.getByText('Campaign Manager'))

      expect(onModeChange).toHaveBeenCalledTimes(3)
      expect(onModeChange.mock.calls).toEqual([['manager'], ['executive'], ['manager']])
    })
  })

  describe('keyboard accessibility', () => {
    it('buttons are keyboard focusable', async () => {
      const user = userEvent.setup()
      render(<ModeToggle mode="executive" onModeChange={vi.fn()} />)

      await user.tab()
      expect(screen.getByText('Morning Coffee')).toHaveFocus()

      await user.tab()
      expect(screen.getByText('Campaign Manager')).toHaveFocus()
    })

    it('buttons can be activated with Enter key', async () => {
      const onModeChange = vi.fn()
      const user = userEvent.setup()
      render(<ModeToggle mode="executive" onModeChange={onModeChange} />)

      await user.tab()
      await user.tab()
      await user.keyboard('{Enter}')

      expect(onModeChange).toHaveBeenCalledWith('manager')
    })

    it('buttons can be activated with Space key', async () => {
      const onModeChange = vi.fn()
      const user = userEvent.setup()
      render(<ModeToggle mode="executive" onModeChange={onModeChange} />)

      await user.tab()
      await user.keyboard(' ')

      expect(onModeChange).toHaveBeenCalledWith('executive')
    })
  })

  describe('active state shadow', () => {
    it('active button has shadow-sm class', () => {
      render(<ModeToggle mode="executive" onModeChange={vi.fn()} />)
      const activeBtn = screen.getByText('Morning Coffee')
      expect(activeBtn).toHaveClass('shadow-sm')
    })

    it('inactive button does not have shadow-sm class', () => {
      render(<ModeToggle mode="executive" onModeChange={vi.fn()} />)
      const inactiveBtn = screen.getByText('Campaign Manager')
      expect(inactiveBtn).not.toHaveClass('shadow-sm')
    })
  })

  describe('hover state classes', () => {
    it('inactive button has hover:text-white class', () => {
      render(<ModeToggle mode="executive" onModeChange={vi.fn()} />)
      const inactiveBtn = screen.getByText('Campaign Manager')
      expect(inactiveBtn).toHaveClass('hover:text-white')
    })

    it('active button does not have hover:text-white (already white)', () => {
      render(<ModeToggle mode="executive" onModeChange={vi.fn()} />)
      const activeBtn = screen.getByText('Morning Coffee')
      expect(activeBtn).not.toHaveClass('hover:text-white')
    })
  })

  describe('button text and font', () => {
    it('both buttons have text-sm font-medium', () => {
      render(<ModeToggle mode="executive" onModeChange={vi.fn()} />)
      screen.getAllByRole('button').forEach((btn) => {
        expect(btn).toHaveClass('text-sm', 'font-medium')
      })
    })

    it('both buttons have rounded-full pill shape', () => {
      render(<ModeToggle mode="executive" onModeChange={vi.fn()} />)
      screen.getAllByRole('button').forEach((btn) => {
        expect(btn).toHaveClass('rounded-full')
      })
    })
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - No aria-pressed or aria-selected to communicate state to screen readers
 * - No role="tablist" on the container — it behaves like tabs but isn't announced as such
 * - The hover:text-white class only appears on inactive buttons due to template literal logic — correct but hard to read
 * - onModeChange fires even when clicking the already-active mode — could add a guard: `if (newMode !== mode) onModeChange(newMode)`
 * - The button labels could be data-driven via a modes array instead of duplicated JSX
 */
