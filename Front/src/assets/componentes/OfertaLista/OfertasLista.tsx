import "./OfertaLista.css";
import OfertaTarjeta from "../OfertaTarjeta/OfertaTarjeta";
import { OfertaTarjetaMostrar } from "../../modelos/OfertasMod";
import WishListTarjeta from "../WishListTarjeta/WishListTarjeta";

function OfertasLista({
  ofertas = [],
  columnas = 4,
  loaded = true,
  wishList = false,
  wishListUpdate
}: {
  ofertas: OfertaTarjetaMostrar[];
  columnas?: number;
  loaded?: boolean;
  wishList?:boolean;
  wishListUpdate?:() => void;
}) {
  return (
    <div
      className={`grid`}
      style={{ "--columnas": columnas } as React.CSSProperties}
    >
        {ofertas.map((oferta, index) => (
          wishList?
          <WishListTarjeta
            key={oferta.steamAppID+""+oferta.titulo+""+index}
            oferta={oferta}
            index={index}
            loaded={loaded}
            actualizaWishList={wishListUpdate}
          />
          :<OfertaTarjeta
            key={oferta.steamAppID+""+oferta.titulo+""+index}
            oferta={oferta}
            index={index}
            loaded={loaded}
          />
        ))}
    </div>
  );
}

export default OfertasLista;
