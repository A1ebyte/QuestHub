import { msjsSignUp, msjsLogin } from "../mensajesUsuarios";

describe("msjsSignUp", () => {
  it("should have valid structure", () => {
    expect(Array.isArray(msjsSignUp)).toBe(true);
    expect(msjsSignUp.length).toBeGreaterThan(0);
  });

  it("each signup item has title, mensj and img", () => {
    msjsSignUp.forEach((item) => {
      expect(item).toHaveProperty("title");
      expect(typeof item.title).toBe("string");

      expect(item).toHaveProperty("mensj");
      expect(typeof item.mensj).toBe("string");

      expect(item).toHaveProperty("img");
      expect(typeof item.img).toBe("string");
    });
  });

  it("images are non-empty strings", () => {
    msjsSignUp.forEach((item) => {
      expect(item.img.length).toBeGreaterThan(0);
    });
  });
});

describe("msjsLogin", () => {
  it("should have valid structure", () => {
    expect(Array.isArray(msjsLogin)).toBe(true);
    expect(msjsLogin.length).toBeGreaterThan(0);
  });

  it("each login item has title, mensj and img", () => {
    msjsLogin.forEach((item) => {
      expect(item).toHaveProperty("title");
      expect(typeof item.title).toBe("string");

      expect(item).toHaveProperty("mensj");
      expect(typeof item.mensj).toBe("string");

      expect(item).toHaveProperty("img");
      expect(typeof item.img).toBe("string");
    });
  });

  it("images are non-empty strings", () => {
    msjsLogin.forEach((item) => {
      expect(item.img.length).toBeGreaterThan(0);
    });
  });
});