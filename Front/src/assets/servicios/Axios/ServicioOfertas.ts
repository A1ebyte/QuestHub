// ServicioOfertas.js
import { PageOfertas } from "../../modelos/OfertasDTOs.js";
import http from "./http-axios.js";

class ServicioOfertas {
  getAll({ page = 0, size = 20, sortBy = 'ofertaRating', direction = 'desc' } = {}): Promise<{data: PageOfertas}> {
    
    // Convertimos a Array si nos llega un solo String
    const campos = Array.isArray(sortBy) ? sortBy : [sortBy];
    const direcciones = Array.isArray(direction) ? direction : [direction];

    // Creamos la lista de "sort"
    const sortParams = campos.map((campo, index) => {
      const dir = direcciones[index] || direcciones[direcciones.length - 1];
      return `${campo},${dir}`;
    });

    return http.get(`/ofertas`, {
      params: { 
        page, 
        size, 
        sort: sortParams
      },
      // Este serializador no tocar a menos que sepas lo que haces
      paramsSerializer: (params) => {
        const s = new URLSearchParams();
        Object.keys(params).forEach(key => {
          if (Array.isArray(params[key])) {
            params[key].forEach(v => s.append(key, v));
          } else {
            s.append(key, params[key]);
          }
        });
        return s.toString();
      }
    });
  }
}

export default new ServicioOfertas();