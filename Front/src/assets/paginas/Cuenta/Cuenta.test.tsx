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

let authState = {
  session: {
    user: { id: "123" },
    access_token: "token",
  },
  user: {
    email: "test@mail.com",
  },
  signOut: mockSignOut,
};

// ---------------- AUTH MOCK ----------------

vi.mock("../../context/AuthContext", () => ({
  useAuth: () => authState,
}));

// ---------------- SERVICIO USUARIOS ----------------

vi.mock("../../servicios/Axios/ServicioUsuarios", () => ({
  default: {
    getRecibirNotificaciones: (...args: any[]) =>
      mockGetRecibirNotificaciones(...args),

    patchRecibirNotificaciones: (...args: any[]) =>
      mockPatchRecibirNotificaciones(...args),

    borrarCuenta: (...args: any[]) =>
      mockBorrarCuenta(...args),
  },
}));

// ---------------- NOTIFICACIONES ----------------

const mockEnviarNoti = vi.fn();

vi.mock("../../util/notificacionToast", () => ({
  enviarNoti: (...args: any[]) =>
    mockEnviarNoti(...args),

  colores: {
    TEAL: "teal",
  },

  typeToast: {
    SUCCESS: "success",
    ERROR: "error",
  },
}));

vi.mock("../../const/iconos", () => ({
  toastICONS: {
    MAIL: () => "icon",
  },
}));

// ---------------- MODAL MOCK ----------------

vi.mock(
  "../../componentes/Modals/Borrado/ModalBorrado",
  () => ({
    default: ({
      isOpen,
      onClose,
      onConfirm,
    }: any) =>
      isOpen ? (
        <div>
          <h2>Confirmar eliminación</h2>

          <button onClick={onConfirm}>
            Eliminar permanentemente
          </button>

          <button onClick={onClose}>
            Cancelar
          </button>
        </div>
      ) : null,
  })
);

// ---------------- BACK CAIDO MOCK ----------------

