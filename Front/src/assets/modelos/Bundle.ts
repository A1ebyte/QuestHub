import { Oferta } from './Ofertas';
import { Captura, Movie } from './Videojuegos';

export interface Bundle {
  id: number;
  nombre: string;
  imagen: string;
  
  productos: BundleProductos[];
  ofertas: Oferta[];
}

export interface BundleProductos {
  nombre: string;
  imagen: string;
  movies: Movie[];
  capturas: Captura[];
}