import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login";
import { enviarNoti } from "../../util/notificacionToast.js";

const mockSignIn = vi.fn();
const mockSignUp = vi.fn();

vi.mock("../../context/AuthContext.js", () => ({
  useAuth: () => ({
    user: null,
    signIn: mockSignIn,
    signUp: mockSignUp,
    signInWithGoogle: vi.fn(),
    signInWithDiscord: vi.fn(),
    signInWithGithub: vi.fn(),
  }),
}));

vi.mock("../../util/notificacionToast.js", () => ({
  enviarNoti: vi.fn(),
  typeToast: {
    ERROR: "ERROR",
  },
}));

describe("Login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderLogin = () =>
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

  const switchToRegister = async () => {
    fireEvent.click(
      screen.getByRole("button", {
        name: /regístrate|registrarse/i,
      })
    );

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /registrarse/i })
      ).toBeInTheDocument();
    });
  };

  const fillEmail = (value: string) => {
    const email = screen.getAllByRole("textbox")[0];
    fireEvent.change(email, { target: { value } });
  };

  const fillPasswords = (pass1: string, pass2: string) => {
    const passwordInputs = screen.getAllByDisplayValue("");
    fireEvent.change(passwordInputs[0], { target: { value: pass1 } });
    fireEvent.change(passwordInputs[1], { target: { value: pass2 } });
  };

  it("renderiza login correctamente", () => {
    renderLogin();

    expect(
      screen.getByRole("heading", { name: /iniciar sesión/i })
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
  });

  it("cambia a modo registro", async () => {
    renderLogin();
    await switchToRegister();
  });

  it("muestra error si passwords no coinciden", async () => {
    renderLogin();
    await switchToRegister();

    fillEmail("test@test.com");
    fillPasswords("123456", "654321");

    fireEvent.click(
      screen.getByRole("button", { name: /registrarse/i })
    );

    await waitFor(() => {
      expect(screen.getByText(/password/i)).toBeInTheDocument();
    });
  });

  it("llama signUp correctamente", async () => {
    mockSignUp.mockResolvedValue({
      error: null,
      data: { user: { identities: [1] } },
    });

    renderLogin();
    await switchToRegister();

    fillEmail("test@test.com");
    fillPasswords("123456", "123456");

    fireEvent.click(
      screen.getByRole("button", { name: /registrarse/i })
    );

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith(
        "test@test.com",
        "123456"
      );
    });
  });

  it("llama signIn correctamente", async () => {
    mockSignIn.mockResolvedValue({
      error: null,
      data: { user: { id: 1 } },
    });

    renderLogin();

    const email = screen.getAllByRole("textbox")[0];
    fireEvent.change(email, { target: { value: "a@a.com" } });

    const password = screen.getAllByDisplayValue("")[0];
    fireEvent.change(password, { target: { value: "123456" } });

    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith(
        "a@a.com",
        "123456"
      );
    });
  });

  it("no rompe al cambiar modo varias veces", () => {
    renderLogin();

    const toggle = screen.getByRole("button", {
      name: /regístrate|registrarse/i,
    });

    fireEvent.click(toggle);
    fireEvent.click(toggle);

    expect(
      screen.getByRole("button", { name: /entrar|registrarse/i })
    ).toBeInTheDocument();
  });

  it("renderiza sin romper", () => {
    renderLogin();

    expect(
      screen.getByRole("heading", { name: /iniciar sesión|registrarse/i })
    ).toBeInTheDocument();
  });

  it("bloquea submit si passwords no coinciden (sin crash)", async () => {
    renderLogin();
    await switchToRegister();

    fillEmail("test@test.com");
    fillPasswords("123", "999");

    fireEvent.click(
      screen.getByRole("button", { name: /registrarse/i })
    );

    expect(mockSignUp).not.toHaveBeenCalled();
  });

  it("muestra error si signUp falla", async () => {
  mockSignUp.mockResolvedValue({
    error: new Error("fail"),
    data: null,
  });

  renderLogin();
  await switchToRegister();

  fillEmail("a@a.com");
  fillPasswords("123456", "123456");

  fireEvent.click(
    screen.getByRole("button", { name: /registrarse/i })
  );

  await waitFor(() => {
    expect(screen.getByText(/fail/i)).toBeInTheDocument();
  });
});
});