import { Oferta } from './Ofertas';

export interface Videojuego {
  id: number;
  imagen: string;
  imagenCapsule: string;
  nombre: string;
  ratingText: string;
  rating: number;
  lanzamiento: string;
  descripcion: string;
  descripcionCorta: string;
  acercaDe: string;
  desarrolladores: string;
  distribuidores: string;

  generos: string[];
  movies: Movie[];
  capturas: Captura[];
  ofertas: Oferta[];
  bundles: VideojuegoBundle[];
}

export interface Captura {
  thumb: string;
  url: string;
}

export interface Movie {
  thumb: string;
  url: string;
}

export interface VideojuegoBundle {
  id: number;
  name: string;
  precio: number;
}