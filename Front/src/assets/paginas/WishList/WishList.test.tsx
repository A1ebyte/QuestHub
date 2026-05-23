import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import WishList from "./WishList";

/* ---------------- MOCKS ---------------- */

const mockCargarDatos = vi.fn();

vi.mock("../../context/WishlistContext", () => ({
  useWishlistContext: () => ({
    wishlist: [
      {
        id: 1,
        nombre: "Cyberpunk 2077",
        imagen: "cyberpunk.jpg",
        onSale: true,
      },
      {
        id: 2,
        nombre: "Elden Ring",
        imagen: "eldenring.jpg",
        onSale: false,
      },
    ],
    cargarDatos: mockCargarDatos,
  }),
}));

vi.mock("../../componentes/OfertaLista/OfertasLista", () => ({
  default: ({ ofertas }: any) => (
    <div data-testid="ofertas-lista">
      {ofertas.length} ofertas
    </div>
  ),
}));

vi.mock("../../const/mensajesWishlist", () => ({
  msjsWishlist: [
    {
      mensj: "juegos guardados",
    },
  ],
}));

vi.mock("../../util/notificacionToast", () => ({
  enviarNoti: vi.fn(),
  typeToast: {
    WARN: "WARN",
  },
}));

vi.mock("../../servicios/Axios/http-axios", () => ({
  backCaido: false,
}));

/* ---------------- TESTS ---------------- */

describe("WishList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza correctamente la wishlist", async () => {
    render(<WishList />);

    expect(
      screen.getByRole("heading", {
        name: /mi wishlist/i,
      }),
    ).toBeInTheDocument();

    expect(
      await screen.findByText(
        (_, element) =>
          element?.classList.contains("mensaje-pagina") &&
          element.textContent?.includes("2 juegos guardados"),
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByTestId("ofertas-lista"),
    ).toBeInTheDocument();
  });

  it("filtra juegos al buscar", async () => {
    render(<WishList />);

    const input = screen.getByPlaceholderText(
      /buscar en mi wishlist/i,
    );

    fireEvent.change(input, {
      target: {
        value: "Cyber",
      },
    });

    await waitFor(() => {
      expect(
        screen.getByText(/cyberpunk 2077/i),
      ).toBeInTheDocument();
    });
  });

  it("muestra mensaje cuando no hay resultados", async () => {
    render(<WishList />);

    const input = screen.getByPlaceholderText(
      /buscar en mi wishlist/i,
    );

    fireEvent.change(input, {
      target: {
        value: "zzz",
      },
    });

    fireEvent.submit(input.closest("form")!);

    await waitFor(() => {
      expect(
        screen.getByText(
          /no se encontraron resultados para "zzz"/i,
        ),
      ).toBeInTheDocument();
    });
  });

  it("limpia el filtro correctamente", async () => {
    render(<WishList />);

    const input = screen.getByPlaceholderText(
      /buscar en mi wishlist/i,
    );

    fireEvent.change(input, {
      target: {
        value: "Cyber",
      },
    });

    const clearButton = await screen.findByRole("button", {
      name: /✕/i,
    });

    fireEvent.click(clearButton);

    expect(input).toHaveValue("");
  });

  it("muestra mensaje si la búsqueda tiene menos de 3 caracteres", async () => {
    const { enviarNoti } = await import(
      "../../util/notificacionToast"
    );

    render(<WishList />);

    const input = screen.getByPlaceholderText(
      /buscar en mi wishlist/i,
    );

    fireEvent.change(input, {
      target: {
        value: "ab",
      },
    });

    fireEvent.submit(input.closest("form")!);

    await waitFor(() => {
      expect(enviarNoti).toHaveBeenCalled();
    });
  });
});