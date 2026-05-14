import React, { useState, useEffect } from "react";
import { colores, enviarNoti, typeToast } from "../../util/notificacionToast";
import { confirmar } from "../../util/confirmacionSweet";
import ServicioUsuarios from "../../servicios/Axios/ServicioUsuarios";
import { useAuth } from "../../context/AuthContext";
import "./Cuenta.css";
import { toastICONS } from "../../const/iconos";

const Cuenta = () => {
  const [notificaciones, setNotificaciones] = useState(false);
  const { session, user } = useAuth();

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
    
    ServicioUsuarios.patchRecibirNotificaciones(session.user.id,valor)
    .then(()=>{
        setNotificaciones(valor);
        enviarNoti(typeToast.SUCCESS,"Notificaciones cambiadas","Se han cambiado de manera correcta", toastICONS.MAIL(colores.TEAL))
    })
    .catch()
  };

  const confirmarEliminar = async () => {
    const resultado = await confirmar(
      "ATENCIÓN",
      "¿Estás seguro de eliminar tu cuenta? Esta acción es irreversible.",
    );

    if (resultado.isConfirmed) {
      enviarNoti(typeToast.ERROR, "ATENCIÓN", "Cuenta eliminada correctamente");
      // Lógica de borrado aquí
    }
  };

  return (
    <div className="contenedor-principal">
      <h1 className="titulo-pagina">Configurar Cuenta</h1>

      <div className="tarjeta">
        <h2 className="subtitulo">Información del Usuario</h2>
        <div className="info">
          <label className="etiqueta">Nombre:</label>
          <p className="datos">Usuario</p>
          <label className="etiqueta">Apellidos:</label>
          <p className="datos">Primer Segundo</p>
          <label className="etiqueta">Correo Electrónico</label>
          <p className="datos">{user?.email}</p>
        </div>
      </div>

      <div className="tarjeta">
        <h2 className="subtitulo">Preferencias</h2>
        <div className="opciones">
          <label className="contenedor-checkbox">
            <input
              type="checkbox"
              checked={notificaciones}
              onChange={(e) => actualizarNotificaciones(e.target.checked)}
            />
            <span className="opcion">
              Deseo recibir novedades y ofertas por correo electrónico
            </span>
          </label>
        </div>
      </div>

      <div className="tarjeta tarjeta-roja">
        <h2 className="subtitulo texto-rojo">Suspresión de cuenta</h2>
        <p className="descripcion">
          Si eliminas tu cuenta, se borrarán todos tus datos de Quest-Hub de
          forma permanente.
        </p>
        <button className="boton-eliminar" onClick={confirmarEliminar}>
          Eliminar cuenta
        </button>
      </div>
    </div>
  );
};

export default Cuenta;
