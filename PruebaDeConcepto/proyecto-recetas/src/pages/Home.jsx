import { useState, useEffect } from "react";
import api from '../services/api';
import './Home.css'; // ¡Importante!

const Home = () => {
    const [recetas, setRecetas] = useState([]);
    const [busqueda, setBusqueda] = useState("");

    useEffect(() => {
        api.get('/recetas')
            .then(res => setRecetas(res.data))
            .catch(err => console.error("Error al traer recetas", err));
    }, []);

    const recetasFiltradas = recetas.filter(receta =>
        receta.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <main className="home-container">
            <header className="home-header">
                <h1 className="imperial-title">Gran Archivo de Recetas</h1>
                <div className="steam-line"></div>
            </header>

            <section className="controls-section">
                <div className="search-wrapper">
                    <input 
                        type="text"
                        className="imperial-input"
                        placeholder="Buscar en los archivos..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                    <span className="input-gear">⚙️</span>
                </div>

                <button className="wishlist-btn" onClick={() => console.log("Ir a Wishlist")}>
                    Ver Wishlist <span>💖</span>
                </button>
            </section>

            <section className="recetas-grid">
                {recetasFiltradas.length > 0 ? (
                    recetasFiltradas.map(receta => (
                        <div key={receta.id} className="receta-card">
                            <div className="card-border-decoration"></div>
                            <h3 className="receta-title">{receta.nombre}</h3>
                            <div className="receta-info">
                                <p><span>Autor:</span> {receta.autor}</p>
                                <p><span>Tiempo:</span> {receta.tiempoCocina} min</p>
                            </div>
                            <button className="detail-btn">Ver Detalles</button>
                        </div>
                    ))
                ) : (
                    <div className="no-results">
                        <p>Los archivos están vacíos. Intenta otra búsqueda.</p>
                    </div>
                )}
            </section>
        </main>
    );
};

export default Home;