// ServicioOfertas.js
import http from "./http-axios.js";

class ServicioOfertas {
  getAll(page = 0, size = 20, sortBy = 'ofertaRating', direction = 'asc') {
    return http.get(`/ofertas`, {
      params: {
        page: page,
        size: size,
        sortBy: sortBy,
        direction: direction
      }
    });
  }
}

export default new ServicioOfertas();