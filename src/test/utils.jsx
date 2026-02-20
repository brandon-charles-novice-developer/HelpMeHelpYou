import { render } from '@testing-library/react'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'

export function renderWithRouter(ui, { route = '/', ...options } = {}) {
  window.history.pushState({}, 'Test page', route)
  return render(ui, {
    wrapper: ({ children }) => <BrowserRouter>{children}</BrowserRouter>,
    ...options,
  })
}

export function renderWithMemoryRouter(ui, { initialEntries = ['/'], ...options } = {}) {
  return render(ui, {
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    ),
    ...options,
  })
}

export { render }
