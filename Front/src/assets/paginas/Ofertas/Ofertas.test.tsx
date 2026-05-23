import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import Ofertas from "./Ofertas";

/* ---------------- MOCKS ---------------- */

const mocks = vi.hoisted(() => ({
  mockGetAll: vi.fn(),
  mockGetMaxPrecioOferta: vi.fn(),
  mockGetAllTiendas: vi.fn(),
}));

vi.mock("../../servicios/Axios/ServicioOfertas", () => ({
  default: {
    getAll: mocks.mockGetAll,
    getMaxPrecioOferta:
      mocks.mockGetMaxPrecioOferta,
  },
}));

vi.mock("../../servicios/Axios/ServicioTienda", () => ({
  default: {
    getAllTiendas:
      mocks.mockGetAllTiendas,
  },
}));

vi.mock(
  "../../componentes/OfertaLista/OfertasLista",
  () => ({
    default: ({
      ofertas,
      loaded,
    }: any) => (
      <div data-testid="ofertas-lista">
        {loaded ? "loaded" : "loading"} -
        {ofertas.length} ofertas
      </div>
    ),
  }),
);

vi.mock(
  "../../componentes/PanelFiltros/PanelFiltros",
  () => ({
    default: ({
      setFiltros,
      onClose,
    }: any) => (
      <div data-testid="panel-filtros">
        <button
          onClick={() =>
            setFiltros({
              titulo: "elden",
            })
          }
        >
          Aplicar filtro
        </button>

        <button onClick={onClose}>
          Cerrar
        </button>
      </div>
    ),
  }),
);

vi.mock(
  "../../componentes/Paginator/Paginator",
  () => ({
    default: ({
      currentPage,
      onPageChange,
    }: any) => (
      <div data-testid="paginator">
        <span>Pagina {currentPage}</span>

        <button
          onClick={() =>
            onPageChange(2)
          }
        >
          Cambiar pagina
        </button>
      </div>
    ),
  }),
);

vi.mock("../../const/iconos", () => ({
  FILTER: <span>ICON</span>,
}));

vi.mock(
  "../../const/mensajesOfertas",
  () => ({
    msjsOfertas: [
      {
        title: "Ofertas épicas",
        mensj:
          "ofertas disponibles",
      },
    ],
  }),
);

vi.mock(
  "../../servicios/Axios/http-axios",
  () => ({
    backCaido: false,
  }),
);

/* ---------------- TESTS ---------------- */

describe("Ofertas", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.mockGetAll.mockResolvedValue({
      data: {
        content: [
          {
            id: 1,
            titulo: "Cyberpunk",
          },
          {
            id: 2,
            titulo: "Elden Ring",
          },
        ],
        totalPages: 5,
        totalElements: 20,
      },
    });

    mocks.mockGetMaxPrecioOferta.mockResolvedValue(
      {
        data: 999,
      },
    );

    mocks.mockGetAllTiendas.mockResolvedValue(
      {
        data: [
          {
            id: 1,
            nombre: "Steam",
          },
        ],
      },
    );
  });

  it("renderiza correctamente", async () => {
    render(
      <MemoryRouter>
        <Ofertas />
      </MemoryRouter>,
    );

    expect(
      screen.getByText(
        /cargando ofertas/i,
      ),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText(
          /ofertas épicas/i,
        ),
      ).toBeInTheDocument();
    });

expect(
  screen.getByText(/20/i, {
    selector: "span",
  }),
).toBeInTheDocument();

