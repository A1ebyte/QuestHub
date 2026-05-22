import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

// ---------------- STATE MOCK ----------------

let backCaidoState = false;

const mockSignOut = vi.fn();

const mockGetRecibirNotificaciones = vi.hoisted(() => vi.fn());
const mockPatchRecibirNotificaciones = vi.hoisted(() => vi.fn());
const mockBorrarCuenta = vi.hoisted(() => vi.fn());

// ---------------- AUTH MOCK ----------------

vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({
    session: {
      user: { id: "123" },
      access_token: "token",
    },
    user: {
      email: "test@mail.com",
    },
    signOut: mockSignOut,
  }),
}));

// ---------------- SERVICIO USUARIOS ----------------

vi.mock("../../servicios/Axios/ServicioUsuarios", () => ({
  default: {
    getRecibirNotificaciones: (...args: any[]) =>
      mockGetRecibirNotificaciones(...args),
    patchRecibirNotificaciones: (...args: any[]) =>
      mockPatchRecibirNotificaciones(...args),
    borrarCuenta: (...args: any[]) => mockBorrarCuenta(...args),
  },
}));

// ---------------- NOTIFICACIONES ----------------

vi.mock("../../util/notificacionToast", () => ({
  enviarNoti: vi.fn(),
  colores: {},
  typeToast: {
    SUCCESS: "success",
    ERROR: "error",
  },
}));

vi.mock("../../const/iconos", () => ({
  toastICONS: {},
}));

// ---------------- BACK CAIDO MOCK ----------------

vi.mock("../../servicios/Axios/http-axios", () => ({
  get backCaido() {
    return backCaidoState;
  },
}));

// ---------------- IMPORT COMPONENT ----------------

import Cuenta from "./Cuenta";

// ---------------- RENDER ----------------

const renderCuenta = () =>
  render(
    <MemoryRouter>
      <Cuenta />
    </MemoryRouter>
  );

// ---------------- TESTS ----------------

describe("Cuenta page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    backCaidoState = false;
  });

  it("renderiza usuario", () => {
    mockGetRecibirNotificaciones.mockResolvedValue({ data: true });

    renderCuenta();

    expect(screen.getByText("Configuración de Cuenta")).toBeInTheDocument();
    expect(screen.getByText("test")).toBeInTheDocument();
    expect(screen.getByText("test@mail.com")).toBeInTheDocument();
  });

  it("carga notificaciones (useEffect)", async () => {
    mockGetRecibirNotificaciones.mockResolvedValue({ data: true });

    renderCuenta();

    await waitFor(() => {
      expect(mockGetRecibirNotificaciones).toHaveBeenCalledWith("123");
    });
  });

  it("activa/desactiva notificaciones", async () => {
    const user = userEvent.setup();

    mockGetRecibirNotificaciones.mockResolvedValue({ data: false });
    mockPatchRecibirNotificaciones.mockResolvedValue({});

    renderCuenta();

    const checkbox = await screen.findByRole("checkbox");

    await user.click(checkbox);

    await waitFor(() => {
      expect(mockPatchRecibirNotificaciones).toHaveBeenCalled();
    });
  });

  it("abre modal de eliminar cuenta", async () => {
    const user = userEvent.setup();

    mockGetRecibirNotificaciones.mockResolvedValue({ data: true });

    renderCuenta();

    const btn = screen.getByRole("button", {
      name: /eliminar cuenta definitivamente/i,
    });

    await user.click(btn);

    expect(
      screen.getByText(/confirmar eliminación/i)
    ).toBeInTheDocument();
  });

  it("elimina cuenta correctamente (success)", async () => {
    const user = userEvent.setup();

    mockGetRecibirNotificaciones.mockResolvedValue({ data: true });
    mockBorrarCuenta.mockResolvedValue({});

    renderCuenta();

    await user.click(
      screen.getByRole("button", {
        name: /eliminar cuenta definitivamente/i,
      })
    );

    const confirm = await screen.findByRole("button", {
      name: /eliminar permanentemente/i,
    });

    await user.click(confirm);

    await waitFor(() => {
      expect(mockBorrarCuenta).toHaveBeenCalled();
      expect(mockSignOut).toHaveBeenCalled();
    });
  });

  it("maneja error al eliminar cuenta (CUBRE LÍNEA 126 🔥)", async () => {
    const user = userEvent.setup();

    mockGetRecibirNotificaciones.mockResolvedValue({ data: true });

    mockBorrarCuenta.mockRejectedValue(new Error("backend caido"));

    renderCuenta();

    await user.click(
      screen.getByRole("button", {
        name: /eliminar cuenta definitiva/i,
      })
    );

    const confirm = await screen.findByRole("button", {
      name: /eliminar permanentemente/i,
    });

    await user.click(confirm);

    await waitFor(() => {
      expect(mockBorrarCuenta).toHaveBeenCalled();
      expect(mockSignOut).not.toHaveBeenCalled();
    });
  });

  it("backCaido deshabilita inputs", async () => {
    backCaidoState = true;

    mockGetRecibirNotificaciones.mockResolvedValue({ data: true });

    renderCuenta();

    const checkbox = await screen.findByRole("checkbox");
    const btn = screen.getByRole("button", {
      name: /eliminar cuenta definitivamente/i,
    });

    expect(checkbox).toBeDisabled();
    expect(btn).toBeDisabled();
  });
});