import { useState } from "react";
import api from '../services/api';
import { Link } from "react-router-dom";
import './Registro.css'; // ¡Importante!

const Registro = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Corregido: 'registro' en lugar de 'regristro'
            const response = await api.post('/usuarios/registro', formData);
            alert("¡Ciudadano registrado con éxito!");
            console.log(response.data);
        } catch (error) {
            console.error("Error al registrar:", error);
            alert("Fallo en la matriz de registro imperial...");
        }
    };

    return (
        <section className="registro-page">
            <div className="registro-frame">
                <div className="imperial-seal">⚙️</div>
                <h2 className="registro-title">Censo del Imperio</h2>
                
                <form className="registro-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input
                            name="username"
                            placeholder="Nombre de Usuario"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <input
                            name="email"
                            type="email"
                            placeholder="Correo Electrónico"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <input
                            name="password"
                            type="password"
                            placeholder="Contraseña"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="submit-btn">
                        Sellar Alistamiento
                    </button>
                </form>

                <div className="login-link-container">
                    <p>¿Ya eres ciudadano?</p>
                    <Link to='/Login' className="login-link">Iniciar Sesión</Link>
                </div>
            </div>
        </section>
    );
} 

export default Registro;