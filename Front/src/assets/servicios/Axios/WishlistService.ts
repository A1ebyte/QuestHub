import axios from "axios";
import { Wishlist } from "../../modelos/Wishlist";

const api = axios.create({
  baseURL: "http://localhost:8080/api/wishlist",
});

export const WishlistService = {
  toggle: async (
    gameId: number,
    token: string,
  ): Promise<{ message: string }> => {
    const response = await api.post(
      "/toggle",
      { idVideojuego: gameId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  },

  obtenerFavoritos: async (token: string): Promise<Wishlist[]> => {
    const response = await api.get<Wishlist[]>("/mis-favoritos", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};
