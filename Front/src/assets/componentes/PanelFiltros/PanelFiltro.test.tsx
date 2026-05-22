import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import PanelFiltros from './PanelFiltros'
import { TIERS } from '../../const/tiers'
import { REVIEWS } from '../../const/reviews'

const mockSetFiltros = vi.fn()
const mockOnClose = vi.fn()

const filtrosMock = {
  titulo: '',
  minPrecio: undefined,
  maxPrecio: undefined,
  minAhorro: undefined,
  tiendaIds: [],
  tiers: [],
  reviews: [],
}

const tiendasMock = [
  {
    tiendaID: 1,
    nombre: 'Steam',
  },
  {
    tiendaID: 2,
    nombre: 'Epic Games',
  },
]

const renderComponent = (
  filtros = filtrosMock,
  tiendas = tiendasMock
) => {
  return render(
    <PanelFiltros
      filtros={filtros as any}
      tiendas={tiendas as any}
      setFiltros={mockSetFiltros}
      onClose={mockOnClose}
    />
  )
}

describe('PanelFiltros', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all sections', () => {
    renderComponent()

    expect(
      screen.getByRole('heading', {
        name: /título/i,
      })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', {
        name: /^precio$/i,
      })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', {
        name: /descuento mínimo/i,
      })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', {
        name: /tier de oferta/i,
      })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', {
        name: /^reviews$/i,
      })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', {
        name: /tiendas/i,
      })
    ).toBeInTheDocument()
  })

  it('calls onClose when clicking close button', async () => {
    const user = userEvent.setup()

    renderComponent()

    await user.click(
      screen.getByText('✕')
    )

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('updates title filter after debounce', async () => {
    const user = userEvent.setup()

    renderComponent()

    const input =
      screen.getByPlaceholderText(
        /buscar por título/i
      )

    await user.type(input, 'zelda')

    await waitFor(
      () => {
        expect(
          mockSetFiltros
        ).toHaveBeenCalledWith({
          titulo: 'zelda',
        })
      },
      {
        timeout: 500,
      }
    )
  })

  it('does not update title if less than 3 chars', async () => {
    const user = userEvent.setup()

    renderComponent()

    const input =
      screen.getByPlaceholderText(
        /buscar por título/i
      )

    await user.type(input, 'ab')

    await waitFor(
      () => {
        expect(
          mockSetFiltros
        ).toHaveBeenCalledWith({
          titulo: undefined,
        })
      },
      {
        timeout: 500,
      }
    )
  })

  it('updates min price', async () => {
    const user = userEvent.setup()

    renderComponent()

    const minInput =
      screen.getByPlaceholderText('min')

    await user.type(minInput, '10')

    expect(mockSetFiltros).toHaveBeenCalled()
  })

  it('updates max price', async () => {
    const user = userEvent.setup()

    renderComponent()

    const maxInput =
      screen.getByPlaceholderText('max')

    await user.type(maxInput, '50')

    expect(mockSetFiltros).toHaveBeenCalled()
  })

  it('updates ahorro slider', async () => {
    const user = userEvent.setup()

    renderComponent()

    const slider =
      screen.getByRole('slider')

    await user.click(slider)

    expect(slider).toBeInTheDocument()
  })

  it('toggles tier checkbox', async () => {
    const user = userEvent.setup()

    renderComponent()

    const checkbox =
      screen.getAllByRole('checkbox')[0]

    await user.click(checkbox)

    expect(mockSetFiltros).toHaveBeenCalled()
  })

  it('toggles review checkbox', async () => {
    const user = userEvent.setup()

    renderComponent()

    const checkboxes =
      screen.getAllByRole('checkbox')

    await user.click(checkboxes[5])

    expect(mockSetFiltros).toHaveBeenCalled()
  })

  it('toggles tienda checkbox', async () => {
    const user = userEvent.setup()

    renderComponent()

    const steamCheckbox =
      screen.getByLabelText(/steam/i)

    await user.click(steamCheckbox)

    expect(mockSetFiltros).toHaveBeenCalled()
  })

  it('shows loading message when tiendas are empty', () => {
    renderComponent(
      filtrosMock,
      []
    )

    expect(
      screen.getByText(
        /cargando tiendas/i
      )
    ).toBeInTheDocument()
  })

  it('renders tiendas names', () => {
    renderComponent()

    expect(
      screen.getByText(/steam/i)
    ).toBeInTheDocument()

    expect(
      screen.getByText(/epic games/i)
    ).toBeInTheDocument()
  })

  it('renders checked tier checkbox', () => {
    renderComponent({
      ...filtrosMock,
      tiers: [TIERS[0].id],
    })

    const checkedCheckboxes =
      screen
        .getAllByRole('checkbox')
        .filter(
          (checkbox) =>
            (checkbox as HTMLInputElement)
              .checked
        )

    expect(
      checkedCheckboxes.length
    ).toBeGreaterThan(0)
  })

  it('renders checked tienda checkbox', () => {
    renderComponent({
      ...filtrosMock,
      tiendaIds: [1],
    })

    const checkedCheckboxes =
      screen
        .getAllByRole('checkbox')
        .filter(
          (checkbox) =>
            (checkbox as HTMLInputElement)
              .checked
        )

    expect(
      checkedCheckboxes.length
    ).toBeGreaterThan(0)
  })

  it('renders checked review checkbox', () => {
    renderComponent({
      ...filtrosMock,
      reviews: [REVIEWS[0].id],
    })

    const checkedCheckboxes =
      screen
        .getAllByRole('checkbox')
        .filter(
          (checkbox) =>
            (checkbox as HTMLInputElement)
              .checked
        )

    expect(
      checkedCheckboxes.length
    ).toBeGreaterThan(0)
  })
})