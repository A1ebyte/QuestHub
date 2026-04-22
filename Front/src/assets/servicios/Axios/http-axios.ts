import axios from "axios";
import { enviarNoti, typeToast } from "../../toolkit/notificacionToast";

const http = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export let backCaido: boolean = false;

http.interceptors.request.use((config) => {
  if (backCaido) {
    return Promise.reject(new Error("Backend no disponible"));
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    //Error sin respuesta: servidor caído, timeout, no conexión
    if (!error.response) {
      if (!backCaido) {
        backCaido = true;
        enviarNoti(
          typeToast.ERROR,
          "Error de conexión",
          "No se ha podido conectar al servidor",
        );
      }
    console.error("AxiosError:", {
      error: error
    });      
    return Promise.reject(error);
    }

    const status = error.response.status;
    const msg =
      error.response.data?.message ??
      error.response.data?.error ??
      "Ha ocurrido un error inesperado";

    //Errores 400
    if (status === 400) {
      enviarNoti(typeToast.WARN, "Petición inválida", msg);
    console.error("AxiosError:", {
      status: error.response?.status,
      data: error.response?.data,
    });      return Promise.reject(error);
    }

    //Errores 404
    if (status === 404) {
      enviarNoti(typeToast.WARN, "No encontrado", msg);
      console.error("AxiosError:", {
        message: msg,
        status: error.response?.status,
        data: error.response?.data,
      });
      return Promise.reject(error);
    }

    //Errores 500
    if (status >= 500) {
      enviarNoti(
        typeToast.ERROR,
        "Error del servidor",
        "Ha ocurrido un problema interno",
      );
      console.error("AxiosError:", {
        status: error.response?.status,
        data: error.response?.data,
      });
      return Promise.reject(error);
    }

    enviarNoti(typeToast.ERROR, "Error", msg);
    console.error("AxiosError:", {
      status: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  },
);

export default http;
