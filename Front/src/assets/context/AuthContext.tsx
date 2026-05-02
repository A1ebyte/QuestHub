import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
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

  useEffect(() => {
    // Carga inicial de sesión
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Escuchar cambios (Login, Logout, Registro)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // 3. Sincronización automática: Si el evento es SIGNED_IN, avisamos a Spring Boot
      if (event === "SIGNED_IN" && session) {
        sincronizarConBackend({
          uuid: session.user.id,
          email: session.user.email || "",
          token: session.access_token,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    error
      ? enviarNoti(typeToast.ERROR, "Error al iniciar sesión")
      : enviarNoti(typeToast.SUCCESS, "Bienvenido Usuario");
    return { data, error };
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    error
      ? enviarNoti(typeToast.ERROR, "Error al crear cuenta")
      : enviarNoti(typeToast.SUCCESS, "Confirma tu email");
    return { data, error };
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) {
      enviarNoti(typeToast.ERROR, "Error al conectar con Google");
    }
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    error
      ? enviarNoti(typeToast.ERROR, "Error al cerrar sesión")
      : enviarNoti(typeToast.SUCCESS, "Adiós Usuario");
    return { error };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
