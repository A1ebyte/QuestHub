import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.js";
import { useNavigate } from "react-router-dom";
import "./login.css";
import { enviarNoti, typeToast } from "../../util/notificacionToast.jsx";
import { msjsSignUp, msjsLogin } from "../../const/mensajesUsuarios.js";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [msjLogIn, setMsjLogIn] = useState(0);
  const [msjSigUp, setMsjSigUp] = useState(0);
  const [fade, setFade] = useState(false);

  const {
    user,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithDiscord,
    signInWithGithub,
  } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setMsjLogIn(Math.floor(Math.random() * msjsLogin.length));
    setMsjSigUp(Math.floor(Math.random() * msjsSignUp.length));
  }, []);

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

  const handleDiscordLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const { error } = await signInWithDiscord();
      if (error) setError(error.message);
    } catch (err) {
      setError("Error al conectar con Discord");
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const { error } = await signInWithGithub();
      if (error) setError(error.message);
    } catch (err) {
      setError("Error al conectar con Github");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setFade(true);

    setTimeout(() => {
      setIsSignUp((prev) => !prev);
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setError("");
      setFade(false);
    }, 200);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
          return;
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

  if (user) navigate("/");
  else {
    return (
      <div className="InicioContenedor login-page">
        <div className={`login-layout ${fade ? "fade-out" : "fade-in"}`}>
          <div className="login-side">
            <h1 className="login-side-text top">
              {isSignUp
                ? msjsSignUp[msjSigUp].title
                : msjsLogin[msjLogIn].title}
            </h1>

            <div className="img-container">
              <img
                src={
                  isSignUp ? msjsSignUp[msjSigUp].img : msjsLogin[msjLogIn].img
                }
                alt="Decoración"
              />
            </div>

            <h2 className="login-side-text bottom">
              {isSignUp
                ? msjsSignUp[msjSigUp].mensj
                : msjsLogin[msjLogIn].mensj}
            </h2>
          </div>

          <div className="login-card">
            <div className="login-header">
              <h1 className="login-title">
                {isSignUp ? "Registrarse" : "Iniciar Sesión"}
              </h1>
              <button
                type="button"
                className="btn-switch-mode"
                onClick={toggleMode}
              >
                {isSignUp
                  ? "¿Ya tienes cuenta? Inicia sesión"
                  : "¿No tienes cuenta? Regístrate"}
              </button>
              {error && <div className="login-error">{error}</div>}
            </div>

            <div className="login-body">
              <form
                id="login-form"
                className="login-form"
                onSubmit={handleSubmit}
              >
                {!isSignUp && (
                  <>
                    <div className="auth-options">
                      <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="google-btn"
                      >
                        <img src="./Imagenes/Iconos/google.svg" alt="Google" />
                      </button>
                      <button
                        type="button"
                        onClick={handleDiscordLogin}
                        disabled={loading}
                        className="discord-btn"
                      >
                        <img
                          src="./Imagenes/Iconos/discord.svg"
                          alt="Discord"
                        />
                      </button>
                      <button
                        type="button"
                        onClick={handleGitHubLogin}
                        disabled={loading}
                        className="github-btn"
                      >
                        <img
                          src="./Imagenes/Iconos/github.svg"
                          alt="GitHub"
                          style={{ filter: "invert(0)" }}
                        />
                      </button>
                      {/*                     <button
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={loading}
                      className="btn-google"
                    >
                      <img
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                        alt="Google"
                      />
                    </button> */}
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
                      {showConfirm
                        ? "Ocultar contraseña"
                        : "Mostrar contraseña"}
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
  }
};

export default Login;
