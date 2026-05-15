// ServicioOfertas.js
import http, { backCaido } from "./http-axios.ts";

class ServicioUsuarios {
  getRecibirNotificaciones(id: string): Promise<{ data: boolean }> {
    if (backCaido) return Promise.reject(new Error("Backend no disponible"));

    return http.get("/usuarios/preferencias", { params: { id } });
  }

  patchRecibirNotificaciones(
    id: string,
    preferencia: boolean,
  ): Promise<{ data: boolean }> {
    if (backCaido) return Promise.reject(new Error("Backend no disponible"));

    return http.patch("/usuarios/preferencias", { id, preferencia });
  }
}

export default new ServicioUsuarios();
