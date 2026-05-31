import { msjsWishlist } from "../mensajesWishlist";

describe("msjsWishlist", () => {
  it("should be a non-empty array", () => {
    expect(Array.isArray(msjsWishlist)).toBe(true);
    expect(msjsWishlist.length).toBeGreaterThan(0);
  });

  it("each item has required properties", () => {
    msjsWishlist.forEach((item) => {
      expect(item).toHaveProperty("mensj");
      expect(typeof item.mensj).toBe("string");
      expect(item.mensj.trim().length).toBeGreaterThan(0);
    });
  });

  it("mensj values are unique", () => {
    const messages = msjsWishlist.map((m) => m.mensj);
    const unique = new Set(messages);

    expect(unique.size).toBe(messages.length);
  });
});