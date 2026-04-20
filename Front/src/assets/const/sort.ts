export enum SortBy {
  PRECIO = "precioOferta",
  AHORRO = "ahorro",
  RATING = "ofertaRating",
  RECIENTE = "recent",
  REVIEWS = "reviews",
  TITULO = "titulo",
}

export enum Direction {
  ASC = "asc",
  DESC = "desc",
}

export const sortLabels: Record<SortBy, string> = {
  [SortBy.TITULO]: "Título",
  [SortBy.PRECIO]: "Precio",
  [SortBy.AHORRO]: "Ahorro",
  [SortBy.RATING]: "Rating de oferta",
  [SortBy.RECIENTE]: "Oferta reciente",
  [SortBy.REVIEWS]: "Reviews",
};

export const DEFAULT_SORT_BY = SortBy.RATING;
export const DEFAULT_DIRECTION = Direction.DESC;
