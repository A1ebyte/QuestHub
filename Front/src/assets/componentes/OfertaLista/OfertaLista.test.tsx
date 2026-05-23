import { render, screen } from '@testing-library/react'
import OfertasLista from './OfertasLista'

vi.mock('../OfertaTarjeta/OfertaTarjeta', () => ({
  default: ({ oferta }: any) => (
    <div data-testid="oferta-tarjeta">
      {oferta.titulo}
    </div>
  ),
}))

vi.mock('../WishListTarjeta/WishListTarjeta', () => ({
  default: ({ oferta }: any) => (
    <div data-testid="wishlist-tarjeta">
      {oferta.titulo}
    </div>
  ),
}))

const mockOfertas = [
  {
    steamAppID: 1,
    titulo: 'Juego 1',
  },
  {
    steamAppID: 2,
    titulo: 'Juego 2',
  },
]

describe('OfertasLista component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders ofertas using OfertaTarjeta by default', () => {
    render(
      <OfertasLista ofertas={mockOfertas} />
    )

    const cards = screen.getAllByTestId(
      'oferta-tarjeta'
    )

    expect(cards).toHaveLength(2)
  })

  it('renders WishListTarjeta when wishList is true', () => {
    render(
      <OfertasLista
        ofertas={mockOfertas}
        wishList={true}
      />
    )

    const cards = screen.getAllByTestId(
      'wishlist-tarjeta'
    )

    expect(cards).toHaveLength(2)
  })

  it('renders empty list when no ofertas provided', () => {
    const { container } = render(
      <OfertasLista ofertas={[]} />
    )

    expect(container.firstChild).toHaveClass(
      'grid'
    )

    expect(
      screen.queryAllByTestId('oferta-tarjeta')
    ).toHaveLength(0)
  })

  it('applies correct CSS variable for columns', () => {
    const { container } = render(
      <OfertasLista
        ofertas={mockOfertas}
        columnas={3}
      />
    )

    expect(
      container.firstChild
    ).toHaveStyle('--columnas: 3')
  })

  it('uses default columns value when not provided', () => {
    const { container } = render(
      <OfertasLista ofertas={mockOfertas} />
    )

    expect(
      container.firstChild
    ).toHaveStyle('--columnas: 4')
  })
})