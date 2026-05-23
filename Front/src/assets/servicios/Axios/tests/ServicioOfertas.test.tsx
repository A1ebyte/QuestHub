// ServicioOfertas.test.ts

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
import ServicioOfertas from '../ServicioOfertas';

describe('ServicioOfertas', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('debe llamar al endpoint con parámetros por defecto', async () => {
      vi.mocked(http.get).mockResolvedValueOnce({ data: [] } as any);

      await ServicioOfertas.getAll();

      expect(http.get).toHaveBeenCalledTimes(1);

      expect(http.get).toHaveBeenCalledWith(
        '/ofertas',
        expect.objectContaining({
          params: {
            page: 0,
            size: 24,
            sort: expect.any(String),
          },
          paramsSerializer: expect.any(Function),
        }),
      );
    });

    it('debe incluir filtros válidos', async () => {
      vi.mocked(http.get).mockResolvedValueOnce({ data: [] } as any);

      await ServicioOfertas.getAll({
        page: 2,
        size: 10,
        sortBy: 'precio',
        direction: 'asc',
        filtros: {
          titulo: 'elden ring',
          tags: ['rpg', 'souls'],
          precioMin: 10,
        },
      });

      expect(http.get).toHaveBeenCalledWith(
        '/ofertas',
        expect.objectContaining({
          params: {
            page: 2,
            size: 10,
            sort: 'precio,asc',
            titulo: 'elden ring',
            tags: ['rpg', 'souls'],
            precioMin: '10',
          },
        }),
      );
    });

    it('debe ignorar filtros vacíos', async () => {
      vi.mocked(http.get).mockResolvedValueOnce({ data: [] } as any);

      await ServicioOfertas.getAll({
        filtros: {
          titulo: '',
          genero: undefined,
          plataforma: null,
        } as any,
      });

      expect(http.get).toHaveBeenCalledWith(
        '/ofertas',
        expect.objectContaining({
          params: {
            page: 0,
            size: 24,
            sort: expect.any(String),
          },
        }),
      );
    });

    it('debe serializar arrays correctamente', async () => {
      vi.mocked(http.get).mockResolvedValueOnce({ data: [] } as any);

      await ServicioOfertas.getAll({
        filtros: {
          tags: ['rpg', 'souls'],
        },
      });

      const call = vi.mocked(http.get).mock.calls[0];

      const serializer = call[1]?.paramsSerializer;

      const result = serializer({
        tags: ['rpg', 'souls'],
      });

      expect(result).toContain('tags=rpg');
      expect(result).toContain('tags=souls');
    });

    it('debe rechazar si el backend está caído', async () => {
      vi.resetModules();

      vi.doMock('../http-axios', () => ({
        default: {
          get: vi.fn(),
        },
        backCaido: true,
      }));

      const ServicioOfertasMock =
        (await import('../ServicioOfertas')).default;

      await expect(
        ServicioOfertasMock.getAll(),
      ).rejects.toThrow('Backend no disponible');
    });
  });

  describe('getOfertasBySteamId', () => {
    it('debe obtener una oferta por id', async () => {
      vi.mocked(http.get).mockResolvedValueOnce({ data: {} } as any);

      await ServicioOfertas.getOfertasBySteamId(123);

      expect(http.get).toHaveBeenCalledWith('/oferta/123');
    });

    it('debe rechazar si el backend está caído', async () => {
      vi.resetModules();

      vi.doMock('../http-axios', () => ({
        default: {
          get: vi.fn(),
        },
        backCaido: true,
      }));

      const ServicioOfertasMock =
        (await import('../ServicioOfertas')).default;

      await expect(
        ServicioOfertasMock.getOfertasBySteamId(123),
      ).rejects.toThrow('Backend no disponible');
    });
  });

  describe('getOfertasBuscador', () => {
    it('debe buscar ofertas por título', async () => {
      vi.mocked(http.get).mockResolvedValueOnce({ data: {} } as any);

      await ServicioOfertas.getOfertasBuscador('elden');

      expect(http.get).toHaveBeenCalledWith(
        '/ofertas/search',
        {
          params: {
            titulo: 'elden',
          },
        },
      );
    });

    it('debe rechazar si el backend está caído', async () => {
      vi.resetModules();

      vi.doMock('../http-axios', () => ({
        default: {
          get: vi.fn(),
        },
        backCaido: true,
      }));

      const ServicioOfertasMock =
        (await import('../ServicioOfertas')).default;

      await expect(
        ServicioOfertasMock.getOfertasBuscador('elden'),
      ).rejects.toThrow('Backend no disponible');
    });
  });

  describe('getMaxPrecioOferta', () => {
    it('debe obtener el precio máximo', async () => {
      vi.mocked(http.get).mockResolvedValueOnce({ data: 100 } as any);

      await ServicioOfertas.getMaxPrecioOferta();

      expect(http.get).toHaveBeenCalledWith(
        '/ofertas/mayorPrecio',
      );
    });

    it('debe rechazar si el backend está caído', async () => {
      vi.resetModules();

      vi.doMock('../http-axios', () => ({
        default: {
          get: vi.fn(),
        },
        backCaido: true,
      }));

      const ServicioOfertasMock =
        (await import('../ServicioOfertas')).default;

      await expect(
        ServicioOfertasMock.getMaxPrecioOferta(),
      ).rejects.toThrow('Backend no disponible');
    });
  });
});