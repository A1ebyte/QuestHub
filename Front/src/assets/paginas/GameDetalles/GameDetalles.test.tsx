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

import userEvent from "@testing-library/user-event";

import { MemoryRouter } from "react-router-dom";

/* ---------------- MOCKS ---------------- */

const mockToggleJuego = vi.fn();

let enWishlistState = false;
let backCaidoState = false;

vi.mock(
  "../../servicios/Axios/ServicioOfertas",
  () => ({
    default: {
      getOfertasBySteamId: vi.fn(),
    },
  }),
);

vi.mock(
  "../../servicios/Axios/http-axios",
  () => ({
    get backCaido() {
      return backCaidoState;
    },
  }),
);

vi.mock(
  "../../const/iconos",
  () => ({
    CORAZON: <span>♥</span>,
  }),
);

vi.mock(
  "../../context/WishlistContext",
  () => ({
    useWishlistContext: () => ({
      toggleJuego: mockToggleJuego,
      estaEnWishlist: () => enWishlistState,
    }),
  }),
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

/* ---------------- IMPORTS ---------------- */

import GameDetalles from "./GameDetalles";

import ServicioOfertas from "../../servicios/Axios/ServicioOfertas";

/* ---------------- TEST DATA ---------------- */

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

  const bundleMock = {
    nombre: "Mega Bundle",

    imagen:
      "https://image.com/bundle.jpg",

    ofertas: [],

    productos: [
      {
        nombre: "Juego 1",

        acerca:
          "Acerca del juego 1",

        imagen:
          "https://image.com/j1.jpg",

        capturas: [
          {
            thumb:
              "https://image.com/j1c1.jpg",
          },
        ],

        movies: [
          {
            thumb:
              "https://image.com/j1m1.jpg",
          },
        ],
      },
      {
        nombre: "Juego 2",

        acerca:
          "Acerca del juego 2",

        imagen:
          "https://image.com/j2.jpg",

        capturas: [],

        movies: [],
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();

    enWishlistState = false;

    backCaidoState = false;

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

    expect(
      await screen.findByRole("heading", {
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

  it("debe llamar toggleJuego al pulsar wishlist", async () => {
    mockToggleJuego.mockResolvedValue(undefined);

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

    await waitFor(() => {
      expect(
        mockToggleJuego,
      ).toHaveBeenCalledWith(123);
    });
  });

  it("debe mostrar estado wishlist activo", async () => {
    enWishlistState = true;

    render(
      <MemoryRouter>
        <GameDetalles />
      </MemoryRouter>,
    );

    expect(
      await screen.findByRole(
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

  it("debe abrir modal desde video principal", async () => {
    render(
      <MemoryRouter>
        <GameDetalles />
      </MemoryRouter>,
    );

    const video =
      await screen.findByAltText(
        /video thumbnail/i,
      );

    fireEvent.click(video);

    expect(
      screen.getByTestId(
        "modal-media",
      ),
    ).toHaveTextContent(
      "Modal 0",
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

  it("debe contraer la descripción", async () => {
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

    fireEvent.click(
      botonExpandir,
    );

    fireEvent.click(
      botonExpandir,
    );

    expect(
      document.querySelector(
        ".cut",
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

  it("debe usar desarrolladores si distribuidores no existe", async () => {
    (
      ServicioOfertas.getOfertasBySteamId as any
    ).mockResolvedValueOnce({
      data: {
        Juego: {
          ...juegoMock,
          distribuidores: "",
        },
      },
    });

    render(
      <MemoryRouter>
        <GameDetalles />
      </MemoryRouter>,
    );

    const textos =
      await screen.findAllByText(
        "FromSoftware",
      );

    expect(
      textos.length,
    ).toBeGreaterThan(1);
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

  it("no llama servicio si backend está caído", async () => {
    backCaidoState = true;

    render(
      <MemoryRouter>
        <GameDetalles />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        ServicioOfertas.getOfertasBySteamId,
      ).not.toHaveBeenCalled();
    });
  });

  it("renderiza bundle correctamente", async () => {
    (
      ServicioOfertas.getOfertasBySteamId as any
    ).mockResolvedValueOnce({
      data: {
        Bundle: bundleMock,
      },
    });

    render(
      <MemoryRouter>
        <GameDetalles />
      </MemoryRouter>,
    );

    expect(
      await screen.findByText(
        /contenido del conjunto/i,
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Juego 1",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Juego 2",
      ),
    ).toBeInTheDocument();
  });

  it("renderiza descripción bundle", async () => {
    (
      ServicioOfertas.getOfertasBySteamId as any
    ).mockResolvedValueOnce({
      data: {
        Bundle: bundleMock,
      },
    });

    render(
      <MemoryRouter>
        <GameDetalles />
      </MemoryRouter>,
    );

    expect(
      await screen.findByText(
        /descubre todo lo que forma parte/i,
      ),
    ).toBeInTheDocument();
  });

  it("abre modal en bundle", async () => {
    (
      ServicioOfertas.getOfertasBySteamId as any
    ).mockResolvedValueOnce({
      data: {
        Bundle: bundleMock,
      },
    });

    render(
      <MemoryRouter>
        <GameDetalles />
      </MemoryRouter>,
    );

    const captura =
      await screen.findByAltText(
        "Gameplay 0",
      );

    fireEvent.click(captura);

    expect(
      screen.getByTestId(
        "modal-media",
      ),
    ).toHaveTextContent(
      "Modal 1",
    );
  });

  it("maneja error en wishlist", async () => {
    const errorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    mockToggleJuego.mockRejectedValueOnce(
      new Error("wishlist error"),
    );

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

    await waitFor(() => {
      expect(
        errorSpy,
      ).toHaveBeenCalled();
    });

    errorSpy.mockRestore();
  });

  it("evita doble click mientras procesa wishlist", async () => {
    const user = userEvent.setup();

    mockToggleJuego.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(resolve, 100),
        ),
    );

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

    await user.click(boton);

    await user.click(boton);

    expect(
      mockToggleJuego,
    ).toHaveBeenCalledTimes(1);
  });

  it("renderiza imagen principal", async () => {
    render(
      <MemoryRouter>
        <GameDetalles />
      </MemoryRouter>,
    );

    const imagen =
      await screen.findByAltText(
        "Elden Ring",
      );

    expect(imagen).toBeInTheDocument();
  });

  it("renderiza thumbnail de video", async () => {
    render(
      <MemoryRouter>
        <GameDetalles />
      </MemoryRouter>,
    );

    expect(
      await screen.findByAltText(
        /video thumbnail/i,
      ),
    ).toBeInTheDocument();
  });

  it("renderiza botón leer más", async () => {
    render(
      <MemoryRouter>
        <GameDetalles />
      </MemoryRouter>,
    );

    expect(
      await screen.findByText(
        /leer más/i,
      ),
    ).toBeInTheDocument();
  });

  it("renderiza badge mejor precio", async () => {
    render(
      <MemoryRouter>
        <GameDetalles />
      </MemoryRouter>,
    );

    expect(
      await screen.findByText(
        /mejor precio/i,
      ),
    ).toBeInTheDocument();
  });

  it("renderiza porcentaje de ahorro", async () => {
    render(
      <MemoryRouter>
        <GameDetalles />
      </MemoryRouter>,
    );

    expect(
      await screen.findByText(
        "- 50%",
      ),
    ).toBeInTheDocument();
  });

  it("renderiza precio original", async () => {
    render(
      <MemoryRouter>
        <GameDetalles />
      </MemoryRouter>,
    );

    expect(
      await screen.findByText(
        "60$",
      ),
    ).toBeInTheDocument();
  });

  it("añade listener de scroll", async () => {
    const addSpy = vi.spyOn(
      window,
      "addEventListener",
    );

    render(
      <MemoryRouter>
        <GameDetalles />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(addSpy).toHaveBeenCalledWith(
        "scroll",
        expect.any(Function),
      );
    });
  });

  it("añade listener de resize", async () => {
    const addSpy = vi.spyOn(
      window,
      "addEventListener",
    );

    render(
      <MemoryRouter>
        <GameDetalles />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(addSpy).toHaveBeenCalledWith(
        "resize",
        expect.any(Function),
      );
    });
  });
});