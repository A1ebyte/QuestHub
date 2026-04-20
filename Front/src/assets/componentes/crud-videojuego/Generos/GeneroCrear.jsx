import React, { useState } from "react";
import ServicioGeneros from "../../../servicios/Axios/ServicioGeneros.js";
import { enviarNoti, typeToast } from "../../../toolkit/notificacionToast.jsx";
import "../../../estilos/OperacionesCrud.css";

function GeneroCrear({ generos = [], setGeneros, onClose }) {
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState("");

  const validar = () => {
    if (!nombre.trim()) {
      setError("El nombre es obligatorio");
      return false;
    }
    if (generos.some((g) => g.nombre.toLowerCase() === nombre.toLowerCase())) {
      setError("Ese género ya existe");
      return false;
    }
    setError("");
    return true;
  };

  const enviarFormulario = (e) => {
    e.preventDefault();
    if (!validar()) {
      enviarNoti(typeToast.ERROR, "Formulario inválido ❌");
      return;
    }

    const nuevoGenero = { nombre: nombre.trim() };

    ServicioGeneros.crearEntrada(nuevoGenero)
      .then((res) => {
        enviarNoti(typeToast.SUCCESS, "Género creado correctamente ✅");
        setGeneros([...generos, { ...nuevoGenero, id: res.data.id }]);
        setNombre("");
        onClose();
      })
      .catch(() => {
        enviarNoti(typeToast.ERROR, "Error al crear el género ❌");
      });
  };

  return (
    <form onSubmit={enviarFormulario} className="CRUDContenedor">
      <span>
        {error && <p className="error">{error}</p>}
        <label>Nombre del Género</label>
      </span>
      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Ej: RPG, Acción, Indie..."
      />

      <br />
      <button type="submit" className="boton-secundario">
        Crear género
      </button>
    </form>
  );
}

export default GeneroCrear;
