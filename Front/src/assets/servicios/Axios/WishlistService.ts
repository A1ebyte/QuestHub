import axios from "axios";
import http from "./http-axios";
import { Wishlist } from "../../modelos/Wishlist";

export const WishlistService = {

  toggle: async (
    itemId: number| string,
    token: string,
  ): Promise<{ mensaje: string }> => {
    console.log(`🚀 Intentando toggle del item: ${itemId}`);
    const response = await http.post(
      "/wishlist/toggle",
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
    const response = await http.get<Wishlist[]>("/wishlist/mis-favoritos", {
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
}
};

