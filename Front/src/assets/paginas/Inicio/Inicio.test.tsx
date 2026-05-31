import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
} from "vitest";

import {
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import { MemoryRouter } from "react-router-dom";

import Inicio from "./Inicio";
import ServicioOfertas from "../../servicios/Axios/ServicioOfertas";

/* ---------------- MOCKS ---------------- */

vi.mock(
  "../../servicios/Axios/ServicioOfertas",
  () => ({
    default: {
      getAll: vi.fn(),
    },
  }),
);

vi.mock(
  "../../componentes/OfertaLista/OfertasLista",
  () => ({
    default: ({
      ofertas,
      loaded,
    }: any) => (
      <div data-testid="ofertas-lista">
        {loaded
          ? ofertas.map(
              (
                o: any,
                i: number,
              ) => (
                <span key={i}>
                  {o.titulo}
                </span>
              ),
            )
          : "loading"}
      </div>
    ),
  }),
);

/* ---------------- TESTS ---------------- */

describe("Inicio", () => {
  const mockOferta = {
    id: 1,
    titulo: "Elden Ring",
    imagen:
      "https://image.com/game.jpg",
    precioOferta: 30,
    precioOriginal: 60,
    ahorro: 50,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(
      ServicioOfertas.getAll,
    ).mockResolvedValue({
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
      screen.getByText(
        /bienvenido a questhub/i,
      ),
    ).toBeInTheDocument();
  });

  it("debe renderizar las secciones", () => {
    render(
      <MemoryRouter>
        <Inicio />
      </MemoryRouter>,
    );

    expect(
      screen.getByText(
        /ofertas del momento/i,
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /ofertas con mayor ahorro/i,
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /ofertas más recientes/i,
      ),
    ).toBeInTheDocument();
  });

  it("debe llamar 3 veces al servicio", async () => {
    render(
      <MemoryRouter>
        <Inicio />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        ServicioOfertas.getAll,
      ).toHaveBeenCalledTimes(
        3,
      );
    });
  });

  it("debe mostrar las ofertas cuando cargan", async () => {
    render(
      <MemoryRouter>
        <Inicio />
      </MemoryRouter>,
    );

    expect(
      await screen.findAllByText(
        "Elden Ring",
      ),
    ).toHaveLength(3);
  });

  it("debe mostrar loading inicialmente", () => {
    render(
      <MemoryRouter>
        <Inicio />
      </MemoryRouter>,
    );

    expect(
      screen.getAllByText(
        "loading",
      ).length,
    ).toBeGreaterThan(0);
  });

  it("no debe romper si falla el servicio", async () => {
  vi.mocked(ServicioOfertas.getAll)
    .mockResolvedValue({
      data: {
        content: [],
      },
    } as any);

  render(
    <MemoryRouter>
      <Inicio />
    </MemoryRouter>,
  );

  await waitFor(() => {
    expect(
      screen.getByText(/bienvenido a questhub/i),
    ).toBeInTheDocument();
  });
});
});