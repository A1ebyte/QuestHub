import { vi } from 'vitest'
import { enviarNoti, colores, typeToast } from '../notificacionToast'

const mockToast = vi.hoisted(() => ({
  success: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  info: vi.fn(),
}))

vi.mock('react-toastify', () => ({
  toast: mockToast,
}))

import { toast } from 'react-toastify'

describe('enviarNoti - FULL COVERAGE', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const base = ['Titulo', 'Mensaje', null] as const

  it('SUCCESS branch', () => {
    enviarNoti('success', ...base)

    expect(toast.success).toHaveBeenCalledTimes(1)
  })

  it('ERROR branch', () => {
    enviarNoti('error', ...base)

    expect(toast.error).toHaveBeenCalledTimes(1)
  })

  it('WARN branch', () => {
    enviarNoti('warn', ...base)

    expect(toast.warn).toHaveBeenCalledTimes(1)
  })

  it('INFO branch', () => {
    enviarNoti('info', ...base)

    expect(toast.info).toHaveBeenCalledTimes(1)
  })

  it('custom icon branch overrides default', () => {
    enviarNoti('success', 'Titulo', 'Mensaje', 'CUSTOM_ICON')

    const [, options] = mockToast.success.mock.calls[0]

    expect(options.icon).toBe('CUSTOM_ICON')
  })

  it('undefined icon uses fallback icon branch', () => {
    enviarNoti('error', 'Titulo', 'Mensaje', undefined)

    const [, options] = mockToast.error.mock.calls[0]

    expect(options.icon).toBeDefined()
  })

  it('null icon also triggers default icon branch', () => {
    enviarNoti('warn', 'Titulo', 'Mensaje', null)

    const [, options] = mockToast.warn.mock.calls[0]

    expect(options.icon).toBeDefined()
  })

  it('covers all toast types sequentially (branch pressure)', () => {
    enviarNoti('success', 'A', 'B', null)
    enviarNoti('error', 'A', 'B', null)
    enviarNoti('warn', 'A', 'B', null)
    enviarNoti('info', 'A', 'B', null)

    expect(toast.success).toHaveBeenCalled()
    expect(toast.error).toHaveBeenCalled()
    expect(toast.warn).toHaveBeenCalled()
    expect(toast.info).toHaveBeenCalled()
  })

  it('exports constants correctly', () => {
    expect(typeToast).toEqual({
      SUCCESS: 'success',
      ERROR: 'error',
      INFO: 'info',
      WARN: 'warn',
    })

    expect(colores).toBeDefined()
    expect(typeof colores).toBe('object')
  })
})