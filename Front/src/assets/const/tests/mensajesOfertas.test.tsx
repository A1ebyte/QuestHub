import { msjsOfertas } from "../mensajesOfertas";

describe("msjsOfertas", () => {
  it("should have correct structure", () => {
    expect(Array.isArray(msjsOfertas)).toBe(true);
    expect(msjsOfertas.length).toBeGreaterThan(0);
  });

  it("each item has title and mensj", () => {
    msjsOfertas.forEach((item) => {
      expect(item).toHaveProperty("title");
      expect(typeof item.title).toBe("string");

      expect(item).toHaveProperty("mensj");
      expect(typeof item.mensj).toBe("string");
    });
  });
});