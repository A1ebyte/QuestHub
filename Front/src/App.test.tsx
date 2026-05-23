import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

/**
 * 🔥 Mocks pesados (para no renderizar toda la app real)
 */
vi.mock("./assets/componentes/Header/Header", () => ({
  default: () => <div>HEADER</div>,
}));

vi.mock("./assets/componentes/Footer/Footer", () => ({
  default: () => <div>FOOTER</div>,
}));

vi.mock("./assets/paginas/Inicio/Inicio", () => ({
  default: () => <div>INICIO</div>,
}));

vi.mock("./assets/paginas/Ofertas/Ofertas", () => ({
  default: () => <div>OFERTAS</div>,
}));

vi.mock("./assets/paginas/Acerca/Acerca", () => ({
  default: () => <div>ACERCA</div>,
}));

vi.mock("./assets/paginas/Login/Login", () => ({
  default: () => <div>LOGIN</div>,
}));

vi.mock("./assets/paginas/Privacidad/Privacidad", () => ({
  default: () => <div>PRIVACIDAD</div>,
}));

vi.mock("./assets/paginas/Cuenta/Cuenta", () => ({
  default: () => <div>CUENTA</div>,
}));

vi.mock("./assets/paginas/WishList/WishList.jsx", () => ({
  default: () => <div>WISHLIST</div>,
}));

vi.mock("./assets/paginas/GameDetalles/GameDetalles", () => ({
  default: () => <div>GAME</div>,
}));

vi.mock("./assets/paginas/Error404/Error404", () => ({
  default: () => <div>404</div>,
}));

vi.mock("./assets/util/ProtectedRoute", () => ({
  default: ({ children }: any) => children,
}));

/**
 * Helper render con router
 */
const renderAt = (route: string) =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>
  );

describe("App routing", () => {
  it("renderiza layout global (Header + Footer) en rutas internas", () => {
    renderAt("/");

    expect(screen.getByText("HEADER")).toBeInTheDocument();
    expect(screen.getByText("FOOTER")).toBeInTheDocument();
    expect(screen.getByText("INICIO")).toBeInTheDocument();
  });

  it("renderiza login", () => {
    renderAt("/login");

    expect(screen.getByText("LOGIN")).toBeInTheDocument();
  });

  it("renderiza ofertas", () => {
    renderAt("/ofertas");

    expect(screen.getByText("OFERTAS")).toBeInTheDocument();
  });

  it("renderiza acerca", () => {
    renderAt("/acerca");

    expect(screen.getByText("ACERCA")).toBeInTheDocument();
  });

  it("renderiza privacidad", () => {
    renderAt("/privacidad");

    expect(screen.getByText("PRIVACIDAD")).toBeInTheDocument();
  });

  it("renderiza wishlist protegida (mocked)", () => {
    renderAt("/wishlist");

    expect(screen.getByText("WISHLIST")).toBeInTheDocument();
  });

  it("renderiza cuenta protegida (mocked)", () => {
    renderAt("/cuenta");

    expect(screen.getByText("CUENTA")).toBeInTheDocument();
  });

  it("renderiza game details con param", () => {
    renderAt("/juego/123");

    expect(screen.getByText("GAME")).toBeInTheDocument();
  });

  it("renderiza 404 en rutas inexistentes", () => {
    renderAt("/esto-no-existe");

    expect(screen.getByText("404")).toBeInTheDocument();
  });

  it("renderiza layout wrapper correctamente", () => {
    renderAt("/");

    expect(document.querySelector(".fondo")).toBeInTheDocument();
  });
});