import './Contacto.css';

const Contacto = ({ correo = "patata@example.com", redes = {} }: { correo?: string; redes?: Record<string, string> }) => {
  return (
    <section className="contact">
      <h2>Contactanos</h2>
      <p>¡No dudes en ponerte en contacto con nosotros!</p>

      <div className="contact-buttons">
        <button onClick={() => window.open(`mailto:${correo}`, "_blank")} title="Enviar correo">
          Correo
        </button>

        {Object.keys(redes).map((red) => {
          return (
            <button
              key={red}
              onClick={() => window.open(redes[red], "_blank")}
              title={`Visitar ${red}`}
            >
              {red}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default Contacto;
