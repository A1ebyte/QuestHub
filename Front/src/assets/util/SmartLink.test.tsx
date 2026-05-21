import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'

import { SmartLink } from './SmartLink'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<
    typeof import('react-router-dom')
  >('react-router-dom')

  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({
      pathname: '/home',
    }),
  }
})

describe('SmartLink component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.location.href = ''
  })

  it('renders link correctly', () => {
    render(
      <MemoryRouter>
        <SmartLink to="/about">About</SmartLink>
      </MemoryRouter>
    )

    expect(
      screen.getByRole('link', {
        name: /about/i,
      })
    ).toBeInTheDocument()
  })

  it('navigates using react-router when path is different', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <SmartLink to="/about">About</SmartLink>
      </MemoryRouter>
    )

    const link = screen.getByRole('link')

    await user.click(link)

    expect(mockNavigate).toHaveBeenCalledWith(
      '/about'
    )
  })

  it('reloads page when clicking same path', async () => {
    const user = userEvent.setup()

    const originalHref = window.location

    // mock window.location.href
    delete (window as any).location
    window.location = {
      ...originalHref,
      href: '',
    }

    render(
      <MemoryRouter>
        <SmartLink to="/home">Home</SmartLink>
      </MemoryRouter>
    )

    const link = screen.getByRole('link')

    await user.click(link)

    expect(window.location.href).toBe('/home')
  })

  it('prevents default navigation', async () => {
    const user = userEvent.setup()

    const preventDefault = vi.fn()

    render(
      <MemoryRouter>
        <SmartLink to="/about">About</SmartLink>
      </MemoryRouter>
    )

    const link = screen.getByRole('link')

    await user.click(link)

    expect(mockNavigate).toHaveBeenCalled()
  })

  it('applies className correctly', () => {
    render(
      <MemoryRouter>
        <SmartLink
          to="/about"
          className="test-class"
        >
          About
        </SmartLink>
      </MemoryRouter>
    )

    const link = screen.getByRole('link')

    expect(link).toHaveClass('test-class')
  })
})