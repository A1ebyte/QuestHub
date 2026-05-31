import {
  SortBy,
  Direction,
  sortLabels,
  getLabelFromSort,
  DEFAULT_SORT_BY,
  DEFAULT_DIRECTION,
} from "../sort";

describe("Sort enums", () => {
  it("SortBy has expected values", () => {
    expect(SortBy.PRECIO).toBe("precioOferta");
    expect(SortBy.AHORRO).toBe("ahorro");
    expect(SortBy.RATING).toBe("ofertaRating");
    expect(SortBy.RECIENTE).toBe("recent");
    expect(SortBy.REVIEWS).toBe("reviews");
    expect(SortBy.TITULO).toBe("titulo");
  });

  it("Direction has expected values", () => {
    expect(Direction.ASC).toBe("asc");
    expect(Direction.DESC).toBe("desc");
  });
});

describe("sortLabels", () => {
  it("should not be empty", () => {
    expect(Object.keys(sortLabels).length).toBeGreaterThan(0);
  });

  it("each label has valid structure", () => {
    Object.entries(sortLabels).forEach(([label, cfg]) => {
      expect(typeof label).toBe("string");

      expect(cfg).toHaveProperty("order");
      expect(cfg).toHaveProperty("dir");

      expect(Object.values(SortBy)).toContain(cfg.order);
      expect(Object.values(Direction)).toContain(cfg.dir);
    });
  });

  it("contains expected labels", () => {
    expect(sortLabels["Tendencias"]).toBeDefined();
    expect(sortLabels["Top descuentos"]).toBeDefined();
    expect(sortLabels["Título: A-Z"]).toBeDefined();
    expect(sortLabels["Título: Z-A"]).toBeDefined();
  });
});

describe("getLabelFromSort", () => {
  it("returns correct label for known combinations", () => {
    expect(
      getLabelFromSort(SortBy.RATING, Direction.DESC)
    ).toBe("Tendencias");

    expect(
      getLabelFromSort(SortBy.AHORRO, Direction.DESC)
    ).toBe("Top descuentos");

    expect(
      getLabelFromSort(SortBy.TITULO, Direction.ASC)
    ).toBe("Título: A-Z");

    expect(
      getLabelFromSort(SortBy.TITULO, Direction.DESC)
    ).toBe("Título: Z-A");
  });

  it("returns null for invalid combination", () => {
    expect(
      getLabelFromSort(SortBy.PRECIO, Direction.ASC)
    ).not.toBeNull(); // válido

    expect(
      getLabelFromSort("invalid" as any, Direction.ASC)
    ).toBeNull();
  });
});

describe("defaults", () => {
  it("should have correct default sort values", () => {
    expect(DEFAULT_SORT_BY).toBe(SortBy.RATING);
    expect(DEFAULT_DIRECTION).toBe(Direction.DESC);
  });
});