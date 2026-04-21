export const REVIEWS = [
  {
    id: "EXTREMADAMENTEPOSITIVAS",
    text: "Extremadamente positivas",
  },
  {
    id: "POSITIVAS",
    text: "Positivas",
  },
  {
    id: "VARIADAS",
    text: "Variadas",
  },
  {
    id: "NEGATIVAS",
    text: "Negativas",
  },
  {
    id: "EXTREMADAMENTENEGATIVAS",
    text: "Extremadamente negativas",
  },
  {
    id: "NO_REVIEWS",
    text: "Sin reviews",
  }
] as const;

export type ReviewsID = (typeof REVIEWS)[number]["id"];
