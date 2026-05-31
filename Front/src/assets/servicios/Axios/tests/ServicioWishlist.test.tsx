// WishlistService.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../http-axios', () => {
  return {
    default: {
      post: vi.fn(),
      get: vi.fn(),
      delete: vi.fn(),
    },
  };
});

import http from '../http-axios';
import { WishlistService } from '../ServicioWishlist';

describe('WishlistService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('toggle', () => {
    it('debe añadir o eliminar un favorito correctamente', async () => {
      const responseMock = {
        agregado: true,
        mensaje: 'Añadido a favoritos',
      };

      vi.mocked(http.post).mockResolvedValueOnce({
        data: responseMock,
      } as any);

      const response = await WishlistService.toggle(
        123,
        'token-123',
      );

      expect(http.post).toHaveBeenCalledTimes(1);

      expect(http.post).toHaveBeenCalledWith(
        '/wishlist/toggle',
        {
          id: 123,
        },
        {
          headers: {
            Authorization: 'Bearer token-123',
          },
        },
      );

      expect(response).toEqual(responseMock);
    });

    it('debe aceptar ids string', async () => {
      vi.mocked(http.post).mockResolvedValueOnce({
        data: {},
      } as any);

      await WishlistService.toggle(
        'steam-123',
        'token-123',
      );

      expect(http.post).toHaveBeenCalledWith(
        '/wishlist/toggle',
        {
          id: 'steam-123',
        },
        expect.any(Object),
      );
    });
  });

  describe('obtenerFavoritos', () => {
    it('debe obtener los favoritos del usuario', async () => {
      const favoritosMock = [
        {
          id: 1,
          titulo: 'Elden Ring',
        },
        {
          id: 2,
          titulo: 'Cyberpunk 2077',
        },
      ];

      vi.mocked(http.get).mockResolvedValueOnce({
        data: favoritosMock,
      } as any);

      const response =
        await WishlistService.obtenerFavoritos({
          token: 'token-123',
        });

      expect(http.get).toHaveBeenCalledTimes(1);

      expect(http.get).toHaveBeenCalledWith(
        '/wishlist/mis-favoritos',
        {
          params: {
            page: 0,
            size: 24,
            titulo: undefined,
          },
          headers: {
            Authorization: 'Bearer token-123',
          },
        },
      );

      expect(response).toEqual(favoritosMock);
    });

    it('debe enviar page, size y titulo', async () => {
      vi.mocked(http.get).mockResolvedValueOnce({
        data: [],
      } as any);

      await WishlistService.obtenerFavoritos({
        token: 'token-123',
        page: 2,
        size: 10,
        titulo: 'Elden',
      });

      expect(http.get).toHaveBeenCalledWith(
        '/wishlist/mis-favoritos',
        {
          params: {
            page: 2,
            size: 10,
            titulo: 'Elden',
          },
          headers: {
            Authorization: 'Bearer token-123',
          },
        },
      );
    });
  });

  describe('eliminar', () => {
    it('debe eliminar un favorito correctamente', async () => {
      vi.mocked(http.delete).mockResolvedValueOnce(
        {} as any,
      );

      await WishlistService.eliminar(
        123,
        'token-123',
      );

      expect(http.delete).toHaveBeenCalledTimes(1);

      expect(http.delete).toHaveBeenCalledWith(
        '/wishlist/eliminar/123',
        {
          headers: {
            Authorization: 'Bearer token-123',
          },
        },
      );
    });

    it('debe aceptar ids string', async () => {
      vi.mocked(http.delete).mockResolvedValueOnce(
        {} as any,
      );

      await WishlistService.eliminar(
        'steam-123',
        'token-123',
      );

      expect(http.delete).toHaveBeenCalledWith(
        '/wishlist/eliminar/steam-123',
        {
          headers: {
            Authorization: 'Bearer token-123',
          },
        },
      );
    });
  });

  describe('obtenerIdsFavoritos', () => {
    it('debe obtener los ids favoritos del usuario', async () => {
      const idsMock = [1, 2, 3];

      vi.mocked(http.get).mockResolvedValueOnce({
        data: idsMock,
      } as any);

      const response =
        await WishlistService.obtenerIdsFavoritos(
          'token-123',
        );

      expect(http.get).toHaveBeenCalledTimes(1);

      expect(http.get).toHaveBeenCalledWith(
        '/wishlist/ids',
        {
          headers: {
            Authorization: 'Bearer token-123',
          },
        },
      );

      expect(response).toEqual(idsMock);
    });
  });
});