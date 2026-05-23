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

  const baseArgs = ['Titulo', 'Mensaje', null] as const

  it('covers SUCCESS with default icon', () => {
    enviarNoti('success', ...baseArgs)

    expect(toast.success).toHaveBeenCalled()
  })

  it('covers ERROR with default icon', () => {
    enviarNoti('error', ...baseArgs)

    expect(toast.error).toHaveBeenCalled()
  })

  it('covers WARN with default icon', () => {
    enviarNoti('warn', ...baseArgs)

    expect(toast.warn).toHaveBeenCalled()
  })

  it('covers INFO with default icon', () => {
    enviarNoti('info', ...baseArgs)

    expect(toast.info).toHaveBeenCalled()
  })

  it('covers custom icon override (IMPORTANT BRANCH)', () => {
    const customIcon = 'CUSTOM_ICON'

    enviarNoti('success', 'Titulo', 'Mensaje', customIcon)

    expect(toast.success).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        icon: customIcon,
      })
    )
  })

  it('covers fallback icon logic (iconoSVG falsy branch)', () => {
    enviarNoti('error', 'Titulo', 'Mensaje', undefined)

    expect(toast.error).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        icon: expect.anything(), // default icon path
      })
    )
  })

  it('forces execution of all toast types sequentially', () => {
    enviarNoti('success', 'A', 'B', null)
    enviarNoti('error', 'A', 'B', null)
    enviarNoti('warn', 'A', 'B', null)
    enviarNoti('info', 'A', 'B', null)

    expect(toast.success).toHaveBeenCalled()
    expect(toast.error).toHaveBeenCalled()
    expect(toast.warn).toHaveBeenCalled()
    expect(toast.info).toHaveBeenCalled()
  })

  it('exports constants correctly (full coverage)', () => {
    expect(colores).toEqual(
      expect.objectContaining({
        ROJO: '#e63946',
        AMARILLO: '#f1c40f',
        TEAL: expect.any(String),
      })
    )

    expect(typeToast).toEqual({
      SUCCESS: 'success',
      ERROR: 'error',
      INFO: 'info',
      WARN: 'warn',
    })
  })
})