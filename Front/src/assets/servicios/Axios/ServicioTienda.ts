import { Tienda } from "../../modelos/Tienda";
import http, { backCaido } from "./http-axios";

class ServicioTienda {
  getAllTiendas(): Promise<{data:Tienda[]}> {
    if (backCaido)
          return Promise.reject(new Error("Backend no disponible"));

    return http.get("/tiendas");
  }
}

export default new ServicioTienda();
