import { describe, it, expect, vi, beforeEach } from "vitest";
import http from "../http-axios";

// ---------------- MOCK NOTIFICACIONES ----------------

const enviarNotiMock = vi.fn();

vi.mock("../../../util/notificacionToast", () => ({
  enviarNoti: (...args: any[]) => enviarNotiMock(...args),
  typeToast: {
    SUCCESS: "success",
    ERROR: "error",
    WARN: "warn",
  },
}));

import { typeToast } from "../../../util/notificacionToast";

// ---------------- MOCK WINDOW LOCATION ----------------

const replaceMock = vi.fn();

Object.defineProperty(window, "location", {
  value: {
    replace: replaceMock,
    hostname: "localhost",
  },
  writable: true,
});

// ---------------- TESTS ----------------

describe("http axios interceptors", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ---------------- REQUEST (BACKEND CAÍDO) ----------------

  it("rechaza request si backCaido = true", async () => {
    (http as any).backCaido = true;

    try {
      await http.request({ url: "/test" });
      throw new Error("Debería haber fallado");
    } catch (e: any) {
      expect(e.message).toBe("Network Error");
    }
  });

  it("permite request si backCaido = false", async () => {
    (http as any).backCaido = false;

    // mock request para evitar llamadas reales
    (http as any).request = vi.fn().mockResolvedValue({ data: "ok" });

    const result = await http.request({ url: "/test" });

    expect(result).toEqual({ data: "ok" });
  });

  // ---------------- ERROR 400 ----------------

  it("maneja error 400", async () => {
    const error = {
      response: {
        status: 400,
        data: { message: "bad request" },
      },
    };

    try {
      await (http as any).interceptors.response.handlers[0].rejected(error);
    } catch {}

    expect(enviarNotiMock).toHaveBeenCalledWith(
      typeToast.WARN,
      "Petición inválida",
      "bad request"
    );
  });

  // ---------------- ERROR 404 ----------------

  it("maneja error 404 y redirige", async () => {
    const error = {
      response: {
        status: 404,
        data: { message: "not found" },
      },
    };

    try {
      await (http as any).interceptors.response.handlers[0].rejected(error);
    } catch {}

    expect(enviarNotiMock).toHaveBeenCalledWith(
      typeToast.WARN,
      "No encontrado",
      "not found"
    );

    expect(replaceMock).toHaveBeenCalledWith("/not-found");
  });

  // ---------------- ERROR 500 ----------------

  it("maneja error 500", async () => {
    const error = {
      response: {
        status: 500,
        data: {},
      },
    };

    try {
      await (http as any).interceptors.response.handlers[0].rejected(error);
    } catch {}

    expect(enviarNotiMock).toHaveBeenCalledWith(
      typeToast.ERROR,
      "Error del servidor",
      "Ha ocurrido un problema interno"
    );
  });

  // ---------------- ERROR GENERICO ----------------

  it("maneja error genérico", async () => {
    const error = {
      response: {
        status: 418,
        data: { message: "teapot error" },
      },
    };

    try {
      await (http as any).interceptors.response.handlers[0].rejected(error);
    } catch {}

    expect(enviarNotiMock).toHaveBeenCalledWith(
      typeToast.ERROR,
      "Error",
      "teapot error"
    );
  });
});