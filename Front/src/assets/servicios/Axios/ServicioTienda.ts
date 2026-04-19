import { Tienda } from "../../modelos/Tienda";
import http from "./http-axios";

class ServicioTienda {
  getAllTiendas() {
    return http.get<Tienda[]>("/tiendas");
  }
}

export default new ServicioTienda();
