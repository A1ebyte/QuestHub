import "./Privacidad.css";

const Privacidad = () => {
  return (
    <section className="privacy InicioContenedor">
      <h1 className="privacy-title">Política de Privacidad</h1>

      <p className="privacy-intro">
        En Quest‑Hub valoramos tu privacidad y queremos que tengas control sobre tu información.
        Esta política explica qué datos recopilamos, cómo los utilizamos y qué medidas aplicamos
        para protegerlos mientras usas nuestro comparador de precios de videojuegos para PC.
      </p>

      <div className="privacy-block">
        <h2><span>1.</span> Información que recopilamos</h2>
        <p>Recopilamos dos tipos de datos:</p>

        <p><span>a)</span> Datos proporcionados por el usuario:</p>
        <p className="type-data">
          Información necesaria para crear y gestionar tu cuenta, como tu correo electrónico y
          credenciales de acceso. También incluye datos que introduces voluntariamente, como tu
          lista de deseos o preferencias dentro de la plataforma.
        </p>

        <p><span>b)</span> Datos generados automáticamente:</p>
        <p className="type-data">
          Información técnica y de uso como búsquedas realizadas, juegos consultados, interacciones
          dentro del catálogo, datos del dispositivo, navegador y estadísticas de uso para mejorar
          el rendimiento.
        </p>
      </div>

      <div className="privacy-block">
        <h2><span>2.</span> Finalidad del tratamiento de datos</h2>
        <p>Utilizamos tu información para:</p>

        <ul className="privacy-list">
          <li>Mantener tu cuenta y tus listas personalizadas.</li>
          <li>Mejorar la precisión del comparador y las recomendaciones.</li>
          <li>Optimizar el rendimiento y la estabilidad de la plataforma.</li>
          <li>Detectar errores, prevenir abusos y garantizar la seguridad.</li>
          <li>Enviarte avisos importantes relacionados con tu cuenta (si lo autorizas).</li>
        </ul>

        <p>Nunca utilizamos tus datos con fines comerciales externos.</p>
      </div>

      <div className="privacy-block">
        <h2><span>3.</span> Seguridad y almacenamiento</h2>
        <p>
          Aplicamos medidas técnicas y organizativas para proteger tu información frente a accesos
          no autorizados, pérdidas o alteraciones. Entre ellas se incluyen cifrado de datos en tránsito,
          control de acceso interno y monitorización de actividad sospechosa.
        </p>
        <p>
          Tu información se almacena únicamente durante el tiempo necesario para los fines descritos.
        </p>
      </div>

      <div className="privacy-block">
        <h2><span>4.</span> Compartición de datos</h2>
        <p>No vendemos tus datos personales. Solo compartimos información cuando:</p>

        <ul className="privacy-list">
          <li>Es necesario para cumplir con obligaciones legales.</li>
          <li>Es imprescindible para garantizar la seguridad de la plataforma.</li>
          <li>Se requiere para el funcionamiento técnico del servicio (por ejemplo, proveedores de hosting).</li>
        </ul>

        <p>En todos los casos, se limita estrictamente al mínimo necesario.</p>
      </div>

      <div className="privacy-block">
        <h2><span>5.</span> Derechos del usuario</h2>
        <p>
          Puedes solicitar acceso, rectificación, eliminación, limitación del tratamiento o exportación
          de tus datos personales. Puedes ejercer estos derechos contactándonos desde la sección de
          <a href="/contacto"> Contacto</a>.
        </p>
      </div>

      <div className="privacy-block">
        <h2><span>6.</span> Cambios en esta política</h2>
        <p>
          Podemos actualizar esta política para reflejar mejoras o cambios legales. Si realizamos
          modificaciones importantes, te lo notificaremos dentro de la plataforma.
        </p>
      </div>

      <p className="privacy-contact">
        ¿Tienes dudas? Puedes <a href="/contacto">contactarnos</a>.
      </p>
    </section>
  );
};

export default Privacidad;
