import "./Acerca.css";
import Contacto from "../../componentes/Contacto";

const Acerca = () => {
  return (
    <section className="about InicioContenedor">
      {/* Introducción */}
      <h1>Acerca de QuestHub</h1>
      <div className="about-section">
        <p className="about-intro">
          QuestHub es una plataforma desarrollada como proyecto de 2º DAW cuyo
          objetivo es ofrecer un espacio centralizado donde los jugadores puedan
          comparar precios de videojuegos entre distintas tiendas digitales.
          Surge como una solución práctica para encontrar ofertas de forma
          rápida y clara, evitando que el usuario tenga que consultar múltiples
          plataformas por separado.
        </p>

        <p className="about-intro">
          El proyecto combina tecnologías modernas como Spring Boot para el
          backend, React y Vite para el frontend, postgreSQL como base de datos
          y la integración de APIs externas como Steam y CheapShark. Gracias a
          esta arquitectura, la información se procesa en un backend propio
          optimizado con caché, lo que mejora el rendimiento y garantiza una
          experiencia fluida.
        </p>

        <p className="about-intro">
          El enfoque del desarrollo se basa en aplicar buenas prácticas de
          arquitectura y diseño de sistemas, construyendo una plataforma
          moderna, funcional y escalable que centraliza datos, reduce la
          complejidad del frontend y facilita futuras ampliaciones.
        </p>

        <p className="about-intro">
          Más allá del ámbito académico, QuestHub representa la oportunidad de
          crear una herramienta útil para la comunidad gamer, con potencial de
          crecimiento y capacidad para incorporar nuevas funcionalidades en el
          futuro.
        </p>
      </div>

      {/* Qué ofrecemos */}
      <div className="about-section">
        <h2>Qué ofrecemos</h2>
        <ul>
          <li>Comparación de precios entre múltiples tiendas digitales</li>
          <li>Información detallada de videojuegos mediante la API de Steam</li>
          <li>Interfaz moderna, rápida y fácil de usar</li>
          <li>Sistema de usuarios con wishlist y gestión de sesión</li>
          <li>Backend propio optimizado con caché y API unificada</li>
        </ul>
      </div>

      {/* Equipo */}
      <article className="about-section about-author">
        <h2>El equipo detrás de QuestHub</h2>

        <div className="team-cards-section">
          <div className="team-card">
            <img
              src="/Imagenes/kerin.jpg"
              alt="Kerin Aguilar"
              className="team-image"
            />
            <h3>Kerin Aguilar</h3>
            <p>
              Encargado del diseño de la base de datos en PostgreSQL, la
              creación de entidades y servicios del backend, así como la
              configuración de CORS y el sistema de usuarios. También ha
              colaborado en diversas tareas del backend para reforzar la
              arquitectura del proyecto.
            </p>
          </div>

          <div className="team-card">
            <img
              src="/Imagenes/freddy.jpg"
              alt="Freddy De Andrade"
              className="team-image"
            />
            <h3>Freddy De Andrade</h3>
            <p>
              Responsable principal del backend, donde ha implementado APIs,
              DTOs y servicios clave. Ha realizado ajustes en la base de datos y
              su integración, desarrollado la comunicación entre frontend y
              backend y creado componentes junto con sus estilos dentro de la
              plataforma.
            </p>
          </div>

          <div className="team-card">
            <img
              src="/Imagenes/mohamed.jpg"
              alt="Mohamed Bada"
              className="team-image"
            />
            <h3>Mohamed Bada</h3>
            <p>
              {/*Especializado en el diseño del frontend y la experiencia de
              usuario. Su objetivo es lograr una interfaz intuitiva, moderna y
              accesible para todos.*/}
              Responsable del frontend, donde ha trabajado en la mejora visual
              del header y en el diseño del panel de filtros. EL resto de tareas
              de frontend se han encargado Freddy y Kerin
            </p>
          </div>
        </div>

        {/* Contacto */}
        <Contacto
          correo="equipo.questhub@example.com"
          redes={{
            GitHub: "https://github.com/A1ebyte/QuestHub",
            LinkedIn: "https://www.linkedin.com",
          }}
        />
      </article>
    </section>
  );
};

export default Acerca;
