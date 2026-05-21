import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'

import Menu from './Header'

const mockNavigate = vi.fn()
const mockSignOut = vi.fn()

const mockEnviarNoti = vi.hoisted(() => vi.fn())
const mockGetOfertasBuscador = vi.hoisted(() => vi.fn())

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom'
  )

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    signOut: mockSignOut,
  }),
}))

vi.mock('../../util/notificacionToast', () => ({
  enviarNoti: mockEnviarNoti,
  typeToast: {
    WARN: 'warn',
  },
}))

vi.mock('../../servicios/Axios/ServicioOfertas', () => ({
  default: {
    getOfertasBuscador: mockGetOfertasBuscador,
  },
}))

vi.mock('../../servicios/Axios/http-axios', () => ({
  backCaido: false,
}))

const renderMenu = () =>
  render(
    <MemoryRouter>
      <Menu />
    </MemoryRouter>
  )

describe('Header/Menu component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders navigation links', () => {
    renderMenu()

    expect(screen.getByRole('link', { name: /tendencias/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /irresistibles/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /novedades/i })).toBeInTheDocument()
  })

  it('renders search input', () => {
    renderMenu()

    expect(screen.getByPlaceholderText(/que juegos buscas/i)).toBeInTheDocument()
  })

  it('shows login option when user is not authenticated', async () => {
    const user = userEvent.setup()

    renderMenu()

    const avatarButton = screen.getAllByRole('button')[1]

    await user.click(avatarButton)

    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument()
  })

  it('navigates to ofertas when search is valid', async () => {
    const user = userEvent.setup()

    renderMenu()

    const input = screen.getByPlaceholderText(/que juegos buscas/i)

    await user.type(input, 'zelda')

    await user.click(screen.getAllByRole('button')[0])

    expect(mockNavigate).toHaveBeenCalledWith('/ofertas?titulo=zelda')
  })

  it('shows notification when search has less than 3 characters', async () => {
    const user = userEvent.setup()

    renderMenu()

    const input = screen.getByPlaceholderText(/que juegos buscas/i)

    await user.type(input, 'ab')

    await user.keyboard('{Enter}')

    expect(mockEnviarNoti).toHaveBeenCalled()
  })

  it('clears search input after submit', async () => {
    const user = userEvent.setup()

    renderMenu()

    const input = screen.getByPlaceholderText(/que juegos buscas/i) as HTMLInputElement

    await user.type(input, 'mario')

    await user.keyboard('{Enter}')

    expect(input.value).toBe('')
  })

  it('opens and closes avatar dropdown', async () => {
    const user = userEvent.setup()

    renderMenu()

    const avatarButton = screen.getAllByRole('button')[1]

    await user.click(avatarButton)

    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument()

    await user.click(document.body)

    await waitFor(() => {
      expect(screen.queryByRole('link', { name: /login/i })).not.toBeInTheDocument()
    })
  })

  it('renders logo image', () => {
    renderMenu()

    expect(screen.getByRole('img', { name: /quest-hub/i })).toBeInTheDocument()
  })
})