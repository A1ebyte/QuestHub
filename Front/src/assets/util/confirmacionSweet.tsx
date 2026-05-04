import Swal from 'sweetalert2';
import { colores } from "./notificacionToast";

export const confirmar = (titulo, mensaje, tipo = 'warning') => {
  return Swal.fire({
    title: `<span style="color: var(--teal); font-family: "Roboto Condensed", sans-serif;">${titulo}</span>`,
    html: `<p style="color: var(--gris); font-family: 'Roboto Condensed", sans-serif;">${mensaje}</p>`,
    icon: tipo,
    iconColor: tipo === 'warning' ? colores.TEAL : colores.ROJO,
    background: 'var(--azul-black)',
    showCancelButton: true,
    confirmButtonColor: colores.ROJO,
    cancelButtonColor: '#333',
    confirmButtonText: 'CONFIRMAR',
    cancelButtonText: 'CANCELAR',
    borderRadius: '25px',
    customClass: {
      popup:'borde' ,
    }
  });
};