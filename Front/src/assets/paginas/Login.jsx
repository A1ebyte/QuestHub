import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../estilos/Paginas/login.css";
import { enviarNoti, typeToast } from "../util/notificacionToast.jsx";

const Login = () => {
  const [direction, setDirection] = useState("right");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) setError(error.message);
    } catch (err) {
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

if (isSignUp && password !== confirmPassword) {
  setError("Passwords doesn't match");
  enviarNoti(
    typeToast.ERROR,
    "Error al crear cuenta",
    "Passwords doesn't match",
  );
  setLoading(false);
  return;
}

    try {
      let result;
      if (isSignUp) {
        result = await signUp(email, password);

        if (!result.error && result.data?.user?.identities?.length === 0) {
          setIsSignUp(false);
          return;
        }
        if (!result.error) {
          setIsSignUp(false);
        }
      } else {
        result = await signIn(email, password);

        if (!result.error) {
          navigate("/");
        }
      }

      if (result.error) {
        setError(result.error.message);
      }
    } catch (err) {
      setError("Ocurrió un error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="InicioContenedor login-page">
      <div className="login-layout">
        <div className="login-side">
          <p className="login-side-text top">
            {isSignUp
              ? "Únete a la aventura y crea tu cuenta"
              : "Bienvenido de vuelta, gamer"}
          </p>

          <img
            src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExYTV3YjRudzNob2drMnpsaGV4ZTd1aWlyMGkyYTAzcWRkYXZld3h1YyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/UQ1EI1ML2ABQdbebup/giphy.gif"
            alt="Decoración"
          />

          <p className="login-side-text bottom">
            {isSignUp
              ? "Empieza a construir tu perfil ahora"
              : "Accede a tu cuenta y continúa"}
          </p>
        </div>

        <div className="login-card">
          {/* HEADER FIJO */}
          <div className="login-header">
            <h1 className="login-title">
              {isSignUp ? "Registrarse" : "Iniciar Sesión"}
            </h1>
            <button
              type="button"
              className="btn-switch-mode"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setEmail("");
                setPassword("");
                setConfirmPassword("");
                setError("");
              }}
            >
              {isSignUp
                ? "¿Ya tienes cuenta? Inicia sesión"
                : "¿No tienes cuenta? Regístrate"}
            </button>
            {error && <div className="login-error">{error}</div>}
          </div>

          {/* BODY */}
          <div className="login-body">
            <form id="login-form" className="login-form" onSubmit={handleSubmit}>
              {!isSignUp && (
                <>
                  <div className="auth-options">
                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={loading}
                      className="btn-google"
                    >
                      <img
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                        alt="Google"
                      />
                    </button>
                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={loading}
                      className="btn-google"
                    >
                      <img
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                        alt="Google"
                      />
                    </button>
                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={loading}
                      className="btn-google"
                    >
                      <img
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                        alt="Google"
                      />
                    </button>
                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={loading}
                      className="btn-google"
                    >
                      <img
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                        alt="Google"
                      />
                    </button>
                  </div>
                  <div className="divider">
                    <span>o</span>
                  </div>
                </>
              )}

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Contraseña</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="false"
                />

                <span
                  className="toggle-text"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                </span>
              </div>

              {isSignUp && (
                <div className="form-group">
                  <label>Confirmar contraseña</label>
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="false"
                    required
                  />

                  <span
                    className="toggle-text"
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    {showConfirm ? "Ocultar contraseña" : "Mostrar contraseña"}
                  </span>
                </div>
              )}
            </form>
          </div>

          <div className="login-footer">
            <button
              type="submit"
              form="login-form"
              disabled={loading}
              className="btn-Usuario"
            >
              {loading ? "Cargando..." : isSignUp ? "Registrarse" : "Entrar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
