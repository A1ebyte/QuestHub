export const TIERS = [
  {
    id: "MYTHIC",
    min: 9.5,
    max: 10,
    color: "#ff9f43",
    text: "Mythic",
  }
  ,
  {
    id: "EPIC",
    min: 8.5,
    max: 9.49,
    color: "#d17bff",
    text: "Epic",
  },
  {
    id: "RARE",
    min: 7.5,
    max: 8.49,
    color: "#10cfff",
    text: "Elite",
  },
  {
    id: "STANDARD",
    min: 6.5,
    max: 7.49,
    color: "#7cff7c",
    text: "Standard",
  },
  {
    id: "BASIC",
    min: 0,
    max: 6.49,
    color: "#e2e2e2",
    text: "Basic",
  },
] as const;

export function getOfferTier(rating: number) {
  return TIERS.find((t) => rating >= t.min && rating <= t.max) ?? TIERS[3];
}