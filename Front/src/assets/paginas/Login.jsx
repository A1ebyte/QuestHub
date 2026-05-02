import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../estilos/Paginas/login.css";

const Login = () => {
  const [direction, setDirection] = useState("right");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSignUp, setIsSignUp] = useState(false);

  // error: Mensaje de error a mostrar al usuario
  const [error, setError] = useState("");

  // loading: Estado de carga durante peticiones a la API
  const [loading, setLoading] = useState(false);

  // useAuth: Hook personalizado para acceder a las funciones de autenticación
  // signIn ->  Función para iniciar sesión
  // signUp ->  Función para registrarse
  const { signIn, signUp,signInWithGoogle } = useAuth();

  // Hook de React Router para navegar entre rutas
  const navigate = useNavigate();

 const handleGoogleLogin = async () => {
  setError("");
  setLoading(true);
  try {
    const {error} = await signInWithGoogle();
    if (error) setError(error.message);
  } catch(err) {
    setError("Error al conectar con Google");
  } finally {
    setLoading(false);
  }
 };
 
 
 
  /**
   * handleSubmit: Maneja el envío del formulario   *
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let result; // Variable para almacenar resultado de la operación

      // Lógica para REGISTRO (sign up)
      if (isSignUp) {
        result = await signUp(email, password);

        if (!result.error && result.data?.user?.identities?.length === 0) {
          setIsSignUp(false); // Cambia a modo login después del registro
          return;
        }
        // Si el registro es exitoso (sin errores)
        if (!result.error) {
          setIsSignUp(false); // Cambia a modo login después del registro
        }
      }
      // Lógica para inicio de sesión (LOGIN - sign in)
      else {
        result = await signIn(email, password);

        // Si el inicio de sesión es exitoso
        if (!result.error) {
          navigate("/"); // Redirige al usuario a la página principal
        }
      }

      // Si hubo un error en la operación, lo mostramos
      if (result.error) {
        setError(result.error.message);
      }
    } catch (err) {
      // Manejo de errores inesperados (errores de red, etc.)
      setError("Ocurrió un error inesperado");
    } finally {
      // Siempre desactiva el estado de carga, independientemente del resultado
      setLoading(false);
    }
  };

  return (
    <div className="InicioContenedor">
      <div
        key={isSignUp ? "signup" : "login"}
        className={`login-card slide-${direction}`}
      >
        {" "}
        <h1>{isSignUp ? "Registrarse" : "Iniciar Sesión"}</h1>
        <div className={`login-grid ${isSignUp ? "reverse" : ""}`}>
          <div className="login-left">
            <form onSubmit={handleSubmit}>
              {/* Mostrar mensaje de error si existe */}
              {error && <div className="error-message">{error}</div>}
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="tu@email.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="boton-secundario"
              >
                {loading
                  ? "Cargando..."
                  : isSignUp
                    ? "Registrarse"
                    : "Iniciar Sesión"}
              </button>

              <div className="divider"><span>o también</span></div>
              
              <button 
                type="button" 
                onClick={handleGoogleLogin} 
                disabled={loading}
                className="boton-google"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
                Continuar con Google
              </button>
            </form>
            <div className="login-footer">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setDirection(isSignUp ? "left" : "right");
                  setEmail("");
                  setPassword("");
                  setError("");
                }}
                className="toggle-button"
              >
                {isSignUp
                  ? "¿Ya tienes cuenta? Inicia sesión"
                  : "¿No tienes cuenta? Regístrate"}
              </button>
            </div>
          </div>

          <div className="login-right">
            <img src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExYTV3YjRudzNob2drMnpsaGV4ZTd1aWlyMGkyYTAzcWRkYXZld3h1YyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/UQ1EI1ML2ABQdbebup/giphy.gif" alt="Decoración" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
