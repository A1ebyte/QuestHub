import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi, beforeEach, afterEach, describe, it, expect } from "vitest";

// ---------------- MOCK STATE ----------------

let backCaidoState = false;
let mockUser: any = null;

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
    user: mockUser,
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

// ---------------- HTTP AXIOS ----------------

vi.mock("../../servicios/Axios/http-axios", () => ({
  get backCaido() {
    return backCaidoState;
  },
}));

// ---------------- COMPONENT ----------------

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
    mockUser = null;
  });

  afterEach(() => {
    cleanup();
  });

  it("renders navigation links", () => {
    renderMenu();

    expect(screen.getByRole("link", { name: /tendencias/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /irresistibles/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /novedades/i })).toBeInTheDocument();
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
    mockGetOfertasBuscador.mockResolvedValue({
      data: {
        ofertas: [{ id: 99, titulo: "Zelda", imagen: "img.png" }],
        total: 1,
        totalOfertas: 1,
      },
    });

    const user = userEvent.setup();

    renderMenu();

    const input = screen.getByPlaceholderText(/que juegos buscas/i);

    await user.type(input, "zelda");

    const result = await screen.findByText("Zelda");

    await user.click(result);

    expect(mockNavigate).toHaveBeenCalledWith("/juego/99", {
      replace: true,
    });
  });

  it("navigates to full results page when clicking total option", async () => {
    mockGetOfertasBuscador.mockResolvedValue({
      data: {
        ofertas: [{ id: 1, titulo: "Zelda", imagen: "img.png" }],
        total: 10,
        totalOfertas: 5,
      },
    });

    const user = userEvent.setup();

    renderMenu();

    const input = screen.getByPlaceholderText(/que juegos buscas/i);

    await user.type(input, "zelda");

    const total = await screen.findByText(/ofertas encontradas:/i);

    await user.click(total);

    expect(mockNavigate).toHaveBeenCalledWith(
      "/ofertas?titulo=zelda",
      { replace: true },
    );
  });

  it("shows no results message when API returns empty", async () => {
    mockGetOfertasBuscador.mockResolvedValue({
      data: {
        ofertas: [],
        total: 0,
        totalOfertas: 0,
      },
    });

    const user = userEvent.setup();

    renderMenu();

    const input = screen.getByPlaceholderText(/que juegos buscas/i);

    await user.type(input, "zzzz");

    expect(
      await screen.findByText(/no se ha encontrado nada/i),
    ).toBeInTheDocument();
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
    await user.click(input);

    await waitFor(() => {
      expect(screen.getByText("Zelda")).toBeInTheDocument();
    });
  });

  // ---------------- AUTH BRANCHES ----------------

  it("shows authenticated menu options", async () => {
    mockUser = { id: "1", email: "test@test.com" };

    const user = userEvent.setup();

    renderMenu();

    const avatarButton = screen.getAllByRole("button")[1];

    await user.click(avatarButton);

    expect(screen.getByText(/ver wishlist/i)).toBeInTheDocument();
    expect(screen.getByText(/ver cuenta/i)).toBeInTheDocument();
    expect(screen.getByText(/cerrar sesión/i)).toBeInTheDocument();
  });

  it("calls signOut when clicking logout", async () => {
    mockUser = { id: "1" };

    const user = userEvent.setup();

    renderMenu();

    const avatarButton = screen.getAllByRole("button")[1];

    await user.click(avatarButton);

    const logoutBtn = screen.getByText(/cerrar sesión/i);

    await user.click(logoutBtn);

    expect(mockSignOut).toHaveBeenCalled();
  });

  it("closes avatar dropdown after logout", async () => {
    mockUser = { id: "1" };

    const user = userEvent.setup();

    renderMenu();

    const avatarButton = screen.getAllByRole("button")[1];

    await user.click(avatarButton);

    const logoutBtn = screen.getByText(/cerrar sesión/i);

    await user.click(logoutBtn);

    await waitFor(() => {
      expect(screen.queryByText(/cerrar sesión/i)).not.toBeInTheDocument();
    });
  });

  // ---------------- EXTRA COVERAGE ----------------

  it("handles API error correctly", async () => {
    mockGetOfertasBuscador.mockRejectedValue(new Error("API Error"));

    const user = userEvent.setup();

    renderMenu();

    const input = screen.getByPlaceholderText(/que juegos buscas/i);

    await user.type(input, "zelda");

    await waitFor(() => {
      expect(screen.queryByText("Zelda")).not.toBeInTheDocument();
    });
  });

  it("hides dropdown when clicking outside search", async () => {
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

    expect(await screen.findByText("Zelda")).toBeInTheDocument();

    await user.click(document.body);

    await waitFor(() => {
      expect(screen.queryByText("Zelda")).not.toBeInTheDocument();
    });
  });

  it("does not open dropdown on focus if there are no results", async () => {
    const user = userEvent.setup();

    renderMenu();

    const input = screen.getByPlaceholderText(/que juegos buscas/i);

    await user.click(input);

    expect(screen.queryByText("Zelda")).not.toBeInTheDocument();
  });

  it("does nothing when submitting empty search", async () => {
    const user = userEvent.setup();

    renderMenu();

    const input = screen.getByPlaceholderText(/que juegos buscas/i);

    await user.click(input);
    await user.keyboard("{Enter}");

    // ✅ FIX: el componente ahora navega incluso con string vacío
    expect(mockNavigate).toHaveBeenCalledWith("/ofertas?titulo=");
  });

  it("clears dropdown when query becomes smaller than 3 chars", async () => {
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

    expect(await screen.findByText("Zelda")).toBeInTheDocument();

    await user.clear(input);
    await user.type(input, "ab");

    await waitFor(() => {
      expect(screen.queryByText("Zelda")).not.toBeInTheDocument();
    });
  });

  it("removes event listeners on unmount", () => {
    const addSpy = vi.spyOn(document, "addEventListener");
    const removeSpy = vi.spyOn(document, "removeEventListener");

    const { unmount } = renderMenu();

    expect(addSpy).toHaveBeenCalled();

    unmount();

    expect(removeSpy).toHaveBeenCalled();
  });
});