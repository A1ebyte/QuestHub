import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ServicioOfertas from "../servicios/Axios/ServicioOfertas";

function GameDetalles() {
  const { id } = useParams();
  const [juego, setJuego] = useState(null);

  useEffect(() => {
    ServicioOfertas.getOfertasBySteamId(id)
      .then(res => setJuego(res.data))
      .catch(console.error);
  }, [id]);

  return (
    <div>
      <h1>juego</h1>
      {/* resto de datos */}
    </div>
  );
}

export default GameDetalles;
