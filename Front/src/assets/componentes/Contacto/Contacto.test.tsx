import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import Contacto from './Contacto'

describe('Contacto component', () => {
  it('renders title and description', () => {
    render(<Contacto />)

    expect(
      screen.getByRole('heading', {
        name: /contactanos/i,
      })
    ).toBeInTheDocument()

    expect(
      screen.getByText(
        /no dudes en ponerte en contacto/i
      )
    ).toBeInTheDocument()
  })

  it('opens mail client when clicking correo button', async () => {
    const user = userEvent.setup()

    const openSpy = vi
      .spyOn(window, 'open')
      .mockImplementation(() => null)

    render(
      <Contacto correo="test@test.com" />
    )

    await user.click(
      screen.getByRole('button', {
        name: /correo/i,
      })
    )

    expect(openSpy).toHaveBeenCalledWith(
      'mailto:test@test.com',
      '_blank'
    )
  })

  it('uses default email when no correo prop is provided', async () => {
    const user = userEvent.setup()

    const openSpy = vi
      .spyOn(window, 'open')
      .mockImplementation(() => null)

    render(<Contacto />)

    await user.click(
      screen.getByRole('button', {
        name: /correo/i,
      })
    )

    expect(openSpy).toHaveBeenCalledWith(
      'mailto:patata@example.com',
      '_blank'
    )
  })

  it('renders social media buttons', () => {
    render(
      <Contacto
        redes={{
          GitHub: 'https://github.com',
          LinkedIn: 'https://linkedin.com',
        }}
      />
    )

    expect(
      screen.getByRole('button', {
        name: /github/i,
      })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', {
        name: /linkedin/i,
      })
    ).toBeInTheDocument()
  })

  it('opens social media links when clicking buttons', async () => {
    const user = userEvent.setup()

    const openSpy = vi
      .spyOn(window, 'open')
      .mockImplementation(() => null)

    render(
      <Contacto
        redes={{
          GitHub: 'https://github.com',
        }}
      />
    )

    await user.click(
      screen.getByRole('button', {
        name: /github/i,
      })
    )

    expect(openSpy).toHaveBeenCalledWith(
      'https://github.com',
      '_blank'
    )
  })

  it('does not render social buttons when redes is empty', () => {
    render(<Contacto redes={{}} />)

    expect(
      screen.queryByRole('button', {
        name: /github/i,
      })
    ).not.toBeInTheDocument()
  })
})