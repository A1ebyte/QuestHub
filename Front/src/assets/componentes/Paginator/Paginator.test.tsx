import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import Paginator from './Paginator'

vi.mock('../../util/ScrollTop', () => ({
  smoothScrollToTop: vi.fn(),
}))

import { smoothScrollToTop } from '../../util/ScrollTop'

describe('Paginator', () => {
  const mockOnPageChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders nothing when totalPages <= 0', () => {
    const { container } = render(
      <Paginator
        totalPages={0}
        currentPage={1}
        onPageChange={mockOnPageChange}
      />
    )

    expect(container.firstChild).toBeNull()
  })

  it('renders paginator buttons', () => {
    render(
      <Paginator
        totalPages={5}
        currentPage={1}
        onPageChange={mockOnPageChange}
      />
    )

    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('calls onPageChange when clicking next page', async () => {
    const user = userEvent.setup()

    render(
      <Paginator
        totalPages={5}
        currentPage={1}
        onPageChange={mockOnPageChange}
      />
    )

    await user.click(screen.getByText('2'))

    expect(mockOnPageChange).toHaveBeenCalledWith(2)
    expect(smoothScrollToTop).toHaveBeenCalled()
  })

  it('does not call onPageChange when clicking current page', async () => {
    const user = userEvent.setup()

    render(
      <Paginator
        totalPages={5}
        currentPage={2}
        onPageChange={mockOnPageChange}
      />
    )

    await user.click(screen.getByText('2'))

    expect(mockOnPageChange).not.toHaveBeenCalled()
    expect(smoothScrollToTop).toHaveBeenCalled()
  })

  it('goes to previous page', async () => {
    const user = userEvent.setup()

    render(
      <Paginator
        totalPages={5}
        currentPage={3}
        onPageChange={mockOnPageChange}
      />
    )

    const prevButton = screen.getAllByRole('button')[0]

    await user.click(prevButton)

    expect(mockOnPageChange).toHaveBeenCalledWith(2)
  })

  it('goes to next page', async () => {
    const user = userEvent.setup()

    render(
      <Paginator
        totalPages={5}
        currentPage={3}
        onPageChange={mockOnPageChange}
      />
    )

    const buttons = screen.getAllByRole('button')
    const nextButton = buttons[buttons.length - 1]

    await user.click(nextButton)

    expect(mockOnPageChange).toHaveBeenCalledWith(4)
  })

  it('does not go below page 1', async () => {
    const user = userEvent.setup()

    render(
      <Paginator
        totalPages={5}
        currentPage={1}
        onPageChange={mockOnPageChange}
      />
    )

    const prevButton = screen.getAllByRole('button')[0]

    await user.click(prevButton)

    expect(mockOnPageChange).not.toHaveBeenCalled()
  })

  it('does not go above totalPages', async () => {
    const user = userEvent.setup()

    render(
      <Paginator
        totalPages={5}
        currentPage={5}
        onPageChange={mockOnPageChange}
      />
    )

    const buttons = screen.getAllByRole('button')
    const nextButton = buttons[buttons.length - 1]

    await user.click(nextButton)

    expect(mockOnPageChange).not.toHaveBeenCalled()
  })

  it('renders dots when pages are truncated from middle', () => {
    render(
      <Paginator
        totalPages={10}
        currentPage={5}
        onPageChange={mockOnPageChange}
      />
    )

    expect(screen.getAllByText('…')).toHaveLength(2)
  })

  it('renders ending pages correctly', () => {
    render(
      <Paginator
        totalPages={10}
        currentPage={9}
        onPageChange={mockOnPageChange}
      />
    )

    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('8')).toBeInTheDocument()
  })

  it('renders starting pages correctly', () => {
    render(
      <Paginator
        totalPages={10}
        currentPage={2}
        onPageChange={mockOnPageChange}
      />
    )

    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
  })

  it('applies active class to current page', () => {
    render(
      <Paginator
        totalPages={5}
        currentPage={3}
        onPageChange={mockOnPageChange}
      />
    )

    const activeButton = screen.getByText('3')

    expect(activeButton).toHaveClass('active')
  })

  it('applies disabled class to prev button on first page', () => {
    render(
      <Paginator
        totalPages={5}
        currentPage={1}
        onPageChange={mockOnPageChange}
      />
    )

    const prevButton = screen.getAllByRole('button')[0]

    expect(prevButton).toHaveClass('disabled')
  })

  it('applies disabled class to next button on last page', () => {
    render(
      <Paginator
        totalPages={5}
        currentPage={5}
        onPageChange={mockOnPageChange}
      />
    )

    const buttons = screen.getAllByRole('button')
    const nextButton = buttons[buttons.length - 1]

    expect(nextButton).toHaveClass('disabled')
  })
})