vi.mock(
  "../../servicios/Axios/http-axios",
  () => ({
    get backCaido() {
      return backCaidoState;
    },
  })
);

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

    authState = {
      session: {
        user: { id: "123" },
        access_token: "token",
      },

      user: {
        email: "test@mail.com",
      },

      signOut: mockSignOut,
    };
  });

  it("renderiza usuario", () => {
    mockGetRecibirNotificaciones.mockResolvedValue({
      data: true,
    });

    renderCuenta();

    expect(
      screen.getByText(
        "Configuración de Cuenta"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText("test")
    ).toBeInTheDocument();

    expect(
      screen.getByText("test@mail.com")
    ).toBeInTheDocument();
  });

  it("carga notificaciones (useEffect)", async () => {
    mockGetRecibirNotificaciones.mockResolvedValue({
      data: true,
    });

    renderCuenta();

    await waitFor(() => {
      expect(
        mockGetRecibirNotificaciones
      ).toHaveBeenCalledWith("123");
    });
  });

  it("activa/desactiva notificaciones", async () => {
    const user = userEvent.setup();

    mockGetRecibirNotificaciones.mockResolvedValue({
      data: false,
    });

    mockPatchRecibirNotificaciones.mockResolvedValue(
      {}
    );

    renderCuenta();

    const checkbox =
      await screen.findByRole(
        "checkbox"
      );

    await user.click(checkbox);

    await waitFor(() => {
      expect(
        mockPatchRecibirNotificaciones
      ).toHaveBeenCalledWith(
        "123",
        true
      );
    });
  });

  it("abre modal de eliminar cuenta", async () => {
    const user = userEvent.setup();

    mockGetRecibirNotificaciones.mockResolvedValue({
      data: true,
    });

    renderCuenta();

    const btn = screen.getByRole(
      "button",
      {
        name: /eliminar cuenta definitivamente/i,
      }
    );

    await user.click(btn);

    expect(
      screen.getByText(
        /confirmar eliminación/i
      )
    ).toBeInTheDocument();
  });

  it("cierra modal al cancelar", async () => {
    const user = userEvent.setup();

    mockGetRecibirNotificaciones.mockResolvedValue({
      data: true,
    });

    renderCuenta();

    await user.click(
      screen.getByRole("button", {
        name: /eliminar cuenta definitivamente/i,
      })
    );

    expect(
      screen.getByText(
        /confirmar eliminación/i
      )
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: /cancelar/i,
      })
    );

    expect(
      screen.queryByText(
        /confirmar eliminación/i
      )
    ).not.toBeInTheDocument();
  });

  it("elimina cuenta correctamente (success)", async () => {
    const user = userEvent.setup();

    mockGetRecibirNotificaciones.mockResolvedValue({
      data: true,
    });

    mockBorrarCuenta.mockResolvedValue({});

    renderCuenta();

    await user.click(
      screen.getByRole("button", {
        name: /eliminar cuenta definitivamente/i,
      })
    );

    const confirm =
      await screen.findByRole(
        "button",
        {
          name: /eliminar permanentemente/i,
        }
      );

    await user.click(confirm);

    await waitFor(() => {
      expect(
        mockBorrarCuenta
      ).toHaveBeenCalledWith(
        "token"
      );

      expect(
        mockSignOut
      ).toHaveBeenCalled();
    });
  });

  it("maneja error al eliminar cuenta", async () => {
    const user = userEvent.setup();

    mockGetRecibirNotificaciones.mockResolvedValue({
      data: true,
    });

    mockBorrarCuenta.mockRejectedValue(
      new Error("backend caido")
    );

    renderCuenta();

    await user.click(
      screen.getByRole("button", {
        name: /eliminar cuenta definitiva/i,
      })
    );

    const confirm =
      await screen.findByRole(
        "button",
        {
          name: /eliminar permanentemente/i,
        }
      );

    await user.click(confirm);

    await waitFor(() => {
      expect(
        mockBorrarCuenta
      ).toHaveBeenCalled();

      expect(
        mockSignOut
      ).not.toHaveBeenCalled();
    });
  });

  it("backCaido deshabilita inputs", async () => {
    backCaidoState = true;

    mockGetRecibirNotificaciones.mockResolvedValue({
      data: true,
    });

    renderCuenta();

    const checkbox =
      await screen.findByRole(
        "checkbox"
      );

    const btn = screen.getByRole(
      "button",
      {
        name: /eliminar cuenta definitivamente/i,
      }
    );

    expect(checkbox).toBeDisabled();

    expect(btn).toBeDisabled();
  });

  it("renderiza nombre vacío si no existe email", () => {
    mockGetRecibirNotificaciones.mockResolvedValue({
      data: true,
    });

    authState = {
      session: {
        user: { id: "123" },
        access_token: "token",
      },

      user: {
        email: "",
      },

      signOut: mockSignOut,
    };

    renderCuenta();

    expect(
      screen.getByText("Usuario")
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Correo Electrónico"
      )
    ).toBeInTheDocument();

    expect(
      screen.queryByText(/@/)
    ).not.toBeInTheDocument();
  });

  it("no carga notificaciones sin session", async () => {
    authState = {
      session: null as any,
      user: null as any,
      signOut: mockSignOut,
    };

    renderCuenta();

    await waitFor(() => {
      expect(
        mockGetRecibirNotificaciones
      ).not.toHaveBeenCalled();
    });
  });

  it("no actualiza notificaciones sin session", async () => {
    const user = userEvent.setup();

    authState = {
      session: null as any,
      user: null as any,
      signOut: mockSignOut,
    };

    renderCuenta();

    const checkbox =
      screen.getByRole(
        "checkbox"
      );

    await user.click(checkbox);

    expect(
      mockPatchRecibirNotificaciones
    ).not.toHaveBeenCalled();
  });

  it("maneja error al cargar notificaciones", async () => {
    mockGetRecibirNotificaciones.mockRejectedValue(
      new Error("error")
    );

    renderCuenta();

    await waitFor(() => {
      expect(
        mockGetRecibirNotificaciones
      ).toHaveBeenCalled();
    });
  });

  it("maneja error al actualizar notificaciones", async () => {
    const user = userEvent.setup();

    mockGetRecibirNotificaciones.mockResolvedValue({
      data: false,
    });

    mockPatchRecibirNotificaciones.mockRejectedValue(
      new Error("error")
    );

    renderCuenta();

    const checkbox =
      await screen.findByRole(
        "checkbox"
      );

    await user.click(checkbox);

    await waitFor(() => {
      expect(
        mockPatchRecibirNotificaciones
      ).toHaveBeenCalled();
    });
  });

  it("envía notificación success al actualizar preferencias", async () => {
    const user = userEvent.setup();

    mockGetRecibirNotificaciones.mockResolvedValue({
      data: false,
    });

    mockPatchRecibirNotificaciones.mockResolvedValue(
      {}
    );

    renderCuenta();

    const checkbox =
      await screen.findByRole(
        "checkbox"
      );

    await user.click(checkbox);

    await waitFor(() => {
      expect(
        mockEnviarNoti
      ).toHaveBeenCalledWith(
        "success",
        "Notificaciones cambiadas",
        "Se han cambiado de manera correcta",
        "icon"
      );
    });
  });

  it("envía notificación success al borrar cuenta", async () => {
    const user = userEvent.setup();

    mockGetRecibirNotificaciones.mockResolvedValue({
      data: true,
    });

    mockBorrarCuenta.mockResolvedValue({});

    renderCuenta();

    await user.click(
      screen.getByRole("button", {
        name: /eliminar cuenta definitivamente/i,
      })
    );

    await user.click(
      await screen.findByRole(
        "button",
        {
          name: /eliminar permanentemente/i,
        }
      )
    );

    await waitFor(() => {
      expect(
        mockEnviarNoti
      ).toHaveBeenCalledWith(
        "success",
        "ATENCIÓN",
        "Cuenta eliminada correctamente"
      );
    });
  });

  it("envía notificación error al fallar borrado", async () => {
    const user = userEvent.setup();

    mockGetRecibirNotificaciones.mockResolvedValue({
      data: true,
    });

    mockBorrarCuenta.mockRejectedValue(
      new Error("error")
    );

    renderCuenta();

    await user.click(
      screen.getByRole("button", {
        name: /eliminar cuenta definitiva/i,
      })
    );

    await user.click(
      await screen.findByRole(
        "button",
        {
          name: /eliminar permanentemente/i,
        }
      )
    );

    await waitFor(() => {
      expect(
        mockEnviarNoti
      ).toHaveBeenCalledWith(
        "error",
        "Error",
        "No se pudo eliminar la cuenta. Inténtalo de nuevo más tarde."
      );
    });
  });

  it("no elimina cuenta si no hay access token", async () => {
    const user = userEvent.setup();

    mockGetRecibirNotificaciones.mockResolvedValue({
      data: true,
    });

    authState = {
      session: {
        user: { id: "123" },
        access_token: "",
      },

      user: {
        email: "test@mail.com",
      },

      signOut: mockSignOut,
    };

    renderCuenta();

    await user.click(
      screen.getByRole("button", {
        name: /eliminar cuenta definitiva/i,
      })
    );

    await user.click(
      await screen.findByRole(
        "button",
        {
          name: /eliminar permanentemente/i,
        }
      )
    );

    expect(
      mockBorrarCuenta
    ).not.toHaveBeenCalled();
  });
});