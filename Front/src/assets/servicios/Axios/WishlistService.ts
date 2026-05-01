import axios from "axios";
import { Wishlist } from "../../modelos/Wishlist";

const api = axios.create({
  baseURL: "http://localhost:8080/api/wishlist",
});

export const WishlistService = {

  toggle: async (
    itemId: number| string,
    token: string,
  ): Promise<{ mensaje: string }> => {
    console.log(`🚀 Intentando toggle del item: ${itemId}`);
    const response = await api.post(
      "/toggle",
      { idItem: itemId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log("✅ Respuesta del servidor:", response.data);
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
  
eliminar: async (itemId: number | string, token: string): Promise<void> => {
    await api.delete(`/eliminar/${itemId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
}
};

