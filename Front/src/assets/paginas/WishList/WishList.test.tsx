import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WishList from "./WishList";

/* ---------------- MOCKS ---------------- */

vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({
    session: { access_token: "token" },
    isSynced: true,
  }),
}));

const mockObtenerFavoritos = vi.fn();

vi.mock("../../servicios/Axios/ServicioWishlist", () => ({
  WishlistService: {
    obtenerFavoritos: (...args: any[]) =>
      mockObtenerFavoritos(...args),
  },
}));

vi.mock("../../componentes/OfertaLista/OfertasLista", () => ({
  default: ({ ofertas }: any) => (
    <div data-testid="ofertas-lista">
      {ofertas.length} items
    </div>
  ),
}));

vi.mock("../../componentes/Paginator/Paginator", () => ({
  default: () => <div data-testid="paginator" />,
}));

vi.mock("../../const/mensajesWishlist", () => ({
  msjsWishlist: [
    { title: "Archivo de Deseos", mensj: "juegos guardados" },
  ],
}));

vi.mock("../../servicios/Axios/http-axios", () => ({
  backCaido: false,
}));

/* ---------------- SETUP ---------------- */

beforeEach(() => {
  vi.clearAllMocks();

  mockObtenerFavoritos.mockResolvedValue({
    content: [
      { id: 1, nombre: "Cyberpunk", imagen: "img", onSale: true },
      { id: 2, nombre: "Elden Ring", imagen: "img2", onSale: false },
    ],
    totalPages: 1,
    totalElements: 2,
  });
});

/* ---------------- TESTS ---------------- */

describe("WishList", () => {
  it("renderiza header y datos base", async () => {
    render(<WishList />);

    // mejor matcher: por texto parcial seguro
    expect(
      await screen.findByText((content) =>
        content.includes("Archivo de Deseos"),
      ),
    ).toBeInTheDocument();

    expect(
      await screen.findByText((content) =>
        content.includes("juegos guardados"),
      ),
    ).toBeInTheDocument();
  });

  it("llama al servicio", async () => {
    render(<WishList />);

    await waitFor(() => {
      expect(mockObtenerFavoritos).toHaveBeenCalled();
    });
  });

  it("renderiza lista de ofertas", async () => {
    render(<WishList />);

    expect(
      await screen.findByTestId("ofertas-lista"),
    ).toBeInTheDocument();

    expect(
      await screen.findByText((content) =>
        content.includes("items"),
      ),
    ).toBeInTheDocument();
  });

  it("muestra input de búsqueda", () => {
    render(<WishList />);

    expect(
      screen.getByPlaceholderText(/buscar en mi wishlist/i),
    ).toBeInTheDocument();
  });

  it("permite escribir en búsqueda", async () => {
    const user = userEvent.setup();

    render(<WishList />);

    const input = screen.getByPlaceholderText(
      /buscar en mi wishlist/i,
    );

    await user.type(input, "cyber");

    expect(input).toHaveValue("cyber");
  });
});