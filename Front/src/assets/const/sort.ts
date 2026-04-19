export enum SortBy {
  Precio = "precioOferta",
  Ahorro = "ahorro",
  Rating = "ofertaRating",
  Reciente = "recent",
}

export enum Direction {
  Asc = "asc",
  Desc = "desc",
}

export const sortLabels: Record<SortBy, string> = {
  [SortBy.Precio]: "Precio",
  [SortBy.Ahorro]: "Ahorro",
  [SortBy.Rating]: "Rating de oferta",
  [SortBy.Reciente]: "Más reciente",
};

export const DEFAULT_SORT_BY = SortBy.Rating;
export const DEFAULT_DIRECTION = Direction.Desc;
