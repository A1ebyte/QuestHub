import { useState } from "react";
import api from '../services/api';
import { Link } from "react-router-dom";
import './Login.css'; // ¡La clave del éxito!

const Login = () => {
    const [loginData, setLoginData] = useState({
        username: '',
        password: ''
    });

    const handleChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        // Aquí es donde en el futuro validaremos contra Spring Boot
        console.log('Solicitando acceso para: ', loginData.username);
    };

    return (
        <section className="login-container">
            <div className="login-box">
                <div className="login-header">
                    <div className="pressure-gauge"></div>
                    <h2>Acceso Imperial</h2>
                </div>
                
                <form className="login-form" onSubmit={handleLogin}>
                    <div className="input-field">
                        <label>Identidad</label>
                        <input 
                            name="username" 
                            placeholder="Nombre de usuario" 
                            onChange={handleChange} 
                            required
                        />
                    </div>
                    
                    <div className="input-field">
                        <label>Salvoconducto</label>
                        <input 
                            name="password" 
                            type="password" 
                            placeholder="********" 
                            onChange={handleChange} 
                            required
                        />
                    </div>

                    <button type="submit" className="login-btn">
                        Activar Mecanismo
                    </button>
                </form>

                <div className="login-footer">
                    <span>¿Nuevo en el imperio?</span>
                    <Link to='/Registro' className="link-to-reg">Solicitar Alistamiento</Link>
                </div>
            </div>
        </section>
    );
}

export default Login;