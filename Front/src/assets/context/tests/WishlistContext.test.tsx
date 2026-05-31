import React from "react";
import {
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  describe,
 it,
  expect,
  vi,
  beforeEach,
} from "vitest";

/* ---------------- HOISTED MOCKS ---------------- */

const {
  mockObtenerIdsFavoritos,
  mockToggle,
  mockEnviarNoti,
  mockUseAuth,
} = vi.hoisted(() => {
  return {
    mockObtenerIdsFavoritos: vi.fn(),
    mockToggle: vi.fn(),
    mockEnviarNoti: vi.fn(),
    mockUseAuth: vi.fn(),
  };
});

/* ---------------- MOCKS ---------------- */

vi.mock("../AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock("../../servicios/Axios/ServicioWishlist", () => ({
  WishlistService: {
    obtenerIdsFavoritos:
      mockObtenerIdsFavoritos,
    toggle: mockToggle,
  },
}));

vi.mock("../../util/notificacionToast", () => ({
  enviarNoti: mockEnviarNoti,
  typeToast: {
    INFO: "INFO",
    ERROR: "ERROR",
  },
}));

vi.mock("../../const/iconos", () => ({
  toastICONS: {
    ARCADE: "ARCADE",
  },
}));

import {
  WishlistProvider,
  useWishlistContext,
} from "../WishlistContext";

/* ---------------- TEST COMPONENT ---------------- */

const TestComponent = () => {
  const {
    wishlist,
    toggleJuego,
    estaEnWishlist,
    cargarDatos,
  } = useWishlistContext();

  return (
    <div>
      <div data-testid="wishlist">
        {wishlist.join(",")}
      </div>

      <div data-testid="exists-1">
        {estaEnWishlist(1).toString()}
      </div>

      <div data-testid="exists-999">
        {estaEnWishlist(999).toString()}
      </div>

      <button
        onClick={() => toggleJuego(1)}
      >
        toggle-1
      </button>

      <button
        onClick={() => toggleJuego(999)}
      >
        toggle-999
      </button>

      <button
        onClick={() => cargarDatos()}
      >
        cargar
      </button>
    </div>
  );
};

/* ---------------- HELPERS ---------------- */

const renderProvider = () => {
  return render(
    <WishlistProvider>
      <TestComponent />
    </WishlistProvider>
  );
};

/* ---------------- TESTS ---------------- */

describe("WishlistContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseAuth.mockReturnValue({
      session: {
        access_token: "token-123",
      },
      loading: false,
      isSynced: true,
    });

    mockObtenerIdsFavoritos.mockResolvedValue([
      1,
      2,
      3,
    ]);

    mockToggle.mockResolvedValue({});
  });

  it("carga favoritos al iniciar", async () => {
    renderProvider();

    await waitFor(() => {
      expect(
        mockObtenerIdsFavoritos
      ).toHaveBeenCalledWith("token-123");
    });

    expect(
      screen.getByTestId("wishlist")
    ).toHaveTextContent("1,2,3");
  });

  it("verifica si un juego está en wishlist", async () => {
    renderProvider();

    await waitFor(() => {
      expect(
        screen.getByTestId("exists-1")
      ).toHaveTextContent("true");
    });

    expect(
      screen.getByTestId("exists-999")
    ).toHaveTextContent("false");
  });

  it("agrega un juego a wishlist", async () => {
    const user = userEvent.setup();

    renderProvider();

    await waitFor(() => {
      expect(
        screen.getByTestId("wishlist")
      ).toHaveTextContent("1,2,3");
    });

    await user.click(
      screen.getByText("toggle-999")
    );

    expect(mockToggle).toHaveBeenCalledWith(
      999,
      "token-123"
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("wishlist")
      ).toHaveTextContent("1,2,3,999");
    });
  });

  it("elimina un juego de wishlist", async () => {
    const user = userEvent.setup();

    renderProvider();

    await waitFor(() => {
      expect(
        screen.getByTestId("wishlist")
      ).toHaveTextContent("1,2,3");
    });

    await user.click(
      screen.getByText("toggle-1")
    );

    expect(mockToggle).toHaveBeenCalledWith(
      1,
      "token-123"
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("wishlist")
      ).toHaveTextContent("2,3");
    });
  });

  it("revierte cambios si toggle falla", async () => {
    const user = userEvent.setup();

    mockToggle.mockRejectedValueOnce(
      new Error("backend error")
    );

    const consoleSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    renderProvider();

    await waitFor(() => {
      expect(
        screen.getByTestId("wishlist")
      ).toHaveTextContent("1,2,3");
    });

    await user.click(
      screen.getByText("toggle-1")
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("wishlist")
      ).toHaveTextContent("1,2,3");
    });

    expect(mockEnviarNoti).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it("muestra notificación si no hay sesión", async () => {
    const user = userEvent.setup();

    mockUseAuth.mockReturnValue({
      session: null,
      loading: false,
      isSynced: true,
    });

    renderProvider();

    await user.click(
      screen.getByText("toggle-1")
    );

    expect(mockEnviarNoti).toHaveBeenCalledWith(
      "INFO",
      "Inicia Sesion",
      "Para poder usar tu Wishlist",
      "ARCADE"
    );

    expect(mockToggle).not.toHaveBeenCalled();
  });

  it("ejecuta cargarDatos manualmente", async () => {
    const user = userEvent.setup();

    renderProvider();

    await user.click(
      screen.getByText("cargar")
    );

    expect(
      mockObtenerIdsFavoritos
    ).toHaveBeenCalledTimes(2);
  });

  it("maneja errores al cargar datos", async () => {
    const consoleSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    mockObtenerIdsFavoritos.mockRejectedValueOnce(
      new Error("error carga")
    );

    renderProvider();

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });

  it("limpia wishlist cuando no hay sesión", async () => {
    mockUseAuth.mockReturnValue({
      session: null,
      loading: false,
      isSynced: true,
    });

    renderProvider();

    expect(
      screen.getByTestId("wishlist")
    ).toHaveTextContent("");
  });

  it("no carga datos si loading es true", () => {
    mockUseAuth.mockReturnValue({
      session: {
        access_token: "token-123",
      },
      loading: true,
      isSynced: true,
    });

    renderProvider();

    expect(
      mockObtenerIdsFavoritos
    ).not.toHaveBeenCalled();
  });

  it("no carga datos si isSynced es false", () => {
    mockUseAuth.mockReturnValue({
      session: {
        access_token: "token-123",
      },
      loading: false,
      isSynced: false,
    });

    renderProvider();

    expect(
      mockObtenerIdsFavoritos
    ).not.toHaveBeenCalled();
  });

  it("lanza error si useWishlistContext se usa fuera del provider", () => {
    const consoleSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const BrokenComponent = () => {
      useWishlistContext();
      return null;
    };

    expect(() =>
      render(<BrokenComponent />)
    ).toThrow(
      /usewishlistcontext debe usarse dentro de wishlistprovider/i
    );

    consoleSpy.mockRestore();
  });
});