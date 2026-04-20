import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { enviarNoti,typeToast } from '../toolkit/notificacionToast.jsx'

// Crear un contexto de autenticación con un objeto vacío como valor inicial
// Este contexto permitirá compartir el estado de autenticación en toda la aplicación
const AuthContext = createContext({})

// Hook personalizado para acceder fácilmente al contexto de autenticación
// Desde cualquier componente podremos usar: const { user, signIn, etc } = useAuth()
export const useAuth = () => useContext(AuthContext)

// Proveedor de autenticación que envolverá nuestra aplicación
// Recibe children (componentes hijos) como prop
export const AuthProvider = ({ children }) => {
  // Estado para almacenar el usuario actual
  const [user, setUser] = useState(null)
  
  // Estado para indicar si estamos cargando la información de autenticación
  const [loading, setLoading] = useState(true)
  
  // Estado para almacenar la sesión completa (contiene metadata adicional además del usuario)
  const [session, setSession] = useState(null)

  // Efecto que se ejecuta una vez al montar el componente
  useEffect(() => {
    // 1. Verificar si hay una sesión activa al cargar la aplicación
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)           // Guardar la sesión completa
      setUser(session?.user ?? null) // Guardar el usuario o null si no hay sesión
      setLoading(false)             // Indicar que la carga inicial ha terminado
    })

    // 2. Suscribirse a cambios en el estado de autenticación
    // Esto escuchará eventos como: SIGNED_IN, SIGNED_OUT, USER_UPDATED, etc.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false) // Asegurarse de que loading sea false después de cualquier cambio
    })

    // 3. Cleanup: cancelar la suscripción cuando el componente se desmonte
    return () => subscription.unsubscribe()
  }, []) // Array de dependencias vacío = se ejecuta solo al montar

  // Función para iniciar sesión con email y contraseña
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error==null){
      enviarNoti(typeToast.SUCCESS,("Bienvenido Usuario"))
    }else{
      enviarNoti(typeToast.ERROR,("Error al iniciar sesion"))
    }
    return { data, error } // Retornar datos y posible error para manejo en el componente
  }

  // Función para registrar un nuevo usuario
  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      // Nota: Se podrían agregar opciones adicionales aquí como:
      // options: { emailRedirectTo: 'https://ejemplo.com/welcome' }
    })
    if (error==null){
      enviarNoti(typeToast.SUCCESS,("Confirma tu email"))
    }else{
      enviarNoti(typeToast.ERROR,("Error al crear cuenta"))
    }
    return { data, error }
  }

  // Función para cerrar sesión
  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error==null){
      enviarNoti(typeToast.SUCCESS,("Adios Usuario"))
    }else{
      enviarNoti(typeToast.ERROR,("Error al cerrar sesion"))
    }
    return { error } // Retornar posible error
  }

  // Objeto con todos los valores que estarán disponibles en el contexto
  const value = {
    user,      // Usuario actual o null
    session,   // Sesión completa o null
    loading,   // Booleano que indica si está cargando
    signIn,    // Función para iniciar sesión
    signUp,    // Función para registrarse
    signOut,   // Función para cerrar sesión
  }

  // Proveer el contexto a toda la aplicación
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
