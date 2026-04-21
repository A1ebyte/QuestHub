import axios from "axios";
import { enviarNoti, typeToast } from "../../toolkit/notificacionToast";

export const sincronizarConBackend = async (
  uuid: string,
  email: string,
  token: string,
) => {
  try {
    await axios.post(
      "http://localhost:8080/api/usuarios/sincronizar",
      { id: uuid, email: email },
      { headers: { Authorization: `Bearer ${token}` } },
    );
  } catch (error) {
    enviarNoti(typeToast.ERROR,"Error con Servidor",error);
  }
};
