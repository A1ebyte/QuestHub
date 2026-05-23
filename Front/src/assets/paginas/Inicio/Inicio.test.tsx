import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Inicio from "./Inicio";
import ServicioOfertas from "../../servicios/Axios/ServicioOfertas";

// mock del servicio
vi.mock("../../servicios/Axios/ServicioOfertas", () => ({
  default: {
    getAll: vi.fn(),
  },
}));

// mock de OfertasLista para simplificar el test
vi.mock("../../componentes/OfertaLista/OfertasLista", () => ({
  default: ({ ofertas, loaded }: any) => (
    <div data-testid="ofertas-lista">
      {loaded
        ? ofertas.map((o: any, i: number) => (
            <span key={i}>{o.titulo}</span>
          ))
        : "loading"}
    </div>
  ),
}));

describe("Inicio", () => {
  const mockOferta = {
    id: 1,
    titulo: "Elden Ring",
    imagen: "https://image.com/game.jpg",
    precioOferta: 30,
    precioOriginal: 60,
    ahorro: 50,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(ServicioOfertas.getAll).mockResolvedValue({
      data: {
        content: [mockOferta],
      },
    } as any);
  });

  it("debe renderizar el título principal", () => {
    render(
      <MemoryRouter>
        <Inicio />
      </MemoryRouter>,
    );

    expect(
      screen.getByText(/bienvenido a quest-hub/i),
    ).toBeInTheDocument();
  });

  it("debe renderizar las secciones", () => {
    render(
      <MemoryRouter>
        <Inicio />
      </MemoryRouter>,
    );

    expect(
      screen.getByText(/ofertas del momento/i),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/ofertas con mayor ahorro/i),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/ofertas más recientes/i),
    ).toBeInTheDocument();
  });

  it("debe llamar 3 veces al servicio", async () => {
    render(
      <MemoryRouter>
        <Inicio />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(ServicioOfertas.getAll).toHaveBeenCalledTimes(3);
    });
  });

  it("debe mostrar las ofertas cuando cargan", async () => {
    render(
      <MemoryRouter>
        <Inicio />
      </MemoryRouter>,
    );

    expect(
      await screen.findAllByText("Elden Ring"),
    ).toHaveLength(3);
  });

  it("debe mostrar loading inicialmente", () => {
    render(
      <MemoryRouter>
        <Inicio />
      </MemoryRouter>,
    );

    expect(
      screen.getAllByText("loading").length,
    ).toBeGreaterThan(0);
  });

it("no debe romper si falla el servicio", async () => {
  const spy = vi
    .spyOn(ServicioOfertas, "getAll")
    .mockImplementation(() =>
      Promise.reject(new Error("Error")).catch(() => ({
        data: {
          content: [],
          totalElements: 0,
          totalPages: 0,
          size: 0,
          number: 0,
        },
      })),
    );

  render(
    <MemoryRouter>
      <Inicio />
    </MemoryRouter>,
  );

  expect(
    await screen.findByText(/bienvenido a quest-hub/i),
  ).toBeInTheDocument();

  spy.mockRestore();
});
});