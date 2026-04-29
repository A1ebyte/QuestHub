import { Direction, SortBy } from "../const/sort";
import { ReviewsID } from "../const/reviews";
import { TiersID } from "../const/tiers";
import { Videojuego } from "./Videojuegos";
import { Bundle } from "./Bundle";

export interface FilterPageable {
  page?: number;
  size?: number;
  sortBy?: SortBy;
  direction?: Direction;
  filtros?: Filtros;
}

export interface Paginator {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export interface Filtros {
  titulo?: string;
  minPrecio?: number;
  maxPrecio?: number;
  minAhorro?: number;
  tiers?: TiersID[];
  reviews?: ReviewsID[];
  tiendaIds?: number[];
}

export type DetalleResponse ={ Juego: Videojuego } | { Bundle: Bundle };

