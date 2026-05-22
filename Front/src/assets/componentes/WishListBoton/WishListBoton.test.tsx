import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import WishListBoton from './WishListBoton'

const mockToggleJuego = vi.fn()
const mockEstaEnWishlist = vi.fn()

vi.mock('../../context/WishlistContext', () => ({
  useWishlistContext: () => ({
    toggleJuego: mockToggleJuego,
    estaEnWishlist: mockEstaEnWishlist,
  }),
}))

vi.mock('../../servicios/Axios/http-axios', () => ({
  backCaido: false,
}))

const ofertaMock = {
  steamAppID: 123,
  titulo: 'Cyberpunk 2077',
}

const renderComponent = (
  oferta = ofertaMock
) => {
  return render(
    <WishListBoton
      deseado={oferta as any}
    />
  )
}

describe('WishListBoton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockEstaEnWishlist.mockReturnValue(false)
  })

  it('renders wishlist button', () => {
    renderComponent()

    expect(
      screen.getByTitle(
        /agregar a wishlist/i
      )
    ).toBeInTheDocument()
  })

  it('shows remove title when game is already in wishlist', () => {
    mockEstaEnWishlist.mockReturnValue(true)

    renderComponent()

    expect(
      screen.getByTitle(
        /quitar de wishlist/i
      )
    ).toBeInTheDocument()
  })

  it('calls toggleJuego on click', async () => {
    const user = userEvent.setup()

    renderComponent()

    const button =
      screen.getByTitle(
        /agregar a wishlist/i
      )

    await user.click(button)

    expect(
      mockToggleJuego
    ).toHaveBeenCalledWith(
      ofertaMock
    )
  })

  it('does not call toggleJuego when steamAppID does not exist', async () => {
    const user = userEvent.setup()

    const ofertaSinId = {
      ...ofertaMock,
      steamAppID: undefined,
    }

    renderComponent(ofertaSinId)

    const button =
      screen.getByTitle(
        /agregar a wishlist/i
      )

    await user.click(button)

    expect(
      mockToggleJuego
    ).not.toHaveBeenCalled()
  })

  it('adds processing class while processing', async () => {
    mockToggleJuego.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(resolve, 100)
        )
    )

    const user = userEvent.setup()

    renderComponent()

    const button =
      screen.getByTitle(
        /agregar a wishlist/i
      )

    await user.click(button)

    expect(
      button.className
    ).toContain('processing')
  })

  it('handles toggleJuego error gracefully', async () => {
    mockToggleJuego.mockRejectedValue(
      new Error('Error test')
    )

    const user = userEvent.setup()

    const consoleSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {})

    renderComponent()

    const button =
      screen.getByTitle(
        /agregar a wishlist/i
      )

    await user.click(button)

    expect(consoleSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  it('calls estaEnWishlist with correct id', () => {
    renderComponent()

    expect(
      mockEstaEnWishlist
    ).toHaveBeenCalledWith(123)
  })

  it('renders active class when game is in wishlist', () => {
    mockEstaEnWishlist.mockReturnValue(true)

    renderComponent()

    const icon = document.querySelector(
      '.wishlist-icon'
    )

    expect(icon?.className).toContain(
      'active'
    )
  })
})