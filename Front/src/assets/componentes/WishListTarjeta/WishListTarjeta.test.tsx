import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

import WishListTarjeta from "./WishListTarjeta";

vi.mock("../WishListBoton/WishListBoton", () => ({
  default: () => (
    <div data-testid="wishlist-boton">
      WishlistBoton
    </div>
  ),
}));

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: any) => (
      <div>{children}</div>
    ),
  },
}));

const ofertaMock = {
  steamAppID: "123",
  titulo: "Cyberpunk 2077",
  urlImagen: "https://test.com/image.jpg",
  onSale: true,
};

const renderComponent = (
  props = {}
) => {
  return render(
    <MemoryRouter>
      <WishListTarjeta
        oferta={ofertaMock}
        index={0}
        {...props}
      />
    </MemoryRouter>
  );
};

describe("WishListTarjeta", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders game title", () => {
    renderComponent();

    expect(
      screen.getByText("Cyberpunk 2077")
    ).toBeInTheDocument();
  });

  it("renders image with correct src", () => {
    renderComponent();

    const image =
      screen.getByRole("img");

    expect(image).toHaveAttribute(
      "src",
      ofertaMock.urlImagen
    );
  });

  it("renders wishlist button when loaded", () => {
    renderComponent();

    expect(
      screen.getByTestId(
        "wishlist-boton"
      )
    ).toBeInTheDocument();
  });

  it("does not render wishlist button when loaded is false", () => {
    renderComponent({
      loaded: false,
    });

    expect(
      screen.queryByTestId(
        "wishlist-boton"
      )
    ).not.toBeInTheDocument();
  });

  it("renders loading text when loaded is false", () => {
    renderComponent({
      loaded: false,
    });

    expect(
      screen.getAllByText(
        /cargando/i
      ).length
    ).toBeGreaterThan(0);
  });

  it("renders fallback image when urlImagen does not exist", () => {
    renderComponent({
      oferta: {
        ...ofertaMock,
        urlImagen: "",
      },
    });

    const image =
      screen.getByRole("img");

    expect(image).toHaveAttribute(
      "src",
      "/Imagenes/Missing.jpg"
    );
  });

  it("renders fallback title when titulo does not exist", () => {
    renderComponent({
      oferta: {
        ...ofertaMock,
        titulo: "",
      },
    });

    expect(
      screen.getByText("Error...")
    ).toBeInTheDocument();
  });

  it("renders deal ON text when onSale is true", () => {
    renderComponent();

    expect(
      screen.getByText(/deal on/i)
    ).toBeInTheDocument();
  });

  it("renders deal OFF text when onSale is false", () => {
    renderComponent({
      oferta: {
        ...ofertaMock,
        onSale: false,
      },
    });

    expect(
      screen.getByText(/deal off/i)
    ).toBeInTheDocument();
  });

  it("renders Error when onSale is null", () => {
    renderComponent({
      oferta: {
        ...ofertaMock,
        onSale: null,
      },
    });

    expect(
      screen.getByText("Error...")
    ).toBeInTheDocument();
  });

  it("renders correct game link", () => {
    renderComponent();

    const link =
      screen.getByRole("link");

    expect(link).toHaveAttribute(
      "href",
      "/juego/123"
    );
  });

it('renders link even when steamAppID does not exist', () => {
  renderComponent({
    oferta: {
      ...ofertaMock,
      steamAppID: null,
    },
  })

  expect(
    screen.getByRole('link')
  ).toBeInTheDocument()
})

  it("renders skeleton when loaded is false", () => {
    const { container } =
      renderComponent({
        loaded: false,
      });

    expect(
      container.querySelector(
        ".img-skeleton"
      )
    ).toBeInTheDocument();
  });

  it("adds hidden class to image when loaded is false", () => {
    renderComponent({
      loaded: false,
    });

    const image =
      screen.getByRole("img");

    expect(image).toHaveClass(
      "hidden"
    );
  });

  it("renders active sale indicator color", () => {
    const { container } =
      renderComponent();

    const dot =
      container.querySelector(
        ".offer-tier-dot"
      );

    expect(dot).toHaveStyle({
      backgroundColor:
        "#38f157",
    });
  });

  it("renders inactive sale indicator color", () => {
    const { container } =
      renderComponent({
        oferta: {
          ...ofertaMock,
          onSale: false,
        },
      });

    const dot =
      container.querySelector(
        ".offer-tier-dot"
      );

    expect(dot).toHaveStyle({
      backgroundColor:
        "#e63946",
    });
  });
});