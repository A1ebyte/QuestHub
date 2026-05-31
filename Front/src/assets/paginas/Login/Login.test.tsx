import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login";

const mockSignIn = vi.fn();
const mockSignUp = vi.fn();

const mockGoogle = vi.fn();
const mockDiscord = vi.fn();
const mockGithub = vi.fn();

let mockUser: any = null;

// MOCKS
vi.mock("../../context/AuthContext.js", () => ({
  useAuth: () => ({
    user: mockUser,
    signIn: mockSignIn,
    signUp: mockSignUp,
    signInWithGoogle: mockGoogle,
    signInWithDiscord: mockDiscord,
    signInWithGithub: mockGithub,
  }),
}));

vi.mock("../../util/notificacionToast.js", () => ({
  enviarNoti: vi.fn(),
  typeToast: { ERROR: "ERROR" },
}));

// ROUTER MOCK (para coverage de Navigate)
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<any>("react-router-dom");
  return {
    ...actual,
    Navigate: ({ to }: any) => (
      <div data-testid="navigate">{to}</div>
    ),
  };
});

const renderLogin = () =>
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

const getEmail = () =>
  screen.getAllByRole("textbox")[0];

const getPasswords = () =>
  screen.getAllByDisplayValue("");

const fillEmail = (value: string) => {
  fireEvent.change(getEmail(), {
    target: { value },
  });
};

const fillPasswords = (p1: string, p2?: string) => {
  const inputs = getPasswords();
  fireEvent.change(inputs[0], { target: { value: p1 } });

  if (p2 !== undefined) {
    fireEvent.change(inputs[1], { target: { value: p2 } });
  }
};

const switchMode = async () => {
  fireEvent.click(
    screen.getByRole("button", {
      name: /regístrate|registrarse/i,
    })
  );

  await screen.findByRole("heading", {
    name: /registrarse/i,
  });
};

describe("Login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUser = null;
  });

  it("render login", () => {
    renderLogin();

    expect(
      screen.getByRole("heading", { name: /iniciar sesión/i })
    ).toBeInTheDocument();
  });

  it("switch a registro", async () => {
    renderLogin();
    await switchMode();
  });

  it("error passwords mismatch", async () => {
    renderLogin();
    await switchMode();

    fillEmail("test@test.com");
    fillPasswords("123", "999");

    fireEvent.click(
      screen.getByRole("button", { name: /registrarse/i })
    );

    await waitFor(() => {
      expect(screen.getByText(/password/i)).toBeInTheDocument();
    });

    expect(mockSignUp).not.toHaveBeenCalled();
  });

  it("signUp OK", async () => {
    mockSignUp.mockResolvedValue({
      error: null,
      data: { user: { identities: [1] } },
    });

    renderLogin();
    await switchMode();

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

  it("signUp identities empty → vuelve login", async () => {
    mockSignUp.mockResolvedValue({
      error: null,
      data: { user: { identities: [] } },
    });

    renderLogin();
    await switchMode();

    fillEmail("test@test.com");
    fillPasswords("123456", "123456");

    fireEvent.click(
      screen.getByRole("button", { name: /registrarse/i })
    );

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /iniciar sesión/i })
      ).toBeInTheDocument();
    });
  });

  it("signIn OK", async () => {
    mockSignIn.mockResolvedValue({
      error: null,
      data: { user: { id: 1 } },
    });

    renderLogin();

    fillEmail("a@a.com");
    fillPasswords("123456");

    fireEvent.click(
      screen.getByRole("button", { name: /entrar/i })
    );

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith(
        "a@a.com",
        "123456"
      );
    });
  });

  it("signIn error catch", async () => {
    mockSignIn.mockRejectedValue(new Error("fail"));

    renderLogin();

    fillEmail("a@a.com");
    fillPasswords("123456");

    fireEvent.click(
      screen.getByRole("button", { name: /entrar/i })
    );

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it("google login", async () => {
    mockGoogle.mockResolvedValue({ error: null });

    renderLogin();

    fireEvent.click(screen.getByAltText("Google"));

    await waitFor(() => {
      expect(mockGoogle).toHaveBeenCalled();
    });
  });

  it("discord login", async () => {
    mockDiscord.mockResolvedValue({ error: null });

    renderLogin();

    fireEvent.click(screen.getByAltText("Discord"));

    await waitFor(() => {
      expect(mockDiscord).toHaveBeenCalled();
    });
  });

  it("github login", async () => {
    mockGithub.mockResolvedValue({ error: null });

    renderLogin();

    fireEvent.click(screen.getByAltText("GitHub"));

    await waitFor(() => {
      expect(mockGithub).toHaveBeenCalled();
    });
  });

  it("user logged → navigate", () => {
    mockUser = { id: 1 };

    renderLogin();

    expect(screen.getByTestId("navigate")).toHaveTextContent("/");
  });
});