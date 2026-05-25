import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, beforeEach, describe, it, expect } from "vitest";
import WishListBoton from "./WishListBoton";

/* ---------------- MOCKS ---------------- */

const mockToggleJuego = vi.fn();
const mockEstaEnWishlist = vi.fn();

vi.mock("../../context/WishlistContext", () => ({
  useWishlistContext: () => ({
    toggleJuego: mockToggleJuego,
    estaEnWishlist: mockEstaEnWishlist,
  }),
}));

vi.mock("../../servicios/Axios/http-axios", () => ({
  backCaido: false,
}));

vi.mock("../../const/iconos", () => ({
  CORAZON: "♥",
}));

/* ---------------- DATA ---------------- */

const ofertaMock = {
  steamAppID: 123,
  titulo: "Cyberpunk 2077",
};

/* ---------------- HELPERS ---------------- */

const renderComponent = (props = {}) => {
  return render(
    <WishListBoton
      deseadoID={ofertaMock.steamAppID}
      {...props}
    />
  );
};

/* ---------------- TESTS ---------------- */

describe("WishListBoton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockEstaEnWishlist.mockReturnValue(false);
  });

  it("renderiza botón de wishlist (agregar)", () => {
    renderComponent();

    expect(
      screen.getByTitle(/agregar a wishlist/i)
    ).toBeInTheDocument();
  });

  it("muestra estado quitar si ya está en wishlist", () => {
    mockEstaEnWishlist.mockReturnValue(true);

    renderComponent();

    expect(
      screen.getByTitle(/quitar de wishlist/i)
    ).toBeInTheDocument();
  });

  it("llama toggleJuego con el ID correcto", async () => {
    const user = userEvent.setup();

    renderComponent();

    const button = screen.getByTitle(/agregar a wishlist/i);

    await user.click(button);

    expect(mockToggleJuego).toHaveBeenCalledTimes(1);

    expect(mockToggleJuego).toHaveBeenCalledWith(123);
  });

  it("no llama toggleJuego si no hay ID válido", async () => {
    const user = userEvent.setup();

    const consoleSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(
      <WishListBoton deseadoID={undefined as any} />
    );

    const button = screen.getByTitle(/agregar a wishlist/i);

    await user.click(button);

    expect(mockToggleJuego).not.toHaveBeenCalled();

    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it("llama estaEnWishlist con el ID correcto", () => {
    renderComponent();

    expect(mockEstaEnWishlist).toHaveBeenCalledWith(123);
  });

  it("muestra clase active si está en wishlist", () => {
    mockEstaEnWishlist.mockReturnValue(true);

    renderComponent();

    const icon = document.querySelector(".wishlist-icon");

    expect(icon?.className).toContain("active");
  });

  it("no rompe si backend está caído", () => {
    expect(() => renderComponent()).not.toThrow();
  });

  it("ejecuta onRemoveWishlist cuando el juego ya estaba en wishlist", async () => {
    const user = userEvent.setup();

    mockEstaEnWishlist.mockReturnValue(true);

    const onRemoveWishlist = vi.fn();

    renderComponent({
      onRemoveWishlist,
    });

    const button = screen.getByTitle(/quitar de wishlist/i);

    await user.click(button);

    expect(mockToggleJuego).toHaveBeenCalledWith(123);

    expect(onRemoveWishlist).toHaveBeenCalledTimes(1);
  });

  it("no ejecuta onRemoveWishlist si el juego no estaba en wishlist", async () => {
    const user = userEvent.setup();

    mockEstaEnWishlist.mockReturnValue(false);

    const onRemoveWishlist = vi.fn();

    renderComponent({
      onRemoveWishlist,
    });

    const button = screen.getByTitle(/agregar a wishlist/i);

    await user.click(button);

    expect(mockToggleJuego).toHaveBeenCalledWith(123);

    expect(onRemoveWishlist).not.toHaveBeenCalled();
  });

  it("maneja errores de toggleJuego correctamente", async () => {
    const user = userEvent.setup();

    const consoleSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    mockToggleJuego.mockRejectedValueOnce(
      new Error("Error de prueba")
    );

    renderComponent();

    const button = screen.getByTitle(/agregar a wishlist/i);

    await user.click(button);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });

  it("muestra estado processing mientras procesa", async () => {
    const user = userEvent.setup();

    mockToggleJuego.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(resolve, 100)
        )
    );

    renderComponent();

    const button = screen.getByTitle(/agregar a wishlist/i);

    await user.click(button);

    expect(
      document.querySelector(".processing")
    ).toBeInTheDocument();
  });

  it("evita múltiples clicks mientras procesa", async () => {
    const user = userEvent.setup();

    let resolver: any;

    mockToggleJuego.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolver = resolve;
        })
    );

    renderComponent();

    const button = screen.getByTitle(/agregar a wishlist/i);

    await user.click(button);
    await user.click(button);

    expect(mockToggleJuego).toHaveBeenCalledTimes(1);

    resolver();

    await waitFor(() => {
      expect(
        document.querySelector(".processing")
      ).not.toBeInTheDocument();
    });
  });
});