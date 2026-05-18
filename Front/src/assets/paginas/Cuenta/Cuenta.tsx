import React, { useState, useEffect } from "react";
import { colores, enviarNoti, typeToast } from "../../util/notificacionToast";
import { confirmar } from "../../util/confirmacionSweet";

import ServicioUsuarios from "../../servicios/Axios/ServicioUsuarios";
import { useAuth } from "../../context/AuthContext";
import "./Cuenta.css";
import { toastICONS } from "../../const/iconos";
import Borrado from '../../componentes/Modal/Borrado'; // Importación del Modal de Borrado

const Cuenta = () => {
    const [notificaciones, setNotificaciones] = useState(false);
    const { session, user } = useAuth();
    const [modalAbierto, setModalAbierto] = useState(false);

    useEffect(() => {
        if (session) {
            ServicioUsuarios.getRecibirNotificaciones(session.user.id)
                .then((res) => {
                    setNotificaciones(res.data);
                })
                .catch();
        }
    }, []);

    const actualizarNotificaciones = (valor: boolean) => {
        if (!session) return;

        ServicioUsuarios.patchRecibirNotificaciones(session.user.id, valor)
            .then(() => {
                setNotificaciones(valor);
                enviarNoti(typeToast.SUCCESS, "Notificaciones cambiadas", "Se han cambiado de manera correcta", toastICONS.MAIL(colores.TEAL))
            })
            .catch()
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

    //para sacar el nombre usuario
    const nombreUsuario = user?.email ? user.email.split('@')[0] : "";

    return (
        <>
            <div className="InicioContenedor Info">
                <h1 className="titulo">Configuración de Cuenta</h1>

                <div className="bloque">
                    <h2>Información del Usuario</h2>
                    <div className="detalles">
                        <div className="campo-info">
                            <label className="etiqueta">Usuario</label>
                            <p className="datos">{nombreUsuario}</p>
                        </div>
                        
                        <div className="campo-info">
                            <label className="etiqueta">Correo Electrónico</label>
                            <p className="datos">{user?.email}</p>
                        </div>
                    </div>
                </div>

                <div className="bloque">
                    <h2>Preferencias de Comunicación</h2>
                    <div className="detalles">
                        <label className="contenedor-checkbox">
                            <input
                                type="checkbox"
                                checked={notificaciones}
                                onChange={(e) => actualizarNotificaciones(e.target.checked)}
                            />
                            <span className="opcion">Deseo recibir novedades y ofertas por correo electrónico</span>
                        </label>
                    </div>
                </div>

                <div className="bloque roja">
                    <h2>Eliminar cuenta</h2>
                    <p className="descripcion">
                        Al eliminar tu cuenta, se borrarán todos tus datos de forma permanente. Esta acción no se puede deshacer.
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
        </>
    );
};

export default Cuenta;
