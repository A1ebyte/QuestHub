import { Oferta } from './Ofertas';
import { Captura, Movie } from './Videojuegos';

export interface Bundle {
  id: number;
  nombre: string;
  imagen: string;
  productos: BundleProductos[];
  ofertas:Oferta[];
  videojuegos: BundleVideojuego[];
  movies:Movie;
  capturas:Captura;
}

export interface BundleVideojuego {
  id: number;
  name: string;
  acercaDe: string;
  precio: number;
}

export interface BundleProductos {
  id: number;
  name: string;
}