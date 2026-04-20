import { Videojuego } from "./Videojuegos"

export interface Wishlist {
    id:number;
    userId:string;
    videojuego:Videojuego;
    fechaLanzamiento:string;
}