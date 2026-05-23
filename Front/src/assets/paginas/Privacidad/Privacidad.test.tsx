import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import Privacidad from "./Privacidad";

describe("Privacidad", () => {
  it("renderiza correctamente la política de privacidad", () => {
    render(
      <MemoryRouter>
        <Privacidad />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", {
        name: /política de privacidad/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /esta política explica qué datos recopilamos/i,
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: /información que recopilamos/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: /finalidad del tratamiento de datos/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: /seguridad y almacenamiento/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: /compartición de datos/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: /derechos del usuario/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: /cambios en esta política/i,
      }),
    ).toBeInTheDocument();
  });

  it("renderiza enlaces correctamente", () => {
    render(
      <MemoryRouter>
        <Privacidad />
      </MemoryRouter>,
    );

    const links = screen.getAllByRole("link");

    expect(links).toHaveLength(2);

    expect(
      screen.getByRole("link", {
        name: /contacto/i,
      }),
    ).toHaveAttribute("href", "/contacto");

    expect(
      screen.getByRole("link", {
        name: /contactarnos/i,
      }),
    ).toHaveAttribute("href", "/acerca");
  });

  it("renderiza listas de privacidad", () => {
    render(
      <MemoryRouter>
        <Privacidad />
      </MemoryRouter>,
    );

    const items = screen.getAllByRole("listitem");

    expect(items.length).toBeGreaterThan(0);

    expect(
      screen.getByText(
        /mantener tu cuenta y tus listas personalizadas/i,
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /no vendemos tus datos personales/i,
      ),
    ).toBeInTheDocument();
  });
});