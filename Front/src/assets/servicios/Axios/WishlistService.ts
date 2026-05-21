import http from "./http-axios";
import { ToggleWishlistResponse, Wishlist } from "../../modelos/Wishlist";

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

