import { toast } from "react-toastify";
import { colores, INFO, OK, SKULL, WARNING } from "../const/iconosToast";

export const typeToast = {
  SUCCESS: "success",
  ERROR: "error",
  INFO: "info",
  WARN: "warn",
};

const ToastContent = ({ titulo, mensaje }) => (
  <div className="toast-gamer-content">
    <h4 className="toast-gamer-title">{titulo}</h4>
    <p className="toast-gamer-text">{mensaje}</p>
  </div>
);

export const enviarNoti = (tipo, titulo, mensaje, iconoSVG=null) => {
  const contenido = <ToastContent titulo={titulo} mensaje={mensaje} />;

  const iconosDefault = {
    success: (OK(colores.TEAL)),
    error: (SKULL(colores.ROJO)),
    warn: (WARNING(colores.AMARILLO)),
    info: (INFO(colores.AZUL)),
  };

  toast[tipo](contenido, {
    icon: iconoSVG || iconosDefault[tipo],
  });
};
