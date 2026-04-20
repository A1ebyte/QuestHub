import axios from "axios";

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
    console.error("Error al sincronizar usuario con el servidor local", error);
  }
};
