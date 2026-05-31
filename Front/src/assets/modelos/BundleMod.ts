import { Oferta } from './OfertasMod';
import { Captura, Movie } from './VideojuegosMod';

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
  acerca: string;
  movies: Movie[];
  capturas: Captura[];
}