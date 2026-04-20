export enum SortBy {
  Precio = "precioOferta",
  Ahorro = "ahorro",
  Rating = "ofertaRating",
  Reciente = "recent",
  Reviews = "reviews",
  Titulo = "titulo",
}

export enum Direction {
  Asc = "asc",
  Desc = "desc",
}

export const sortLabels: Record<SortBy, string> = {
  [SortBy.Titulo]: "Título",
  [SortBy.Precio]: "Precio",
  [SortBy.Ahorro]: "Ahorro",
  [SortBy.Rating]: "Rating de oferta",
  [SortBy.Reciente]: "Oferta reciente",
  [SortBy.Reviews]: "Reviews",
};

export const DEFAULT_SORT_BY = SortBy.Rating;
export const DEFAULT_DIRECTION = Direction.Desc;
