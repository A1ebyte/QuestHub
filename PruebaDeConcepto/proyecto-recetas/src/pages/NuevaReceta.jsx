import { useState } from "react";
import api from "../services/api";
import './NuevaReceta.css'; // ¡Conectando las calderas!

const NuevaReceta = () => {
    const [recetas, setRecetas] = useState({
        nombre: '',
        autor: '',
        tiempoCocina: '',
        ingredientes: '',
        pasos: ''
    });

    const handleChange = (e) => {
        setRecetas({ ...recetas, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const recetaParaEnviar = {
            ...recetas,
            ingredientes: recetas.ingredientes.split(',').map(i => i.trim()),
            tiempoCocina: parseInt(recetas.tiempoCocina)
        };

        try {
            await api.post('/recetas', recetaParaEnviar);
            alert('¡Receta archivada en la Gran Biblioteca Imperial!');
        } catch (error) {
            console.error('Error al guardar recetas', error);
            alert("Presión insuficiente en las calderas (Error de conexión).");
        }
    };

    return (
        <section className="nueva-receta-page">
            <div className="blueprint-container">
                <header className="blueprint-header">
                    <div className="rivet"></div>
                    <div className="rivet"></div>
                    <h2>Registro de Patente Culinaria</h2>
                </header>

                <form className="blueprint-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <input 
                            name="nombre" 
                            className="imperial-input" 
                            placeholder="Nombre del Invento (Plato)" 
                            onChange={handleChange} 
                            required 
                        />
                        <input 
                            name="autor" 
                            className="imperial-input" 
                            placeholder="Arquitecto (Autor)" 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div className="form-row">
                        <input 
                            name="tiempoCocina" 
                            type="number" 
                            className="imperial-input" 
                            placeholder="Ciclo de Combustión (min)" 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <textarea 
                        name="ingredientes" 
                        className="imperial-textarea" 
                        placeholder="Componentes (separados por comas...)"
                        onChange={handleChange}
                        required
                    ></textarea>

                    <textarea
                        name="pasos"
                        className="imperial-textarea large"
                        placeholder="Protocolo de ejecución paso a paso..."
                        onChange={handleChange}
                        required
                    ></textarea>

                    <button type="submit" className="forge-btn">
                        Forjar Receta ⚙️
                    </button>
                </form>
                <div className="blueprint-footer">
                    <div className="rivet"></div>
                    <div className="rivet"></div>
                </div>
            </div>
        </section>
    );
}

export default NuevaReceta;