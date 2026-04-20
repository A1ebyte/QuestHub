import "./OfertaLista.css";
import OfertaTarjeta from "../OfertaTarjeta/OfertaTarjeta.tsx";
import { OfertaTarjetaMostrar } from "../../modelos/Ofertas.ts";

function OfertasLista({
  ofertas = [],
  columnas = 4,
}: {
  ofertas: OfertaTarjetaMostrar[];
  columnas?: number;
}) {
  return (
    <div
      className={`grid`}
      style={{ "--columnas": columnas } as React.CSSProperties}
    >
        {ofertas.map((oferta, index) => (
          <OfertaTarjeta
            key={oferta.steamAppID+""+oferta.titulo+""+index}
            oferta={oferta}
            index={index}
          />
        ))}
    </div>
  );
}

export default OfertasLista;
