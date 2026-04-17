import { Direction, SortBy } from "../const/sort";
import { TierID } from "../const/tiers";

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
  tiers?: TierID[];
  minReviews?: number;
  inicioOferta?: string;

  tiendaIds?: number[];
}
