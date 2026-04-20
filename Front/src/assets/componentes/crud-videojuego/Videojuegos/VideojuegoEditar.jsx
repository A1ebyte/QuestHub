import React, { useState } from "react";
import "../../../estilos/OperacionesCrud.css";
import ServicioVideojuegos from "../../../servicios/Axios/ServicioVideojuegos.js";
import {enviarNoti,typeToast} from "../../../toolkit/notificacionToast.jsx";

function Editar({ videojuego, setVideojuegos, generos,  plataformas=[],
 onClose }) {
  // Almacenar los errores del formulario
  const [errores, setErrores] = useState({});

  // Almacenar los valores del formulario
  const [form, setForm] = useState({
    nombre: videojuego.nombre || "",
    description: videojuego.description || "",
    genre: videojuego.genre || [],
    fecha: videojuego.fecha || "",
    rating: videojuego.rating || "",
    platforms: videojuego.platforms || [],
    recomendacion: videojuego.recomendacion || "",
    image: videojuego.image || "",
    hoverImage: videojuego.hoverImage || "",
    trailer: videojuego.trailer || "",
    screenshots: videojuego.screenshots || [],
  });

  // Manejar cambios simples, agarro el evento e
  const gestionarCambio = (e) => {
    //los valores viene de quien llama al evento
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Manejar los generos con Checkboxes
  const gestionarGenero = (e) => {
    const { value, checked } = e.target;
    let nuevosGeneros = [...form.genre];
    if (checked) {
      nuevosGeneros.push(value);
    }
    // Quitar si desmarca
    else nuevosGeneros = nuevosGeneros.filter((g) => g !== value);
    setForm({
      ...form,
      genre: nuevosGeneros,
    });
  };

    const gestionarPlataformas = (e) => {
    const { value, checked } = e.target;
    let nuevasPlataformas = [...form.platforms];
    if (checked) {
      nuevasPlataformas.push(value);
    } else {
      nuevasPlataformas = nuevasPlataformas.filter((p) => p !== value);
    }
    setForm({ ...form, platforms: nuevasPlataformas });
  };

  const cantidadScreenshots = (e) => {
    const cantidad = parseInt(e.target.value);
    // Mantener los valores existentes y rellenar con "" si es menor
    const nuevosScreenshots = [...form.screenshots];
    while (nuevosScreenshots.length < cantidad) nuevosScreenshots.push("");
    while (nuevosScreenshots.length > cantidad) nuevosScreenshots.pop();
    setForm({
      ...form,
      screenshots: nuevosScreenshots,
    });
  };

  // Función de validación
  const validar = () => {
    const nuevosErrores = {};
    // Nombre
    if (!form.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio";
    }

    // Descripción
    if (!form.description.trim()) {
      nuevosErrores.description = "La descripción es obligatoria";
    }

    // Géneros
    if (!Array.isArray(form.genre) || form.genre.length === 0) {
      nuevosErrores.genre = "Debe seleccionar al menos un género";
    } else if (form.genre.length > 2) {
      nuevosErrores.genre = "No puede seleccionar más de 2 géneros";
    }

    // Plataformas
    if (!Array.isArray(form.platforms) || form.platforms.length === 0) {
      nuevosErrores.platforms = "Debe seleccionar al menos una plataforma";
    }

    // Fecha
    if (!form.fecha) {
      nuevosErrores.fecha = "La fecha es obligatoria";
    } else {
      const fechaIngresada = new Date(form.fecha);
      const fechaActual = new Date();

      // Normalizamos la fecha actual para ignorar la hora
      fechaActual.setHours(0, 0, 0, 0);

      if (fechaIngresada > fechaActual) {
        nuevosErrores.fecha = "La fecha no puede ser a futuro";
      }
    }

    // Rating
    if (!form.rating) {
      nuevosErrores.rating = "El rating es obligatorio";
    } else if (isNaN(form.rating) || form.rating < 0 || form.rating > 10) {
      nuevosErrores.rating = "El rating debe ser un número entre 0 y 10";
    }

    // Recomendación
    if (
      !Object.keys(Recomendacion.SortRecomendacion).includes(form.recomendacion)
    ) {
      nuevosErrores.recomendacion =
        "La recomendación debe ser: si, tal vez o no";
    }

    // Imagen principal
    if (!form.image.trim()) {
      nuevosErrores.image = "La imagen principal es obligatoria";
    }

    // Imagen hover
    if (!form.hoverImage.trim()) {
      nuevosErrores.hoverImage = "La imagen hover es obligatoria";
    }

    // Trailer
    if (!form.trailer.trim()) {
      nuevosErrores.trailer = "El trailer es obligatorio";
    }

    // Screenshots
    if (!Array.isArray(form.screenshots) || form.screenshots.length === 0) {
      nuevosErrores.screenshots = "Debe añadir al menos un screenshot";
    } else if (form.screenshots.length > 5) {
      nuevosErrores.screenshots = "No puede añadir más de 5 screenshots";
    } else if (form.screenshots.some((url) => !url.trim())) {
      nuevosErrores.screenshots = "Todos los screenshots deben tener una URL";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Función para manejar el envío del formulario
  const enviarFormulario = (e) => {
    //evita el comportamiento por defecto
    e.preventDefault();

    // Validar antes de enviar
    if (validar()) {
      console.clear();
      console.log("Formulario Enviado", form);

      const editar = {
        nombre: form.nombre,
        description: form.description,
        genre: form.genre,
        fecha: form.fecha,
        rating: form.rating,
        platforms: form.platforms,
        recomendacion: form.recomendacion,
        image: form.image,
        hoverImage: form.hoverImage,
        trailer: form.trailer,
        screenshots: form.screenshots,
      };

      //Enviar por Axios al Json de BD
      ServicioVideojuegos.actualizarJuego(videojuego.id, editar)
        .then((response) => {
          enviarNoti(typeToast.SUCCESS, "Videojuego editado correctamente");

          //luego de actualizar el juego lo actualizamos en la app con el set
          ServicioVideojuegos.getAll().then((response) => {
            setVideojuegos(response.data);
          });
          // //Cerramos el modal
          onClose();
        })
        .catch((error) => {
          enviarNoti(typeToast.ERROR, "Error al editar el videojuego");
        });
      return;
    }
    enviarNoti(typeToast.ERROR, "Formulario inválido");
  };

  return (
    <form onSubmit={enviarFormulario} className="CRUDContenedor">
      {/* Nombre */}
      <span>
        {errores.nombre && <p className="error">{errores.nombre}</p>}
        <label>Nombre</label>
      </span>
      <input
        id="nombre"
        type="text"
        name="nombre"
        value={form.nombre}
        onChange={gestionarCambio}
        placeholder="Escribe el nombre del juego"
      />

      {/* Descripción */}
      <span>
        {errores.description && <p className="error">{errores.description}</p>}
        <label>Descripción </label>
      </span>

      <textarea
        id="description"
        name="description"
        value={form.description}
        onChange={gestionarCambio}
        placeholder="Escribe una breve descripción"
      />

      {/* Géneros */}
      <span>
        {errores.genre && <p className="error">{errores.genre}</p>}
        <label>Géneros (elige 1 o 2) </label>
      </span>

      <div className="checkbox-group">
        {generos.map((genero) => (
          <label key={genero.nombre}>
            <input
              type="checkbox"
              name="genre"
              value={genero.nombre}
              checked={form.genre.includes(genero.nombre)}
              onChange={gestionarGenero} // bloquea si ya esta
            />
            {genero.nombre}
          </label>
        ))}
      </div>

      {/* Plataformas */}
      <span>
        {errores.platforms && <p className="error">{errores.platforms}</p>}
        <label>Plataformas (separadas por coma) </label>
      </span>

      <div className="checkbox-group">
        {plataformas.map((plat) => (
          <label key={plat.nombre}>
            <input
              type="checkbox"
              name="platforms"
              value={plat.nombre}
              checked={form.platforms.includes(plat.nombre)}
              onChange={gestionarPlataformas}
            />
            {plat.nombre}
          </label>
        ))}
      </div>

      {/* Fecha */}
      <span>
        {errores.fecha && <p className="error">{errores.fecha}</p>}
        <label>Fecha de lanzamiento </label>
      </span>

      <input
        id="fecha"
        type="date"
        name="fecha"
        value={form.fecha}
        onChange={gestionarCambio}
      />

      {/* Rating */}
      <span>
        {errores.rating && <p className="error">{errores.rating}</p>}
        <label>Rating (0-10) </label>
      </span>

      <input
        id="rating"
        type="number"
        name="rating"
        value={form.rating}
        onChange={gestionarCambio}
        min="0"
        max="10"
        step="0.1"
      />

      {/* Recomendación */}
      <span>
        {errores.recomendacion && (
          <p className="error">{errores.recomendacion}</p>
        )}
        <label>Recomendación </label>
      </span>

      <select
        id="recomendacion"
        name="recomendacion"
        value={form.recomendacion}
        onChange={gestionarCambio}
      >
        <option value="">Seleccione...</option>
        {Object.keys(Recomendacion.SortRecomendacion).map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>

      {/* Imagen principal */}
      <span>
        {errores.image && <p className="error">{errores.image}</p>}
        <label>Imagen principal (URL) </label>
      </span>

      <input
        id="image"
        type="text"
        name="image"
        value={form.image}
        onChange={gestionarCambio}
        placeholder="URL de la imagen principal"
      />

      {/* Imagen hover */}
      <span>
        {errores.hoverImage && <p className="error">{errores.hoverImage}</p>}
        <label>Imagen hover (URL) </label>
      </span>

      <input
        id="hoverImage"
        type="text"
        name="hoverImage"
        value={form.hoverImage}
        onChange={gestionarCambio}
        placeholder="URL de la imagen hover"
      />

      {/* Trailer */}
      <span>
        {errores.trailer && <p className="error">{errores.trailer}</p>}
        <label>Trailer (URL) </label>
      </span>
      <input
        id="trailer"
        type="text"
        name="trailer"
        value={form.trailer}
        onChange={gestionarCambio}
        placeholder="URL del trailer"
      />

      {/* Cantidad de screenshots */}
      <span>
        {errores.screenshots && <p className="error">{errores.screenshots}</p>}
        <label>Cantidad de screenshots (1-5) </label>
      </span>

      <select
        id="cantidadScreenshots"
        value={form.screenshots.length}
        onChange={cantidadScreenshots}
      >
        <option value={1}>1</option>
        <option value={2}>2</option>
        <option value={3}>3</option>
        <option value={4}>4</option>
        <option value={5}>5</option>
      </select>
      {/* Inputs dinámicos de screenshots */}
      {form.screenshots.map((url, index) => (
        <>
          <label>Screenshot {index + 1}</label>
          <input
            id={`screenshot-${index}`}
            type="text"
            value={url}
            onChange={(e) => {
              const nuevosScreenshots = [...form.screenshots];
              nuevosScreenshots[index] = e.target.value;
              setForm({ ...form, screenshots: nuevosScreenshots });
            }}
            placeholder={`URL del screenshot ${index + 1}`}
          />
        </>
      ))}

      {/* Botón de envío */}
      <br />
      <button type="submit" className="boton-secundario">
        Guardar cambios
      </button>
    </form>
  );
}

export default Editar;
