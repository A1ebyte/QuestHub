import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'

import ScrollToTop, { smoothScrollToTop } from './ScrollTop'

describe('ScrollToTop', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls window.scrollTo when pathname changes', () => {
    const scrollSpy = vi
      .spyOn(window, 'scrollTo')
      .mockImplementation(() => {})

    render(
      <MemoryRouter initialEntries={['/home']}>
        <ScrollToTop />
      </MemoryRouter>
    )

    expect(scrollSpy).toHaveBeenCalledWith({
      top: 0,
      left: 0,
    })
  })

  it('exports smoothScrollToTop correctly', () => {
    const scrollSpy = vi
      .spyOn(window, 'scrollTo')
      .mockImplementation(() => {})

    smoothScrollToTop()

    expect(scrollSpy).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
  })
})