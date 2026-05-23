// ServicioUsuarios.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../http-axios', () => {
  return {
    default: {
      get: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
    },
    backCaido: false,
  };
});

import http from '../http-axios';
import ServicioUsuarios from '../ServicioUsuarios';

describe('ServicioUsuarios', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getRecibirNotificaciones', () => {
    it('debe obtener la preferencia de notificaciones', async () => {
      vi.mocked(http.get).mockResolvedValueOnce({
        data: true,
      } as any);

      const response =
        await ServicioUsuarios.getRecibirNotificaciones(
          'user-123',
        );

      expect(http.get).toHaveBeenCalledTimes(1);

      expect(http.get).toHaveBeenCalledWith(
        '/usuarios/preferencias',
        {
          params: {
            id: 'user-123',
          },
        },
      );

      expect(response.data).toBe(true);
    });

    it('debe rechazar si el backend está caído', async () => {
      vi.resetModules();

      vi.doMock('../http-axios', () => ({
        default: {
          get: vi.fn(),
        },
        backCaido: true,
      }));

      const ServicioUsuariosMock =
        (await import('../ServicioUsuarios')).default;

      await expect(
        ServicioUsuariosMock.getRecibirNotificaciones(
          'user-123',
        ),
      ).rejects.toThrow('Backend no disponible');
    });
  });

  describe('patchRecibirNotificaciones', () => {
    it('debe actualizar la preferencia de notificaciones', async () => {
      vi.mocked(http.patch).mockResolvedValueOnce({
        data: false,
      } as any);

      const response =
        await ServicioUsuarios.patchRecibirNotificaciones(
          'user-123',
          false,
        );

      expect(http.patch).toHaveBeenCalledTimes(1);

      expect(http.patch).toHaveBeenCalledWith(
        '/usuarios/preferencias',
        {
          id: 'user-123',
          preferencia: false,
        },
      );

      expect(response.data).toBe(false);
    });

    it('debe rechazar si el backend está caído', async () => {
      vi.resetModules();

      vi.doMock('../http-axios', () => ({
        default: {
          patch: vi.fn(),
        },
        backCaido: true,
      }));

      const ServicioUsuariosMock =
        (await import('../ServicioUsuarios')).default;

      await expect(
        ServicioUsuariosMock.patchRecibirNotificaciones(
          'user-123',
          true,
        ),
      ).rejects.toThrow('Backend no disponible');
    });
  });

  describe('borrarCuenta', () => {
    it('debe borrar la cuenta correctamente', async () => {
      vi.mocked(http.delete).mockResolvedValueOnce({
        data: {},
      } as any);

      await ServicioUsuarios.borrarCuenta('token-123');

      expect(http.delete).toHaveBeenCalledTimes(1);

      expect(http.delete).toHaveBeenCalledWith(
        '/usuarios/eliminar',
        {
          headers: {
            Authorization: 'Bearer token-123',
          },
        },
      );
    });

    it('debe rechazar si el backend está caído', async () => {
      vi.resetModules();

      vi.doMock('../http-axios', () => ({
        default: {
          delete: vi.fn(),
        },
        backCaido: true,
      }));

      const ServicioUsuariosMock =
        (await import('../ServicioUsuarios')).default;

      await expect(
        ServicioUsuariosMock.borrarCuenta('token-123'),
      ).rejects.toThrow('Backend no disponible');
    });
  });
});