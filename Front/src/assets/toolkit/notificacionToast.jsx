import { toast } from "react-toastify";
import { toastICONS } from "../const/iconos.tsx";

export const colores = {
  ROJO: "#e63946",
  AZUL: "var(--azul-claro)",
  TEAL: "var(--teal)",
  AMARILLO: "#f1c40f",
  NEGRO: "#000000",
};

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
    success: (toastICONS.OK(colores.TEAL)),
    error: (toastICONS.SKULL(colores.ROJO)),
    warn: (toastICONS.WARNING(colores.AMARILLO)),
    info: (toastICONS.INFO(colores.AZUL)),
  };

  toast[tipo](contenido, {
    icon: iconoSVG || iconosDefault[tipo],
  });
};
