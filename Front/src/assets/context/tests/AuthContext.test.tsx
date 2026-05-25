import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "../AuthContext";

// ---------------- MOCKS ----------------

vi.mock("../../lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: {
          subscription: {
            unsubscribe: vi.fn(),
          },
        },
      })),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signInWithOAuth: vi.fn(),
      signOut: vi.fn(),
    },
  },
}));

vi.mock("../../util/notificacionToast", () => ({
  enviarNoti: vi.fn(),
  typeToast: {
    SUCCESS: "success",
    ERROR: "error",
  },
}));

vi.mock("../../servicios/Axios/authSync", () => ({
  sincronizarConBackend: vi.fn(),
}));

// @ts-ignore
import { supabase } from "../../lib/supabase";
import { enviarNoti } from "../../util/notificacionToast";
import { sincronizarConBackend } from "../../servicios/Axios/authSync";

// ---------------- SETUP GLOBAL ----------------

Object.defineProperty(window, "location", {
  value: { origin: "http://localhost" },
});

Object.defineProperty(window, "sessionStorage", {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  },
});

// ---------------- WRAPPER ----------------

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

// ---------------- TESTS ----------------

describe("AuthContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // INIT
  it("inicializa sesión null", async () => {
    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: null },
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toBeNull();
  });

  // SIGN IN OK
  it("signIn exitoso", async () => {
    (supabase.auth.signInWithPassword as any).mockResolvedValue({
      data: { user: { id: "1" } },
      error: null,
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signIn("test@mail.com", "1234");
    });

    expect(enviarNoti).toHaveBeenCalledWith(
      "success",
      "Bienvenido a Quest-Hub",
      "Es hora de descubrir grandes ofertas"
    );
  });

  // SIGN IN ERROR
  it("signIn error", async () => {
    (supabase.auth.signInWithPassword as any).mockResolvedValue({
      data: null,
      error: { message: "error login" },
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signIn("a@a.com", "1234");
    });

    expect(enviarNoti).toHaveBeenCalledWith(
      "error",
      "Error al iniciar sesión",
      "error login"
    );
  });

  // SIGN UP
  it("signUp OK", async () => {
    (supabase.auth.signUp as any).mockResolvedValue({
      data: {},
      error: null,
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signUp("a@a.com", "1234");
    });

    expect(enviarNoti).toHaveBeenCalledWith(
      "success",
      "Confirma tu email",
      "Te hemos enviado un correo de confirmación"
    );
  });

  // SIGN OUT
  it("signOut OK", async () => {
    (supabase.auth.signOut as any).mockResolvedValue({
      error: null,
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signOut();
    });

    expect(enviarNoti).toHaveBeenCalledWith(
      "success",
      "Hasta luego",
      "Esperamos verte pronto"
    );
  });

  // GOOGLE OK
  it("google login", async () => {
    (supabase.auth.signInWithOAuth as any).mockResolvedValue({
      data: {},
      error: null,
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signInWithGoogle();
    });

    expect(supabase.auth.signInWithOAuth).toHaveBeenCalled();
  });

  // GOOGLE ERROR (COVERAGE BOOST)
  it("google login error", async () => {
    (supabase.auth.signInWithOAuth as any).mockResolvedValue({
      data: null,
      error: { message: "google error" },
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signInWithGoogle();
    });

    expect(enviarNoti).toHaveBeenCalledWith(
      "error",
      "Error al conectar con Google",
      "google error"
    );
  });

  // DISCORD ERROR
  it("discord login error", async () => {
    (supabase.auth.signInWithOAuth as any).mockResolvedValue({
      data: null,
      error: { message: "discord error" },
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signInWithDiscord();
    });

    expect(enviarNoti).toHaveBeenCalledWith(
      "error",
      "Error al conectar con Discord",
      "discord error"
    );
  });

  // GITHUB ERROR
  it("github login error", async () => {
    (supabase.auth.signInWithOAuth as any).mockResolvedValue({
      data: null,
      error: { message: "github error" },
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signInWithGithub();
    });

    expect(enviarNoti).toHaveBeenCalledWith(
      "error",
      "Error al conectar con Github",
      "github error"
    );
  });

  it("sync backend SIGNED_IN", async () => {
  (supabase.auth.getSession as any).mockResolvedValue({
    data: { session: null },
  });

  let cb: any;

  (supabase.auth.onAuthStateChange as any).mockImplementation((fn: any) => {
    cb = fn;
    return {
      data: { subscription: { unsubscribe: vi.fn() } },
    };
  });

  (sincronizarConBackend as any).mockResolvedValue({});

  // 🔥 FIX CLAVE: evita early return del contexto
  (sessionStorage.getItem as any).mockReturnValue("login");

  renderHook(() => useAuth(), { wrapper });

  await act(async () => {
    await cb("SIGNED_IN", {
      user: { id: "1", email: "test@mail.com" },
      access_token: "token",
    });
  });

  await waitFor(() => {
    expect(sincronizarConBackend).toHaveBeenCalled();
  });

  await waitFor(() => {
    expect(enviarNoti).toHaveBeenCalled();
  });
});

  // BACKEND SYNC ERROR (CATCH COVERAGE)
  it("sync backend error (catch)", async () => {
    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: null },
    });

    let cb: any;

    (supabase.auth.onAuthStateChange as any).mockImplementation((fn: any) => {
      cb = fn;
      return {
        data: { subscription: { unsubscribe: vi.fn() } },
      };
    });

    (sincronizarConBackend as any).mockRejectedValue(new Error("fail"));

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await cb("SIGNED_IN", {
        user: { id: "1", email: "test@mail.com" },
        access_token: "token",
      });
    });

    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  // SIGNED OUT
  it("SIGNED_OUT", async () => {
    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: null },
    });

    let cb: any;

    (supabase.auth.onAuthStateChange as any).mockImplementation((fn: any) => {
      cb = fn;
      return {
        data: { subscription: { unsubscribe: vi.fn() } },
      };
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await cb("SIGNED_OUT", null);
    });

    expect(result.current.isSynced).toBe(false);
  });

    // SIGN UP ERROR
  it("signUp error", async () => {
    (supabase.auth.signUp as any).mockResolvedValue({
      data: null,
      error: { message: "signup error" },
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signUp("a@a.com", "1234");
    });

    expect(enviarNoti).toHaveBeenCalledWith(
      "error",
      "Error al crear cuenta",
      "signup error"
    );
  });

  // SIGN OUT ERROR
  it("signOut error", async () => {
    (supabase.auth.signOut as any).mockResolvedValue({
      error: { message: "logout error" },
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signOut();
    });

    expect(enviarNoti).toHaveBeenCalledWith(
      "error",
      "Error al cerrar sesión",
      "logout error"
    );
  });

  // DISCORD SUCCESS
  it("discord login success", async () => {
    (supabase.auth.signInWithOAuth as any).mockResolvedValue({
      data: {},
      error: null,
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signInWithDiscord();
    });

    expect(
      supabase.auth.signInWithOAuth
    ).toHaveBeenCalled();
  });

  // GITHUB SUCCESS
  it("github login success", async () => {
    (supabase.auth.signInWithOAuth as any).mockResolvedValue({
      data: {},
      error: null,
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signInWithGithub();
    });

    expect(
      supabase.auth.signInWithOAuth
    ).toHaveBeenCalled();
  });

  // GET SESSION EXISTENTE
  it("carga sesión existente", async () => {
    (supabase.auth.getSession as any).mockResolvedValue({
      data: {
        session: {
          access_token: "token",
          user: {
            id: "1",
            email: "test@mail.com",
          },
        },
      },
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.user).not.toBeNull();
    });

    expect(result.current.user?.email).toBe(
      "test@mail.com"
    );
  });

  // SIGNED_IN SIN SESSION
  it("SIGNED_IN sin session", async () => {
    let cb: any;

    (supabase.auth.onAuthStateChange as any).mockImplementation(
      (fn: any) => {
        cb = fn;

        return {
          data: {
            subscription: {
              unsubscribe: vi.fn(),
            },
          },
        };
      }
    );

    renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await cb("SIGNED_IN", null);
    });

    expect(
      sincronizarConBackend
    ).not.toHaveBeenCalled();
  });

  // EARLY RETURN PENDING
  it("SIGNED_IN hace early return si no hay pending", async () => {
    let cb: any;

    (sessionStorage.getItem as any).mockReturnValue(
      null
    );

    (supabase.auth.onAuthStateChange as any).mockImplementation(
      (fn: any) => {
        cb = fn;

        return {
          data: {
            subscription: {
              unsubscribe: vi.fn(),
            },
          },
        };
      }
    );

    (sincronizarConBackend as any).mockResolvedValue(
      {}
    );

    renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await cb("SIGNED_IN", {
        user: {
          id: "1",
          email: "test@mail.com",
        },
        access_token: "token",
      });
    });

    expect(
      sessionStorage.removeItem
    ).not.toHaveBeenCalled();
  });

  // CLEANUP EFFECT
  it("desuscribe on unmount", () => {
    const unsubscribe = vi.fn();

    (supabase.auth.onAuthStateChange as any).mockReturnValue(
      {
        data: {
          subscription: {
            unsubscribe,
          },
        },
      }
    );

    const { unmount } = renderHook(
      () => useAuth(),
      { wrapper }
    );

    unmount();

    expect(unsubscribe).toHaveBeenCalled();
  });

  // useAuth FUERA PROVIDER
  it("lanza error fuera del provider", () => {
    const consoleSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() =>
      renderHook(() => useAuth())
    ).toThrow(
      /useauth debe usarse dentro de authprovider/i
    );

    consoleSpy.mockRestore();
  });
});