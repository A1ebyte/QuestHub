// ServicioTienda.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../http-axios', () => {
  return {
    default: {
      get: vi.fn(),
    },
    backCaido: false,
  };
});

import http from '../http-axios';
import ServicioTienda from '../ServicioTienda';

describe('ServicioTienda', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllTiendas', () => {
    it('debe obtener todas las tiendas', async () => {
      const tiendasMock = [
        {
          id: 1,
          nombre: 'Steam',
        },
        {
          id: 2,
          nombre: 'Epic Games',
        },
      ];

      vi.mocked(http.get).mockResolvedValueOnce({
        data: tiendasMock,
      } as any);

      const response = await ServicioTienda.getAllTiendas();

      expect(http.get).toHaveBeenCalledTimes(1);

      expect(http.get).toHaveBeenCalledWith('/tiendas');

      expect(response.data).toEqual(tiendasMock);
    });

    it('debe rechazar si el backend está caído', async () => {
      vi.resetModules();

      vi.doMock('../http-axios', () => ({
        default: {
          get: vi.fn(),
        },
        backCaido: true,
      }));

      const ServicioTiendaMock =
        (await import('../ServicioTienda')).default;

      await expect(
        ServicioTiendaMock.getAllTiendas(),
      ).rejects.toThrow('Backend no disponible');
    });
  });
});