expect(
  screen.getByText(/ofertas disponibles/i),
).toBeInTheDocument();

    expect(
      screen.getByTestId(
        "ofertas-lista",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByTestId(
        "paginator",
      ),
    ).toBeInTheDocument();
  });

  it("llama servicios al cargar", async () => {
    render(
      <MemoryRouter>
        <Ofertas />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        mocks.mockGetAll,
      ).toHaveBeenCalledWith({
        page: 0,
        filtros: {
          titulo: undefined,
          minPrecio: undefined,
          maxPrecio: undefined,
          minAhorro: undefined,
          tiers: [],
          reviews: [],
          tiendaIds: [],
        },
        sortBy: expect.any(String),
        direction: expect.any(String),
      });

      expect(
        mocks.mockGetAllTiendas,
      ).toHaveBeenCalled();

      expect(
        mocks.mockGetMaxPrecioOferta,
      ).toHaveBeenCalled();
    });
  });

  it("abre y cierra panel filtros", async () => {
    render(
      <MemoryRouter>
        <Ofertas />
      </MemoryRouter>,
    );

    const botonFiltros =
      screen.getByRole("button", {
        name: /filtros/i,
      });

    fireEvent.click(botonFiltros);

    expect(
      await screen.findByTestId(
        "panel-filtros",
      ),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: /cerrar/i,
      }),
    );

    await waitFor(() => {
      expect(
        screen.queryByTestId(
          "panel-filtros",
        ),
      ).not.toBeInTheDocument();
    });
  });

  it("abre dropdown de ordenamiento", async () => {
    render(
      <MemoryRouter>
        <Ofertas />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          /ofertas épicas/i,
        ),
      ).toBeInTheDocument();
    });

    const botonSort =
      document.querySelector(
        ".dropdown-trigger",
      );

    expect(
      botonSort,
    ).toBeInTheDocument();

    fireEvent.click(botonSort!);

    await waitFor(() => {
      expect(
        document.querySelector(
          ".dropdown-menu",
        ),
      ).toBeInTheDocument();
    });
  });

  it("cambia ordenamiento", async () => {
    render(
      <MemoryRouter>
        <Ofertas />
      </MemoryRouter>,
    );

    const botonSort =
      document.querySelector(
        ".dropdown-trigger",
      );

    fireEvent.click(botonSort!);

    await waitFor(() => {
      expect(
        document.querySelectorAll(
          ".dropdown-menu li",
        ).length,
      ).toBeGreaterThan(0);
    });

    const opcion =
      document.querySelector(
        ".dropdown-menu li",
      );

    fireEvent.click(opcion!);

    await waitFor(() => {
      expect(
        mocks.mockGetAll,
      ).toHaveBeenCalledTimes(2);
    });
  });

  it("aplica filtros", async () => {
    render(
      <MemoryRouter>
        <Ofertas />
      </MemoryRouter>,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /filtros/i,
      }),
    );

    fireEvent.click(
      await screen.findByRole(
        "button",
        {
          name:
            /aplicar filtro/i,
        },
      ),
    );

    await waitFor(() => {
      expect(
        mocks.mockGetAll,
      ).toHaveBeenCalledTimes(2);
    });
  });

  it("cambia pagina", async () => {
    render(
      <MemoryRouter>
        <Ofertas />
      </MemoryRouter>,
    );

    fireEvent.click(
      await screen.findByRole(
        "button",
        {
          name:
            /cambiar pagina/i,
        },
      ),
    );

    await waitFor(() => {
      expect(
        mocks.mockGetAll,
      ).toHaveBeenCalledTimes(2);
    });
  });

  it("muestra boton limpiar filtros cuando hay filtros", async () => {
    render(
      <MemoryRouter
        initialEntries={[
          "/?titulo=elden",
        ]}
      >
        <Ofertas />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        screen.getByRole(
          "button",
          {
            name: /✕/i,
          },
        ),
      ).toBeInTheDocument();
    });
  });

  it("renderiza skeletons mientras carga", () => {
    mocks.mockGetAll.mockImplementation(
      () =>
        new Promise(() => {}),
    );

    render(
      <MemoryRouter>
        <Ofertas />
      </MemoryRouter>,
    );

    expect(
      screen.getByTestId(
        "ofertas-lista",
      ),
    ).toHaveTextContent(
      "loading -24 ofertas",
    );
  });
});