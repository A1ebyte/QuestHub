export const REVIEWS = [
  {
    id: "NO_REVIEWS",
    text: "Sin reviews",
  },
  {
    id: "EXTREMADAMENTENEGATIVAS",
    text: "Extremadamente negativas",
  },
  {
    id: "NEGATIVAS",
    text: "Negativas",
  },
  {
    id: "VARIADAS",
    text: "Variadas",
  },
  {
    id: "POSITIVAS",
    text: "Positivas",
  },
  {
    id: "EXTREMADAMENTEPOSITIVAS",
    text: "Extremadamente positivas",
  },
] as const;

export type ReviewsID = (typeof REVIEWS)[number]["id"];
