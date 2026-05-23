import { TIERS, getOfferTier } from "../tiers";

describe("TIERS", () => {
  it("should be a non-empty array", () => {
    expect(Array.isArray(TIERS)).toBe(true);
    expect(TIERS.length).toBeGreaterThan(0);
  });

  it("each tier has valid structure", () => {
    TIERS.forEach((tier) => {
      expect(tier).toHaveProperty("id");
      expect(typeof tier.id).toBe("string");

      expect(tier).toHaveProperty("min");
      expect(typeof tier.min).toBe("number");

      expect(tier).toHaveProperty("max");
      expect(typeof tier.max).toBe("number");

      expect(tier).toHaveProperty("color");
      expect(typeof tier.color).toBe("string");

      expect(tier).toHaveProperty("text");
      expect(typeof tier.text).toBe("string");
    });
  });

  it("tiers should have valid ranges (min <= max)", () => {
    TIERS.forEach((tier) => {
      expect(tier.min).toBeLessThanOrEqual(tier.max);
    });
  });

  it("ids are unique", () => {
    const ids = TIERS.map((t) => t.id);
    const unique = new Set(ids);

    expect(unique.size).toBe(ids.length);
  });
});

describe("getOfferTier", () => {
  it("returns correct tier for rating", () => {
    expect(getOfferTier(10)).toBe(TIERS[0]); // MYTHIC
    expect(getOfferTier(9)).toBe(TIERS[1]); // EPIC
    expect(getOfferTier(8)).toBe(TIERS[2]); // RARE
    expect(getOfferTier(7)).toBe(TIERS[3]); // STANDARD
    expect(getOfferTier(5)).toBe(TIERS[4]); // BASIC
  });

  it("handles edge values correctly", () => {
    expect(getOfferTier(9.5).id).toBe("MYTHIC");
    expect(getOfferTier(9.49).id).toBe("EPIC");
    expect(getOfferTier(8.5).id).toBe("EPIC");
    expect(getOfferTier(7.5).id).toBe("RARE");
    expect(getOfferTier(6.5).id).toBe("STANDARD");
    expect(getOfferTier(0).id).toBe("BASIC");
  });

  it("returns fallback tier if no match (should not happen normally)", () => {
    // fuerza caso raro
    const result = getOfferTier(-10);
    expect(result).toBe(TIERS[3]); // STANDARD fallback según tu código
  });
});