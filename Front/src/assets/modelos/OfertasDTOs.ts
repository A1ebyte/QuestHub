export interface Oferta {
  precioOferta: number;
  precioOriginal: number;
  urlCompra: string;
  ahorro: number;
  urlImagen: string;
  tiendaID: number;
  titulo: string;
}

export interface PageOfertas {
  content: Oferta[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}