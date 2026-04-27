// ServicioOfertas.js
import { DEFAULT_DIRECTION, DEFAULT_SORT_BY } from "../../const/sort.js";
import { PageOfertas } from "../../modelos/Ofertas.js";
import { FilterPageable } from "../../modelos/Pageable.js";
import { DetalleResponse } from "../../modelos/Videojuegos.js";
import http, { backCaido } from "./http-axios.js";

class ServicioOfertas {
  getAll({
    page = 0,
    size = 24,
    sortBy = DEFAULT_SORT_BY,
    direction = DEFAULT_DIRECTION,
    filtros = {},
  }: FilterPageable = {}): Promise<{ data: PageOfertas }> {

    if (backCaido)
      return Promise.reject(new Error("Backend no disponible"));

    const sort = `${sortBy},${direction}`;
    const params: any = { page, size, sort };

    Object.entries(filtros).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;

      params[key] = Array.isArray(value) ? value : value.toString();
    });

    return http.get(`/ofertas`, {
      params,
      paramsSerializer: (params) => {
        const s = new URLSearchParams();
        Object.keys(params).forEach((key) => {
          const val = params[key];
          if (Array.isArray(val)) {
            val.forEach((v) => s.append(key, v));
          } else {
            s.append(key, val);
          }
        });
        return s.toString();
      },
    });
  }

  getOfertasBySteamId(id: number): Promise<{ data: DetalleResponse }> {
    if (backCaido)
      return Promise.reject(new Error("Backend no disponible"));

    return http.get(`/${id}`);
  }

  getMaxPrecioOferta(): Promise<{ data: number }> {
    if (backCaido)
      return Promise.reject(new Error("Backend no disponible"));

    return http.get("/mayorPrecio");
  }
}

export default new ServicioOfertas();
