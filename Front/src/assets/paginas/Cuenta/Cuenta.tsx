import React, { useState, useEffect } from 'react';
import { enviarNoti, typeToast } from "../../util/notificacionToast";
import { confirmar } from "../../util/confirmacionSweet";
import { supabase } from '../../lib/supabase';
import Borrado from '../../componentes/Modal/Borrado'; // Importación del Modal de Borrado
import './Cuenta.css';

const Cuenta = () => {
    const [notificaciones, setNotificaciones] = useState(false);
    const [usuario, setUsuario] = useState<{ id: string, email: string } | null>(null);
    const [modalAbierto, setModalAbierto] = useState(false);

    useEffect(() => {
        const obtenerDatosUsuario = async () => {
            // Usamos el cliente de supabase
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                setUsuario({
                    id: session.user.id,
                    email: session.user.email || ""
                });

                try {
                    const response = await fetch(`http://localhost:8080/api/usuarios/preferencias/estado?id=${session.user.id}`);
                    //Si no es ok, lanzamos el error
                    if (!response.ok) {
                        throw new Error("Error en la respuesta del servidor");
                    }

                    const estadoBD = await response.json();
                    setNotificaciones(estadoBD);
                } catch (error) {
                    console.error("No se pudo cargar el estado inicial:", error);
                }
            }
        };
        obtenerDatosUsuario();
    }, []);

    const actualizarNotificaciones = async (valor: boolean) => {
        if (!usuario) return;

        try {
            const response = await fetch("http://localhost:8080/api/usuarios/preferencias", {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: usuario.id,
                    preferencia: valor
                })
            });

            if (response.ok) {
                setNotificaciones(valor);
                enviarNoti(
                    valor ? typeToast.SUCCESS : typeToast.WARN,
                    "Cambios realizados",
                    `Notificaciones ${valor ? 'activadas' : 'desactivadas'}`
                );
            }
        } catch (error) {
            enviarNoti(typeToast.ERROR, "Error", "No se pudo conectar con el servidor");
        }
    };

    const confirmarEliminar = async () => {
        setModalAbierto(false);


        enviarNoti(
            typeToast.ERROR,
            "ATENCIÓN",
            "Cuenta eliminada correctamente"
        );
        // Lógica de borrado aquí

    };

    return (
        <section>
            <div className="Info">
                <h1 className="titulo">Configuración de Cuenta</h1>

                <div className="bloque">
                    <h2>Información del Usuario</h2>
                    <div className="detalles">
                        <label className="etiqueta">Correo Electrónico</label>
                        <p className="datos">{usuario?.email}</p>
                    </div>
                </div>

                <div className="bloque">
                    <h2>Preferencias de Comunicación</h2>
                    <label className="contenedor-checkbox">
                        <input
                            type="checkbox"
                            checked={notificaciones}
                            onChange={(e) => actualizarNotificaciones(e.target.checked)}
                        />
                        <span className="opcion">Deseo recibir novedades y ofertas por correo electrónico</span>
                    </label>
                </div>

                <div className="bloque roja">
                    <h2>Supresión de cuenta</h2>
                    <p className="descripcion">
                        Si eliminas tu cuenta, se borrarán todos tus datos de Quest-Hub de forma permanente. Esta acción no se puede deshacer.
                    </p>
                    <button className="boton-eliminar" onClick={() => setModalAbierto(true)}>
                        Eliminar cuenta definitivamente
                    </button>
                </div>
            </div>

            <Borrado
                isOpen={modalAbierto}
                onClose={() => setModalAbierto(false)}
                onConfirm={confirmarEliminar}
            />
        </section>
    );
};

export default Cuenta;