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

export const sortLabels: Record<string, {order:SortBy,dir:Direction}> = {
  "Tendencias":{order:SortBy.RATING,dir:Direction.DESC},
  "Top descuentos":{order:SortBy.AHORRO,dir:Direction.DESC},
  "Título: A-Z":{order:SortBy.TITULO,dir:Direction.ASC},
  "Título: Z-A":{order:SortBy.TITULO,dir:Direction.DESC},
  "Precio: Menor a mayor":{order:SortBy.PRECIO,dir:Direction.DESC},
  "Precio: Mayor a menor":{order:SortBy.PRECIO,dir:Direction.ASC},
  "Reseñas: Mejor":{order:SortBy.REVIEWS,dir:Direction.DESC},
  "Reseñas: Peor":{order:SortBy.REVIEWS,dir:Direction.ASC},
  "Más Recientes":{order:SortBy.RECIENTE,dir:Direction.DESC},
  "Más Antiguas":{order:SortBy.RECIENTE,dir:Direction.ASC},
};

export function getLabelFromSort(sortBy: SortBy, direction: Direction): string | null {
  const entry = Object.entries(sortLabels).find(
    ([, cfg]) => cfg.order === sortBy && cfg.dir === direction
  );
  return entry ? entry[0] : null;
}

export const DEFAULT_SORT_BY = SortBy.RATING;
export const DEFAULT_DIRECTION = Direction.DESC;
