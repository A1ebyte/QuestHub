import React, { useEffect, useState } from "react";
import ServicioVideojuegos from "../servicios/Axios/ServicioVideojuegos.js";
import ServicioGeneros from "../servicios/Axios/ServicioGeneros.js";

import VideojuegoCrear from "../componentes/crud-videojuego/Videojuegos/VideojuegoCrear.jsx";
import VideojuegoEditar from "../componentes/crud-videojuego/Videojuegos/VideojuegoEditar.jsx";
import VideojuegoConsultar from "../componentes/crud-videojuego/Videojuegos/VideojuegoConsultar.jsx";
import VideojuegoBorrar from "../componentes/crud-videojuego/Videojuegos/VideojuegoBorrar.js";

import GenerosConsultar from "../componentes/crud-videojuego/Generos/GenerosConsultar.jsx";
import GenerosBorrar from "../componentes/crud-videojuego/Generos/GenerosBorrar.js";
import GeneroCrear from "../componentes/crud-videojuego/Generos/GeneroCrear.jsx";

import Modal from "../componentes/Modal.jsx";
import Buscador from "../componentes/Buscador.jsx";

import "../estilos/Paginas/Admin.css";

const AdminVideojuegos = ({videojuegos, setVideojuegos,generos, setGeneros,plataformas, setPlataformas}) => {

  const [videojuegoSeleccionado, setVideojuegoSeleccionado] = useState(null);
  const [generoSeleccionado, setGeneroSeleccionado] = useState(null);
  const [plataformaSeleccionada, setPlataformaSeleccionada] = useState(null);

  const [filtroJuego, setFiltroJuego] = useState("");
  const [filtroGenero, setFiltroGenero] = useState("");
  const [filtroPlataforma, setFiltroPlataforma] = useState("");

  const [seccionActiva, setSeccionActiva] = useState("videojuegos");
  // "videojuegos" | "generos" | "plataformas"

  const [modals, setModals] = useState({
    juegoCrear: false,
    juegoEditar: false,
    generoCrear: false,
    plataformaCrear: false,
  });

  const gestionarModal = (tipoModal, estadoAbierto) => {
    setModals((prev) => ({ ...prev, [tipoModal]: estadoAbierto }));
  };

  //#region useEffect
  useEffect(() => {
    const juego = videojuegos.find(
      (v) => v.nombre.toLowerCase() === filtroJuego.toLowerCase(),
    );

    if (!filtroJuego.trim() || !juego) {
      setVideojuegoSeleccionado(null);
      return;
    }

    ServicioVideojuegos.getById(juego.id).then((res) =>
      setVideojuegoSeleccionado(res.data),
    );
  }, [filtroJuego, videojuegos]);

  useEffect(() => {
    const genero = generos.find(
      (g) => g.nombre.toLowerCase() === filtroGenero.toLowerCase(),
    );

    if (!filtroGenero.trim() || !genero) {
      setGeneroSeleccionado(null);
      return;
    }

    ServicioGeneros.getById(genero.id).then((res) =>
      setGeneroSeleccionado(res.data),
    );
  }, [filtroGenero, generos]);

  useEffect(() => {
    const plataforma = plataformas.find(
      (g) => g.nombre.toLowerCase() === filtroPlataforma.toLowerCase(),
    );

    if (!filtroPlataforma.trim() || !plataforma) {
      setPlataformaSeleccionada(null);
      return;
    }    
    ServicioPlataformas.getById(plataforma.id).then((res) =>
      setPlataformaSeleccionada(res.data),
    );
  }, [filtroPlataforma, plataformas]);
    //#endregion

  //#region Acciones
  const editarVideojuego = () =>
    videojuegoSeleccionado && gestionarModal("juegoEditar", true);

  const borrarVideojuego = () =>
    videojuegoSeleccionado &&
    VideojuegoBorrar(videojuegoSeleccionado, videojuegos, setVideojuegos);

  const crearVideojuego = () => gestionarModal("juegoCrear", true);

  const crearGenero = () => gestionarModal("generoCrear", true);
  const borrarGenero = () =>
    generoSeleccionado &&
    GenerosBorrar(generoSeleccionado, generos, setGeneros);

  const crearPlataforma = () => gestionarModal("plataformaCrear", true);
  const borrarPlataforma = () =>
    plataformaSeleccionada &&
    PlataformaBorrar(plataformaSeleccionada, plataformas, setPlataformas);
  //#endregion

  return (
    <div className="InicioContenedor">
      <div className="Admin">
        <h1>Panel de Administración</h1>

        <div className="admin-layout">
          <aside className="admin-gestion">
            <h3>Gestión</h3>

            <ul className="OpcionesGestion">
              <li>
                <button
                  className={`btn ${seccionActiva === "videojuegos" ? "activo" : ""}`}
                  onClick={() => setSeccionActiva("videojuegos")}
                >
                  Videojuegos
                </button>
              </li>

              <li>
                <button
                  className={`btn ${seccionActiva === "generos" ? "activo" : ""}`}
                  onClick={() => setSeccionActiva("generos")}
                >
                  Géneros
                </button>
              </li>

              <li>
                <button
                  className={`btn ${seccionActiva === "plataformas" ? "activo" : ""}`}
                  onClick={() => setSeccionActiva("plataformas")}
                >
                  Plataformas
                </button>
              </li>
            </ul>
            <hr className="section-divider" />
            {/* ACCIONES SEGÚN SECCIÓN */}
            <h3>Acciones</h3>
            {seccionActiva === "videojuegos" && (
              <div className="OpcionesGestion">
                <Buscador
                  filtro={filtroJuego}
                  setFiltro={setFiltroJuego}
                  data={videojuegos}
                  listId="lista-videojuegos"
                />

                <button
                  className="btn add-videojuego-btn"
                  onClick={crearVideojuego}
                >
                  Añadir
                </button>

                <button
                  className={`btn warning ${!videojuegoSeleccionado ? " disabled" : ""}`}
                  onClick={editarVideojuego}
                  disabled={!videojuegoSeleccionado}
                >
                  Editar
                </button>

                <button
                  className={`btn danger ${!videojuegoSeleccionado ? " disabled" : ""}`}
                  onClick={borrarVideojuego}
                  disabled={!videojuegoSeleccionado}
                >
                  Borrar
                </button>
              </div>
            )}

            {seccionActiva === "generos" && (
              <div className="OpcionesGestion">
                <Buscador
                  filtro={filtroGenero}
                  setFiltro={setFiltroGenero}
                  data={generos}
                  listId="lista-generos"
                />

                <button
                  className="btn add-videojuego-btn"
                  onClick={crearGenero}
                >
                  Añadir
                </button>

                <button
                  className={`btn danger ${!generoSeleccionado ? " disabled" : ""}`}
                  onClick={borrarGenero}
                  disabled={!generoSeleccionado}
                >
                  Borrar
                </button>
              </div>
            )}

            {seccionActiva === "plataformas" && (
              <div className="OpcionesGestion">
                <Buscador
                  filtro={filtroPlataforma}
                  setFiltro={setFiltroPlataforma}
                  data={plataformas}
                  listId="lista-plataformas"
                />

                <button
                  className="btn add-videojuego-btn"
                  onClick={crearPlataforma}
                >
                  Añadir
                </button>

                <button
                  className={`btn danger ${!plataformaSeleccionada ? " disabled" : ""}`}
                  onClick={borrarPlataforma}
                  disabled={!plataformaSeleccionada}
                >
                  Borrar
                </button>
              </div>
            )}
          </aside>

          <section className="admin-datos">
            {seccionActiva === "videojuegos" && (
              <>
                {videojuegoSeleccionado ? (
                  <VideojuegoConsultar
                    videojuegoSeleccionado={videojuegoSeleccionado}
                  />
                ) : (
                  <div className="empty-state">Selecciona un videojuego.</div>
                )}
              </>
            )}

            {seccionActiva === "generos" && (
              <GenerosConsultar generos={generos} />
            )}

            {seccionActiva === "plataformas" && (
              <PlataformaConsultar plataformas={plataformas} />
            )}
          </section>
        </div>

        {/* 🪟 MODALES */}
        <Modal
          isOpen={modals.juegoCrear}
          onClose={() => gestionarModal("juegoCrear", false)}
        >
          <VideojuegoCrear
            videojuegos={videojuegos}
            setVideojuegos={setVideojuegos}
            generos={generos}
            plataformas={plataformas}
            onClose={() => gestionarModal("juegoCrear", false)}
          />
        </Modal>

        <Modal
          isOpen={modals.juegoEditar}
          onClose={() => gestionarModal("juegoEditar", false)}
        >
          {videojuegoSeleccionado && (
            <VideojuegoEditar
              videojuego={videojuegoSeleccionado}
              setVideojuegos={setVideojuegos}
              generos={generos}
              plataformas={plataformas}
              onClose={() => gestionarModal("juegoEditar", false)}
            />
          )}
        </Modal>

        <Modal
          isOpen={modals.generoCrear}
          onClose={() => gestionarModal("generoCrear", false)}
        >
          <GeneroCrear
            generos={generos}
            setGeneros={setGeneros}
            onClose={() => gestionarModal("generoCrear", false)}
          />
        </Modal>

        <Modal
          isOpen={modals.plataformaCrear}
          onClose={() => gestionarModal("plataformaCrear", false)}
        >
          <PlataformaCrear
            plataformas={plataformas}
            setPlataformas={setPlataformas}
            onClose={() => gestionarModal("plataformaCrear", false)}
          />
        </Modal>
      </div>
    </div>
  );
};

export default AdminVideojuegos;
