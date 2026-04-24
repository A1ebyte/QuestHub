export interface Oferta {
  precioOferta: number;
  precioOriginal: number;
  urlCompra: string;
  ahorro: number;
  urlImagen: string;
  tiendaID: number;
  titulo: string;
}

export interface OfertaTarjetaMostrar {
  steamAppID: number;
  precioOferta: number;
  ofertaRating: number;
  ahorro: number;
  urlImagen: string;
  titulo: string;
  reciente: Date;
  reviews: number;
}

export interface PageOfertas {
  content:  OfertaTarjetaMostrar[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}