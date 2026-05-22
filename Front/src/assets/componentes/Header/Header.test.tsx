import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

// ---------------- MOCK STATE ----------------

let backCaidoState = false;

const mockNavigate = vi.fn();
const mockSignOut = vi.fn();
const mockEnviarNoti = vi.hoisted(() => vi.fn());
const mockGetOfertasBuscador = vi.hoisted(() => vi.fn());

// ---------------- ROUTER ----------------

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<any>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// ---------------- AUTH ----------------

vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({
    user: null,
    signOut: mockSignOut,
  }),
}));

// ---------------- NOTIFICACIONES ----------------

vi.mock("../../util/notificacionToast", () => ({
  enviarNoti: mockEnviarNoti,
  typeToast: {
    WARN: "warn",
  },
}));

// ---------------- SERVICIO API ----------------

vi.mock("../../servicios/Axios/ServicioOfertas", () => ({
  default: {
    getOfertasBuscador: mockGetOfertasBuscador,
  },
}));

// ---------------- HTTP AXIOS (IMPORTANT) ----------------

vi.mock("../../servicios/Axios/http-axios", () => ({
  get backCaido() {
    return backCaidoState;
  },
}));

// ---------------- IMPORT COMPONENT ----------------

import Menu from "./Header";

// ---------------- RENDER ----------------

const renderMenu = () =>
  render(
    <MemoryRouter>
      <Menu />
    </MemoryRouter>,
  );

// ---------------- TESTS ----------------

describe("Header/Menu component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    backCaidoState = false;
  });

  it("renders navigation links", () => {
    renderMenu();

    expect(
      screen.getByRole("link", { name: /tendencias/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /irresistibles/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /novedades/i }),
    ).toBeInTheDocument();
  });

  it("renders search input", () => {
    renderMenu();

    expect(
      screen.getByPlaceholderText(/que juegos buscas/i),
    ).toBeInTheDocument();
  });

  it("navigates when search is valid", async () => {
    const user = userEvent.setup();

    renderMenu();

    const input = screen.getByPlaceholderText(/que juegos buscas/i);

    await user.type(input, "zelda");
    await user.keyboard("{Enter}");

    expect(mockNavigate).toHaveBeenCalledWith("/ofertas?titulo=zelda");
  });

  it("shows notification when search < 3 chars", async () => {
    const user = userEvent.setup();

    renderMenu();

    const input = screen.getByPlaceholderText(/que juegos buscas/i);

    await user.type(input, "ab");
    await user.keyboard("{Enter}");

    expect(mockEnviarNoti).toHaveBeenCalled();
  });

  it("clears input after submit", async () => {
    const user = userEvent.setup();

    renderMenu();

    const input = screen.getByPlaceholderText(
      /que juegos buscas/i,
    ) as HTMLInputElement;

    await user.type(input, "mario");
    await user.keyboard("{Enter}");

    expect(input.value).toBe("");
  });

  it("does NOT call API when backCaido = true", async () => {
    backCaidoState = true;

    mockGetOfertasBuscador.mockClear();

    const user = userEvent.setup();

    renderMenu();

    const input = screen.getByPlaceholderText(/que juegos buscas/i);

    await user.type(input, "zelda");

    await waitFor(() => {
      expect(mockGetOfertasBuscador).not.toHaveBeenCalled();
    });
  });

  it("calls API after debounce (>=3 chars)", async () => {
    mockGetOfertasBuscador.mockResolvedValue({
      data: {
        ofertas: [{ id: 1, titulo: "Zelda", imagen: "img.png" }],
        total: 1,
        totalOfertas: 1,
      },
    });

    const user = userEvent.setup();

    renderMenu();

    const input = screen.getByPlaceholderText(/que juegos buscas/i);

    await user.type(input, "zelda");

    await waitFor(() => {
      expect(mockGetOfertasBuscador).toHaveBeenCalledWith("zelda");
    });
  });

  it("shows dropdown results", async () => {
    mockGetOfertasBuscador.mockResolvedValue({
      data: {
        ofertas: [{ id: 1, titulo: "Zelda", imagen: "img.png" }],
        total: 1,
        totalOfertas: 1,
      },
    });

    const user = userEvent.setup();

    renderMenu();

    const input = screen.getByPlaceholderText(/que juegos buscas/i);

    await user.type(input, "zelda");

    await waitFor(() => {
      expect(screen.getByText("Zelda")).toBeInTheDocument();
    });
  });

  it("navigates when clicking a search result", async () => {
    const user = userEvent.setup();

    mockGetOfertasBuscador.mockResolvedValue({
      data: {
        ofertas: [{ id: 99, titulo: "Zelda", imagen: "img.png" }],
        total: 1,
        totalOfertas: 1,
      },
    });

    renderMenu();

    const input = screen.getByPlaceholderText(/que juegos buscas/i);

    await user.type(input, "zelda");

    const result = await screen.findByText("Zelda");

    await user.click(result);

    expect(mockNavigate).toHaveBeenCalledWith("/juego/99", { replace: true });
  });

  it("navigates to full results page when clicking total option", async () => {
    const user = userEvent.setup();

    mockGetOfertasBuscador.mockResolvedValue({
      data: {
        ofertas: [{ id: 1, titulo: "Zelda", imagen: "img.png" }],
        total: 10,
        totalOfertas: 5,
      },
    });

    renderMenu();

    const input = screen.getByPlaceholderText(/que juegos buscas/i);

    await user.type(input, "zelda");

    const total = await screen.findByText(/resultados:/i);

    await user.click(total);

    expect(mockNavigate).toHaveBeenCalledWith("/ofertas?titulo=zelda", {
      replace: true,
    });
  });

  it("shows no results message when API returns empty", async () => {
    const user = userEvent.setup();

    mockGetOfertasBuscador.mockResolvedValue({
      data: {
        ofertas: [],
        total: 0,
        totalOfertas: 0,
      },
    });

    renderMenu();

    const input = screen.getByPlaceholderText(/que juegos buscas/i);

    await user.type(input, "zzzz");

    const msg = await screen.findByText(/no se ha encontrado/i);

    expect(msg).toBeInTheDocument();
  });

  it("opens and closes avatar dropdown", async () => {
    const user = userEvent.setup();

    renderMenu();

    const avatarButton = screen.getAllByRole("button")[1];

    await user.click(avatarButton);

    expect(screen.getByText(/login/i)).toBeInTheDocument();

    await user.click(document.body);

    await waitFor(() => {
      expect(screen.queryByText(/login/i)).not.toBeInTheDocument();
    });
  });

  it("opens dropdown on input focus when results exist", async () => {
    const user = userEvent.setup();

    mockGetOfertasBuscador.mockResolvedValue({
      data: {
        ofertas: [{ id: 1, titulo: "Zelda", imagen: "img.png" }],
        total: 1,
        totalOfertas: 1,
      },
    });

    renderMenu();

    const input = screen.getByPlaceholderText(/que juegos buscas/i);

    await user.type(input, "zelda");

    const inputEl = screen.getByPlaceholderText(/que juegos buscas/i);

    await user.click(inputEl);

    await waitFor(() => {
      expect(screen.getByText("Zelda")).toBeInTheDocument();
    });
  });
});
