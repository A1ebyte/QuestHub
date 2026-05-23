import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import Footer from './Footer'

describe('Footer component', () => {
  const renderFooter = () => {
    return render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    )
  }

  it('renders copyright text', () => {
    renderFooter()

    expect(
      screen.getByText(
        /©2026 questhub — all rights reserved/i
      )
    ).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    renderFooter()

    expect(
      screen.getByRole('link', {
        name: /acerca de nosotros/i,
      })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('link', {
        name: /privacidad/i,
      })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('link', {
        name: /contactar/i,
      })
    ).toBeInTheDocument()
  })

  it('renders correct routes for internal links', () => {
    renderFooter()

    expect(
      screen.getByRole('link', {
        name: /acerca de nosotros/i,
      })
    ).toHaveAttribute('href', '/acerca')

    expect(
      screen.getByRole('link', {
        name: /privacidad/i,
      })
    ).toHaveAttribute('href', '/privacidad')
  })

  it('renders mailto contact link', () => {
    renderFooter()

    expect(
      screen.getByRole('link', {
        name: /contactar/i,
      })
    ).toHaveAttribute(
      'href',
      'mailto:info@tuempresa.com'
    )
  })

  it('renders logo image', () => {
    renderFooter()

    const logo = screen.getByRole('img', {
      name: /logo/i,
    })

    expect(logo).toBeInTheDocument()

    expect(logo).toHaveAttribute(
      'src',
      '/Imagenes/Logo.png'
    )
  })

  it('renders homepage link around logo', () => {
    renderFooter()

    const homeLinks = screen.getAllByRole('link')

    const homeLink = homeLinks.find(
      (link) => link.getAttribute('href') === '/'
    )

    expect(homeLink).toBeDefined()
  })
})