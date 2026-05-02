import http from "./http-axios.js";
import { UserResponse } from "../../modelos/Users.js";

export const sincronizarConBackend = async ( UserResponse: UserResponse): Promise<void> => {
  try {
    await http.post(
      "/usuarios/sincronizar",
      { id: UserResponse.uuid, email: UserResponse.email },
      { headers: { Authorization: `Bearer ${UserResponse.token}` } },
    );
  } catch {console.error("Error al sincronizar con el backend");}
};
