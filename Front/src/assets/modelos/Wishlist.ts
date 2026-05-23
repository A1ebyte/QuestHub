import { Videojuego } from "./Videojuegos"

export interface Wishlist {
    id:number;
    idWishlist:string;
    nombre:string;
    imagen:string;
    onSale:boolean;
}

export interface ToggleWishlistResponse {
   success: boolean;
   action: "ADDED" | "REMOVED";
   itemId: number;
}