import { REVIEWS } from "../reviews";

describe("REVIEWS", () => {
  it("should be a non-empty array", () => {
    expect(Array.isArray(REVIEWS)).toBe(true);
    expect(REVIEWS.length).toBeGreaterThan(0);
  });

  it("each review has id and text with correct types", () => {
    REVIEWS.forEach((review) => {
      expect(review).toHaveProperty("id");
      expect(typeof review.id).toBe("string");
      expect(review.id.length).toBeGreaterThan(0);

      expect(review).toHaveProperty("text");
      expect(typeof review.text).toBe("string");
      expect(review.text.length).toBeGreaterThan(0);
    });
  });

  it("ids are unique", () => {
    const ids = REVIEWS.map((r) => r.id);
    const uniqueIds = new Set(ids);

    expect(uniqueIds.size).toBe(ids.length);
  });

  it("must include NO_REVIEWS option", () => {
    const hasNoReviews = REVIEWS.some(
      (r) => r.id === "NO_REVIEWS"
    );

    expect(hasNoReviews).toBe(true);
  });
});