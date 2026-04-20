import { Direction, SortBy } from "../const/sort";

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
  tiers?: string[];
  reviews?: string[];
  inicioOferta?: string;
  tiendaIds?: number[];
}
