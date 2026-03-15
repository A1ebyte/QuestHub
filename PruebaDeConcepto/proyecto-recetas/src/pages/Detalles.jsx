import { useEffect, useState } from "react";
import {useParams,Link} from 'react-router-dom'
import api from '../services/api'

const DetalleReceta = () => {
    const {id} = useParams();
    const [receta,setRecetas] = useState(null);
    const [loading,setLoading] = useState(true);

    useEffect(() => {
        api.get(`/recetas/${id}`)
            .then(res => {
                setRecetas(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(`Error al obtener la recetas`,err);
                setLoading(false);
            });
    },[id]);

    if(loading) return <div className="steam-loader">Cargar archivos Imperiales....</div>;
    if(!receta) return <div className="steam-loader">Receta no encontrada en el Gran Archivo</div>

    return (
        <main className="detalle-page">
            <div className="scroll-container">
                <header className="detalle-header">
                    <Link to='/' className="back-btn">← Volver al Archivo </Link>
                    <h1 className="receta-titulo-pro">{receta.nombre}</h1>
                    <div className="meta-info">
                        <span>Arquitecto: {receta.autor}</span>
                        <span>Tiempo de forja: {receta.tiempoCocina} min</span>
                    </div>
                </header>

                <section className="detalle-contenido">
                    <div className="receta-imagen-frame">
                        <img src= {receta.imagenUrl || 'https://via.placeholder.com/600x400?text=Plano+no+Disponible'} alt={receta.nombre}></img>  
                    </div>

                    <div className="receta-specs">
                        <div className="ingredientes-box">
                            <h3><span className="icon">⚙️</span>Componente Requiridos</h3>
                            <ul>
                                {receta.ingredientes.map((ing, index) =>(
                                    <li key={index}>{ing}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="paso-box">
                            <h3><span className="icon">📜</span> Protocolo de Ejecucion</h3>
                            <p className="paso-texto">{receta.paso}</p>
                        </div>
                    </div>
                </section>

                <footer className="detalle-actions">
                    <button className="wishlist-add">Añadir a Wishlist 💖</button>
                </footer>
            </div>
        </main>
    )
}

export default DetalleReceta