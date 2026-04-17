import "./OfertaLista.css";
import OfertaTarjeta from "../OfertaTarjeta/OfertaTarjeta.tsx";
import { AnimatePresence } from "framer-motion";
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
      <AnimatePresence>
        {ofertas.map((oferta, index) => (
          <OfertaTarjeta
            key={index}
            oferta={oferta}
            index={index}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

export default OfertasLista;
