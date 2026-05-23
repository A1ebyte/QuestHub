// GameDetalles.test.tsx

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
  fireEvent,
} from "@testing-library/react";

import { MemoryRouter } from "react-router-dom";

vi.mock(
  "../../servicios/Axios/ServicioOfertas",
  () => {
    return {
      default: {
        getOfertasBySteamId: vi.fn(),
      },
    };
  },
);

vi.mock(
  "../../componentes/Modals/Media/ModalMedia",
  () => ({
    default: ({
      activeIndex,
    }: {
      activeIndex: number | null;
    }) => (
      <div data-testid="modal-media">
        Modal {String(activeIndex)}
      </div>
    ),
  }),
);

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<any>(
    "react-router-dom",
  );

  return {
    ...actual,
    useParams: () => ({
      id: "123",
    }),
  };
});

import GameDetalles from "./GameDetalles";
import ServicioOfertas from "../../servicios/Axios/ServicioOfertas";

describe("GameDetalles", () => {
  const juegoMock = {
    nombre: "Elden Ring",

    imagen:
      "https://image.com/game.jpg",

    descripcionCorta:
      "Juego increíble",

    descripcion:
      "<p>Descripción completa del juego</p>",

    desarrolladores:
      "FromSoftware",

    distribuidores:
      "Bandai Namco",

    lanzamiento:
      "2022-01-01T00:00:00.000Z",

    generos: ["RPG", "Souls"],

    rating: 95,

    ratingText:
      "Muy positivas",

    capturas: [
      {
        thumb:
          "https://image.com/c1.jpg",
      },
      {
        thumb:
          "https://image.com/c2.jpg",
      },
    ],

    movies: [
      {
        thumb:
          "https://image.com/video.jpg",
      },
    ],

    ofertas: [
      {
        tienda: {
          nombre: "Steam",

          logo:
            "https://image.com/logo.png",
        },

        precioOriginal: 60,

        ahorro: 50,

        precioOferta: 30,

        urlCompra:
          "https://steam.com/game",
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();

    (
      ServicioOfertas.getOfertasBySteamId as any
    ).mockResolvedValue({
      data: {
        Juego: juegoMock,
      },
    });

    window.open = vi.fn();

    Object.defineProperty(
      HTMLElement.prototype,
      "scrollHeight",
      {
        configurable: true,
        value: 500,
      },
    );

    HTMLElement.prototype.scrollIntoView =
      vi.fn();
  });

  it("debe renderizar el nombre del juego", async () => {
  render(
    <MemoryRouter>
      <GameDetalles />
    </MemoryRouter>,
  );

  const titulos =
    await screen.findAllByText(
      "Elden Ring",
    );

  expect(
    titulos.length,
  ).toBeGreaterThan(0);

  expect(
    screen.getByRole("heading", {
      name: "Elden Ring",
    }),
  ).toBeInTheDocument();
});

  it("debe llamar al servicio con el id correcto", async () => {
    render(
      <MemoryRouter>
        <GameDetalles />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        ServicioOfertas.getOfertasBySteamId,
      ).toHaveBeenCalledWith(
        123,
      );
    });
  });

  it("debe renderizar la descripción corta", async () => {
    render(
      <MemoryRouter>
        <GameDetalles />
      </MemoryRouter>,
    );

    expect(
      await screen.findByText(
        "Juego increíble",
      ),
    ).toBeInTheDocument();
  });

  it("debe renderizar las ofertas", async () => {
    render(
      <MemoryRouter>
        <GameDetalles />
      </MemoryRouter>,
    );

    expect(
      await screen.findByText(
        "Steam",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "30.00$",
      ),
    ).toBeInTheDocument();
  });

  it("debe abrir la url de compra", async () => {
    render(
      <MemoryRouter>
        <GameDetalles />
      </MemoryRouter>,
    );

    const boton =
      await screen.findByRole(
        "button",
        {
          name:
            /ver oferta/i,
        },
      );

    fireEvent.click(boton);

    expect(
      window.open,
    ).toHaveBeenCalledWith(
      "https://steam.com/game",
      "_blank",
    );
  });

  it("debe alternar wishlist", async () => {
    render(
      <MemoryRouter>
        <GameDetalles />
      </MemoryRouter>,
    );

    const boton =
      await screen.findByRole(
        "button",
        {
          name:
            /agregar a wishlist/i,
        },
      );

    fireEvent.click(boton);

    expect(
      screen.getByRole(
        "button",
        {
          name:
            /quitar de wishlist/i,
        },
      ),
    ).toBeInTheDocument();
  });

  it("debe renderizar capturas", async () => {
    render(
      <MemoryRouter>
        <GameDetalles />
      </MemoryRouter>,
    );

    expect(
      await screen.findByAltText(
        "Gameplay 0",
      ),
    ).toBeInTheDocument();
  });

  it("debe abrir el modal al pulsar una captura", async () => {
    render(
      <MemoryRouter>
        <GameDetalles />
      </MemoryRouter>,
    );

    const captura =
      await screen.findByAltText(
        "Gameplay 0",
      );

    fireEvent.click(
      captura,
    );

    expect(
      screen.getByTestId(
        "modal-media",
      ),
    ).toHaveTextContent(
      "Modal 1",
    );
  });

  it("debe expandir la descripción", async () => {
    render(
      <MemoryRouter>
        <GameDetalles />
      </MemoryRouter>,
    );

    await screen.findByText(
      "Descripción",
    );

    const botonExpandir =
      document.querySelector(
        ".expand-circle-btn",
      ) as HTMLButtonElement;

    expect(
      botonExpandir,
    ).toBeInTheDocument();

    fireEvent.click(
      botonExpandir,
    );

    expect(
      document.querySelector(
        ".expanded",
      ),
    ).toBeInTheDocument();
  });

  it("debe mostrar mensaje si no hay ofertas", async () => {
    (
      ServicioOfertas.getOfertasBySteamId as any
    ).mockResolvedValueOnce({
      data: {
        Juego: {
          ...juegoMock,
          ofertas: [],
        },
      },
    });

    render(
      <MemoryRouter>
        <GameDetalles />
      </MemoryRouter>,
    );

    expect(
      await screen.findByText(
        /no hay ofertas/i,
      ),
    ).toBeInTheDocument();
  });

  it("debe hacer scroll a descripción", async () => {
    render(
      <MemoryRouter>
        <GameDetalles />
      </MemoryRouter>,
    );

    const boton =
      await screen.findByText(
        /leer más/i,
      );

    fireEvent.click(
      boton,
    );

    expect(
      HTMLElement.prototype
        .scrollIntoView,
    ).toHaveBeenCalled();
  });

  it("debe renderizar detalles del juego", async () => {
    render(
      <MemoryRouter>
        <GameDetalles />
      </MemoryRouter>,
    );

    expect(
      await screen.findByText(
        "FromSoftware",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Bandai Namco",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "RPG, Souls",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "95 / 100",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Muy positivas",
      ),
    ).toBeInTheDocument();
  });

  it("debe manejar errores del servicio", async () => {
    const errorSpy = vi
      .spyOn(
        console,
        "error",
      )
      .mockImplementation(
        () => {},
      );

    (
      ServicioOfertas.getOfertasBySteamId as any
    ).mockRejectedValueOnce(
      new Error(
        "Error backend",
      ),
    );

    render(
      <MemoryRouter>
        <GameDetalles />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        errorSpy,
      ).toHaveBeenCalled();
    });

    errorSpy.mockRestore();
  });
});