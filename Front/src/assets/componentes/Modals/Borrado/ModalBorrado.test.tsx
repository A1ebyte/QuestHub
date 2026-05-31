import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import ModalBorrado from './ModalBorrado'

describe('ModalBorrado component', () => {
  const onClose = vi.fn()
  const onConfirm = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('does not render when isOpen is false', () => {
    render(
      <ModalBorrado
        isOpen={false}
        onClose={onClose}
        onConfirm={onConfirm}
      />
    )

    expect(
      screen.queryByText(
        /confirmar eliminación/i
      )
    ).not.toBeInTheDocument()
  })

  it('renders modal content when isOpen is true', () => {
    render(
      <ModalBorrado
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
      />
    )

    expect(
      screen.getByRole('heading', {
        name: /confirmar eliminación/i,
      })
    ).toBeInTheDocument()

    expect(
      screen.getByText(
        /estás a punto de eliminar tu cuenta/i
      )
    ).toBeInTheDocument()

    expect(
      screen.getByText(
        /deseas continuar con la baja definitiva/i
      )
    ).toBeInTheDocument()
  })

  it('calls onClose when clicking cancel button', async () => {
    const user = userEvent.setup()

    render(
      <ModalBorrado
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
      />
    )

    await user.click(
      screen.getByRole('button', {
        name: /mantener cuenta/i,
      })
    )

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onConfirm when clicking delete button', async () => {
    const user = userEvent.setup()

    render(
      <ModalBorrado
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
      />
    )

    await user.click(
      screen.getByRole('button', {
        name: /eliminar permanentemente/i,
      })
    )

    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when clicking outside modal container', async () => {
    const user = userEvent.setup()

    render(
      <ModalBorrado
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
      />
    )

    const modalOverlay =
      document.querySelector('.modal')

    expect(modalOverlay).toBeInTheDocument()

    await user.click(modalOverlay!)

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not call onClose when clicking inside modal container', async () => {
    const user = userEvent.setup()

    render(
      <ModalBorrado
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
      />
    )

    const modalContainer =
      document.querySelector(
        '.modal-contenedor'
      )

    expect(modalContainer).toBeInTheDocument()

    await user.click(modalContainer!)

    expect(onClose).not.toHaveBeenCalled()
  })
})