import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import ModalMedia from './ModalMedia'

vi.mock('hls.js', () => {
  return {
    default: class MockHls {
      static isSupported() {
        return true
      }

      loadSource = vi.fn()
      attachMedia = vi.fn()
      destroy = vi.fn()
    },
  }
})

describe('ModalMedia component', () => {
  const mockMovies = [
    {
      video: 'https://video-test.m3u8',
      thumb: '/thumb-video.jpg',
    },
  ]

  const mockCaptures = [
    {
      imagen: '/capture-1.jpg',
      thumb: '/thumb-capture-1.jpg',
    },

    {
      imagen: '/capture-2.jpg',
      thumb: '/thumb-capture-2.jpg',
    },
  ]

  const onClose = vi.fn()
  const onNavigate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('does not render when activeIndex is null', () => {
    const { container } = render(
      <ModalMedia
        movies={mockMovies}
        captures={mockCaptures}
        activeIndex={null}
        onClose={onClose}
        onNavigate={onNavigate}
      />
    )

    expect(container.firstChild).toBeNull()
  })

  it('does not render when items are empty', () => {
    const { container } = render(
      <ModalMedia
        movies={[]}
        captures={[]}
        activeIndex={0}
        onClose={onClose}
        onNavigate={onNavigate}
      />
    )

    expect(container.firstChild).toBeNull()
  })

  it('renders video when current item is a movie', () => {
    render(
      <ModalMedia
        movies={mockMovies}
        captures={mockCaptures}
        activeIndex={0}
        onClose={onClose}
        onNavigate={onNavigate}
      />
    )

    const video =
      document.querySelector('video')

    expect(video).toBeInTheDocument()
  })

  it('renders image when current item is a capture', () => {
    render(
      <ModalMedia
        movies={mockMovies}
        captures={mockCaptures}
        activeIndex={1}
        onClose={onClose}
        onNavigate={onNavigate}
      />
    )

    expect(
      screen.getByRole('img', {
        name: /captura/i,
      })
    ).toBeInTheDocument()
  })

  it('calls onClose when clicking close button', async () => {
    const user = userEvent.setup()

    render(
      <ModalMedia
        movies={mockMovies}
        captures={mockCaptures}
        activeIndex={0}
        onClose={onClose}
        onNavigate={onNavigate}
      />
    )

    await user.click(
      screen.getByRole('button', {
        name: /✕/i,
      })
    )

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('navigates to previous item', async () => {
    const user = userEvent.setup()

    render(
      <ModalMedia
        movies={mockMovies}
        captures={mockCaptures}
        activeIndex={1}
        onClose={onClose}
        onNavigate={onNavigate}
      />
    )

    const prevButton =
      document.querySelector('.prev')

    expect(prevButton).toBeInTheDocument()

    await user.click(prevButton!)

    expect(onNavigate).toHaveBeenCalledWith(0)
  })

  it('navigates to next item', async () => {
    const user = userEvent.setup()

    render(
      <ModalMedia
        movies={mockMovies}
        captures={mockCaptures}
        activeIndex={1}
        onClose={onClose}
        onNavigate={onNavigate}
      />
    )

    const nextButton =
      document.querySelector('.next')

    expect(nextButton).toBeInTheDocument()

    await user.click(nextButton!)

    expect(onNavigate).toHaveBeenCalledWith(2)
  })

  it('loops to last item when navigating prev from first item', async () => {
    const user = userEvent.setup()

    render(
      <ModalMedia
        movies={mockMovies}
        captures={mockCaptures}
        activeIndex={0}
        onClose={onClose}
        onNavigate={onNavigate}
      />
    )

    const prevButton =
      document.querySelector('.prev')

    await user.click(prevButton!)

    expect(onNavigate).toHaveBeenCalledWith(2)
  })

  it('loops to first item when navigating next from last item', async () => {
    const user = userEvent.setup()

    render(
      <ModalMedia
        movies={mockMovies}
        captures={mockCaptures}
        activeIndex={2}
        onClose={onClose}
        onNavigate={onNavigate}
      />
    )

    const nextButton =
      document.querySelector('.next')

    await user.click(nextButton!)

    expect(onNavigate).toHaveBeenCalledWith(0)
  })

  it('renders thumbnails', () => {
    render(
      <ModalMedia
        movies={mockMovies}
        captures={mockCaptures}
        activeIndex={0}
        onClose={onClose}
        onNavigate={onNavigate}
      />
    )

    const previews =
      screen.getAllByRole('img')

    expect(previews.length).toBeGreaterThan(1)
  })

  it('navigates when clicking thumbnail', async () => {
    const user = userEvent.setup()

    render(
      <ModalMedia
        movies={mockMovies}
        captures={mockCaptures}
        activeIndex={0}
        onClose={onClose}
        onNavigate={onNavigate}
      />
    )

    const thumbnails =
      document.querySelectorAll(
        '.thumb-container'
      )

    await user.click(thumbnails[1])

    expect(onNavigate).toHaveBeenCalledWith(1)
  })

  it('renders play icon for video thumbnails', () => {
    render(
      <ModalMedia
        movies={mockMovies}
        captures={mockCaptures}
        activeIndex={0}
        onClose={onClose}
        onNavigate={onNavigate}
      />
    )

    const playIcon =
      document.querySelector(
        '.thumb-play-button'
      )

    expect(playIcon).toBeInTheDocument()
  })
})