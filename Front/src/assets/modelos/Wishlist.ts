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

export interface PageWishlist {
  content:  Wishlist[];
  page: number,
  size: number,
  totalItems: number
}