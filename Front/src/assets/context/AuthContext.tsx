import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { enviarNoti, typeToast } from "../util/notificacionToast";
import { sincronizarConBackend } from "../servicios/Axios/authSync";

// 1. Definimos la interfaz del Contexto para tener autocompletado
interface AuthContextType {
  user: any;
  session: any;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signOut: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
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
        sincronizarConBackend(
          session.user.id,
          session.user.email || "",
          session.access_token,
        );
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
    const {data,error} = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) {
      enviarNoti(typeToast.ERROR,"Error al conectar con Google");
    }
    return {data,error};
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
      value={{ user, session, loading, signIn, signUp,signInWithGoogle, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};
