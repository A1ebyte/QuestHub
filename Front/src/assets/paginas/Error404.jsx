import { Link, useNavigate } from "react-router-dom";
import "../estilos/Paginas/Error404.css";
import { useEffect, useState } from "react";

function Error404() {
  const navigate = useNavigate();

  const url404 = [
    "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExazB1NnA4aDlqZTNkbjVxcnRtb2tpZjQyYmx3eTF4Mm1rdDdpYzJpciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/3wrwtzEghR7rbOq1YR/giphy.gif",
    "https://media.tenor.com/giNrzT0tQGsAAAAj/bonfire-dark-souls.gif",
    "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmlocTZ4b3o0NTN6bzh5ejJxZ3Uyc2xjcWg5dXN3djg3cXQwbzYydSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/XEOUMqltCrGdCnatFF/giphy.gif",
    "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDV4bDdhajlnZWQyYnBuM2drNHo2ZmZqZGJjcDluY2tkb3Z3OTBodCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/xHDDR7SIwocZaRwGnC/giphy.gif",
    "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExYjBhaGJ4M3p0OGJ2ejVmYWNyc3R0OGVtbXF3emJwY3FoN2drajNhMCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/qwasmZ0QDOljO/giphy.gif",
    "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExY3hoZTByOGJzYnVkbXVhcmprM2p3amtpdzBybDB4M3Q4Y3JsdjBweSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/jq3ge0TnMaayc/giphy.gif",
    "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExczF5bDZvZmppNXZ0ZzE5NDVvdG0xOWZldjdpN3QxOThzeHhudTlnMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/87HzVaoOd8ngkR0lCV/giphy.gif",
    "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExODh6ZnZ4MW91ZDNqYXc0emEzd3J2OGxmMmgwd3ltcnBienZwbWxwOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/495yBUqXxcOyUsqlZS/giphy.gif",
    "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNXA0emw5dTR1MWYyMXlscnJzYWgzeGU2OHplcHRwbmYwbzh6dXFtMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/uagj4jHD1jLOmr9sM3/giphy.gif"
  ];

  const frases404 = [
    "Has entrado en el vacío.",
    "Camino sin desbloquear.",
    "Aquí termina el mapa.",
    "Has muerto… espiritualmente.",
    "Los NPC's no conocen este lugar.",
    "Checkpoint no encontrado.",
    "Esta zona no existe.",
    "Te saliste del mapa.",
    "Nada más allá de este punto.",
    "Has sido derrotado por error-404.",
    "Te hace falta un objeto.",
    "El tiempo ha terminado."
  ];

  const [randomGif, setRandomGif] = useState("");
  const [randomFrase, setRandomFrase] = useState("");
  const gif = url404[Math.floor(Math.random() * url404.length)];
  const frase = frases404[Math.floor(Math.random() * frases404.length)];

  useEffect(() => {
    //para sacar distinto gif y frase cada vez
    //solo se ejecuta una vez al montar
    setRandomGif(gif);
    setRandomFrase(frase);
  }, []);

  return (
    <div className="site">
      <div className="contenido404">
        <div className="sketch">
          <img className="game-over" src={randomGif} alt="Error 404" />
        </div>

        <div className="texto404">
          <h1>
            404 – Quest Failed:
            <small>{randomFrase}</small>
          </h1>
          {/* el navigate -1 es decir como el regresa atras del navegador pero sin recargar*/}
          <div className="botones404">
            <button className="boton-secundario" onClick={() => navigate(-1)}>
              ← Volver atrás
            </button>

            <Link to="/" className="boton-inicio">
              Ir al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Error404;
