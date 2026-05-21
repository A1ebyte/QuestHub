import React, { createContext, useContext, useEffect, useState } from "react";
// @ts-ignore
import { supabase } from "../lib/supabase";
// @ts-ignore
import { enviarNoti, typeToast } from "../util/notificacionToast";
import { sincronizarConBackend } from "../servicios/Axios/authSync";
import { AuthContextType } from "../modelos/Users";
import { Session, User } from "@supabase/supabase-js";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSynced, setIsSynced] = useState(false);

  useEffect(() => {
    // Carga inicial de sesión
    supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
      const session = data.session;
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Escuchar cambios (Login, Logout, Registro)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: string, session:Session) => {
      setSession(session);
      setUser(session?.user ?? null);

      // 3. Sincronización automática: Si el evento es SIGNED_IN, avisamos a Spring Boot
      if (event === "SIGNED_IN" && session) {
        const pending = sessionStorage.getItem("login");
        try {
          await sincronizarConBackend({
            uuid: session.user.id,
            email: session.user.email || "",
            token: session.access_token,
          });
          
          setIsSynced(true);
        } catch (e) {
          console.error("Error sincronizando usuario", e);
          setIsSynced(false);
        }
        if (!pending && !user) return;
        console.log("Verificando inicio de sesión...", pending, user);
        enviarNoti(
          typeToast.SUCCESS,
          "Bienvenido a Quest-Hub",
          "Es hora de descubrir grandes ofertas",
        );
        sessionStorage.removeItem("login");
      }
      if (event === "SIGNED_OUT") {
        setIsSynced(false);
      }
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    error
      ? enviarNoti(typeToast.ERROR, "Error al iniciar sesión", error.message)
      : enviarNoti(
          typeToast.SUCCESS,
          "Bienvenido a Quest-Hub",
          "Es hora de descubrir grandes ofertas",
        );
    return { data, error };
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    error
      ? enviarNoti(typeToast.ERROR, "Error al crear cuenta", error.message)
      : enviarNoti(
          typeToast.SUCCESS,
          "Confirma tu email",
          "Te hemos enviado un correo de confirmación",
        );
    return { data, error };
  };

  // GOOGLE
  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) {
      enviarNoti(
        typeToast.ERROR,
        "Error al conectar con Google",
        error.message,
      );
    }
    return { data, error };
  };

  //DISCORD
  const signInWithDiscord = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) {
      enviarNoti(
        typeToast.ERROR,
        "Error al conectar con Discord",
        error.message,
      );
    }
    return { data, error };
  };

  //GITHUB
  const signInWithGithub = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) {
      enviarNoti(
        typeToast.ERROR,
        "Error al conectar con Github",
        error.message,
      );
    }
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    error
      ? enviarNoti(typeToast.ERROR, "Error al cerrar sesión", error.message)
      : enviarNoti(
          typeToast.SUCCESS,
          "Hasta luego",
          "Esperamos verte pronto",
        );
    return { error };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isSynced,
        signIn,
        signUp,
        signInWithGoogle,
        signInWithDiscord,
        signInWithGithub,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
