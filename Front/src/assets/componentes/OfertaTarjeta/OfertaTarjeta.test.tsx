import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

import OfertaTarjeta from "./OfertaTarjeta";

vi.mock("../WishListBoton/WishListBoton", () => ({
  default: () => <div>WishListBoton</div>,
}));

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: any) => <div>{children}</div>,
  },
}));

vi.mock("../../const/tiers", () => ({
  getOfferTier: vi.fn(() => ({
    color: "green",
    text: "Amazing",
  })),
}));

const ofertaMock = {
  steamAppID: 123,
  titulo: "Zelda",
  urlImagen: "zelda.jpg",
  ahorro: 50,
  ofertaRating: 9,
  precioOferta: 19.99,
};

const renderComponent = (props = {}) => {
  return render(
    <MemoryRouter>
      <OfertaTarjeta oferta={ofertaMock} index={0} {...props} />
    </MemoryRouter>,
  );
};

describe("OfertaTarjeta", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders title", () => {
    renderComponent();

    expect(screen.getByText("Zelda")).toBeInTheDocument();
  });

  it("renders image", () => {
    renderComponent();

    expect(
      screen.getByRole("img", {
        name: "Zelda",
      }),
    ).toBeInTheDocument();
  });

  it("renders wishlist button when loaded=true", () => {
    renderComponent();

    expect(screen.getByText("WishListBoton")).toBeInTheDocument();
  });

  it("does not render wishlist button when loaded=false", () => {
    renderComponent({
      loaded: false,
    });

    expect(screen.queryByText("WishListBoton")).not.toBeInTheDocument();
  });

  it("renders loading text when loaded=false", () => {
    renderComponent({
      loaded: false,
    });

    expect(screen.getAllByText(/cargando/i)[0]).toBeInTheDocument();
  });

  it("renders discount percentage", () => {
    renderComponent();

    expect(screen.getByText("-50%")).toBeInTheDocument();
  });

  it("renders offer tier text", () => {
    renderComponent();

    expect(screen.getByText(/amazing deal/i)).toBeInTheDocument();
  });

  it("renders price correctly", () => {
    renderComponent();

    expect(screen.getByText("19.99 $")).toBeInTheDocument();
  });

  it("renders fallback price when precioOferta is null", () => {
    renderComponent({
      oferta: {
        ...ofertaMock,
        precioOferta: null,
      },
    });

    expect(screen.getByText("--")).toBeInTheDocument();
  });

  it("renders fallback image when urlImagen does not exist", () => {
    renderComponent({
      oferta: {
        ...ofertaMock,
        urlImagen: "",
      },
    });

    const img = screen.getByRole("img");

    expect(img).toHaveAttribute("src", "/Imagenes/Missing.jpg");
  });

  it("renders fallback title when titulo does not exist", () => {
    renderComponent({
      oferta: {
        ...ofertaMock,
        titulo: "",
      },
    });

    expect(screen.getByRole("img")).toHaveAttribute("alt", "Missing Img");
  });

  it("renders link correctly", () => {
    renderComponent();

    const link = screen.getByRole("link");

    expect(link).toHaveAttribute("href", "/juego/123");
  });

  it("renders link even when steamAppID does not exist", () => {
    renderComponent({
      oferta: {
        ...ofertaMock,
        steamAppID: null,
      },
    });

    expect(screen.getByRole("link")).toBeInTheDocument();
  });

  it("renders Error when ofertaRating does not exist", () => {
    renderComponent({
      oferta: {
        ...ofertaMock,
        ofertaRating: null,
      },
    });

    expect(screen.getByText("Error...")).toBeInTheDocument();
  });

  it("does not render discount when ahorro does not exist", () => {
    renderComponent({
      oferta: {
        ...ofertaMock,
        ahorro: null,
      },
    });

    expect(screen.queryByText(/%/)).not.toBeInTheDocument();
  });
});
