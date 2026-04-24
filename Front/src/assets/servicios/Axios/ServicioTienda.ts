import { Tienda } from "../../modelos/Tienda";
import http from "./http-axios";

class ServicioTienda {
  getAllTiendas(): Promise<{data:Tienda[]}> {
    return http.get("/tiendas");
  }
}

export default new ServicioTienda();
