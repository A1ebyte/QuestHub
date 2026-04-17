export const TIERS = [
  {
    id: "MYTHIC",
    label: "Mythic (9.5+)",
    min: 9.5,
    max: 10,
    color: "#d17bff",
    text: "Mythic",
  },
  {
    id: "ELITE",
    label: "Elite (8–9.49)",
    min: 8,
    max: 9.49,
    color: "#10cfff",
    text: "Elite",
  },
  {
    id: "STANDARD",
    label: "Standard (6.5–7.99)",
    min: 6.5,
    max: 7.99,
    color: "#7cff7c",
    text: "Standard",
  },
  {
    id: "BASIC",
    label: "Basic (<6.5)",
    min: 0,
    max: 6.49,
    color: "#ececec",
    text: "Basic",
  },
] as const;

export type TierID = (typeof TIERS)[number]["id"];

export function getOfferTier(rating: number) {
  return TIERS.find((t) => rating >= t.min && rating <= t.max) ?? TIERS[3];
}
