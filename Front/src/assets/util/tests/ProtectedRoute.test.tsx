import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi, describe, it, beforeEach, expect } from 'vitest'

import ProtectedRoute from '../ProtectedRoute'

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<
    typeof import('react-router-dom')
  >('react-router-dom')

  return {
    ...actual,
    Navigate: ({ to }: any) => (
      <div data-testid="navigate">
        redirect:{to}
      </div>
    ),
  }
})

vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

import { useAuth } from '../../context/AuthContext'

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('redirects to login when user is not authenticated', () => {
    ;(useAuth as any).mockReturnValue({
      user: null,
      loading: false,
    })

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected content</div>
        </ProtectedRoute>
      </MemoryRouter>
    )

    expect(
      screen.getByTestId('navigate')
    ).toBeInTheDocument()

    expect(
      screen.getByText(/redirect:\/login/i)
    ).toBeInTheDocument()
  })

  it('renders children when user is authenticated', () => {
    ;(useAuth as any).mockReturnValue({
      user: { id: 1 },
      loading: false,
    })

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected content</div>
        </ProtectedRoute>
      </MemoryRouter>
    )

    expect(
      screen.getByText(/protected content/i)
    ).toBeInTheDocument()
  })

  it('renders children while loading is true', () => {
    ;(useAuth as any).mockReturnValue({
      user: null,
      loading: true,
    })

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected content</div>
        </ProtectedRoute>
      </MemoryRouter>
    )

    expect(
      screen.getByText(/protected content/i)
    ).toBeInTheDocument()
  })
})