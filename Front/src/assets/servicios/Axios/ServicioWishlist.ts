import http from "./http-axios";
import { PageWishlist, ToggleWishlistResponse } from "../../modelos/Wishlist";

export const WishlistService = {
  toggle: async (
    id: number | string,
    token: string,
  ): Promise<ToggleWishlistResponse> => {
    const response = await http.post(
      "/wishlist/toggle",
      { id: id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  },

  obtenerFavoritos: async ({
    page = 0,
    size = 24,
    token,
    titulo,
  }: {
    page?: number;
    size?: number;
    token: string;
    titulo?: string;
  }):Promise<PageWishlist> => {
    const response = await http.get("/wishlist/mis-favoritos", {
      params: {
        page,
        size,
        titulo,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  eliminar: async (itemId: number | string, token: string): Promise<void> => {
    await http.delete(`/wishlist/eliminar/${itemId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  obtenerIdsFavoritos: async (token: string): Promise<number[]> => {
    const response = await http.get<number[]>("/wishlist/ids", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },
};
