// ServicioOfertas.js
import http from "./http-axios.js";

class ServicioOfertas {
  getAll({ page = 0, size = 20, sortBy = 'ofertaRating', direction = 'desc' } = {}) {
    
    // 1. Normalizamos: Convertimos a Array si nos llega un solo String
    const campos = Array.isArray(sortBy) ? sortBy : [sortBy];
    const direcciones = Array.isArray(direction) ? direction : [direction];

    // 2. Creamos la lista de "sort" que entiende Spring: ["campo,dir", "campo2,dir2"]
    const sortParams = campos.map((campo, index) => {
      // Si hay menos direcciones que campos, usamos la última dirección disponible
      const dir = direcciones[index] || direcciones[direcciones.length - 1];
      return `${campo},${dir}`;
    });

    return http.get(`/ofertas`, {
      params: { 
        page, 
        size, 
        sort: sortParams // Enviamos el array construido
      },
      // Este serializador es CLAVE para que la URL sea ?sort=...&sort=...
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