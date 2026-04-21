import axios from "axios";
import { enviarNoti, typeToast } from "../../toolkit/notificacionToast";

const http = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axios.get("http://localhost:8080/api/status", { timeout: 1000 })
  .catch(() => {
    enviarNoti(
      typeToast.ERROR,
      "Error de conexión:",
      "No se ha podido conectar al servidor"
    );
  });

export default http;
