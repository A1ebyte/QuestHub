import ServicioVideojuegos from "../../../servicios/Axios/ServicioVideojuegos.js";
import { enviarNoti,typeToast } from '../../../toolkit/notificacionToast.jsx'
import Swal from "sweetalert2";
import "../../../estilos/SweetAlert.css"

const Borrar = (videojuego, videojuegos, setVideojuegos) => {
 
Swal.fire({
    title: "Eliminar videojuego",
    text: "Esta acción no se puede deshacer.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar",

    customClass: {
      popup: "swal-popup",
      title: "swal-title",
      htmlContainer: "swal-text",
      confirmButton: "swal-confirm",
      cancelButton: "swal-cancel",
    },
    buttonsStyling: false,
  }).then((result) => {
    if (result.isConfirmed) {
        ServicioVideojuegos.borrar(videojuego.id)
        .then(() => {
          enviarNoti(typeToast.SUCCESS,(`Eliminado Correctamente ${videojuego.nombre}`))
          const newVGames = videojuegos.filter((a) => a.id !== videojuego.id);
          setVideojuegos(newVGames);
        })
        .catch(() => {
          enviarNoti(typeToast.ERROR,("ERROR, No se ha borrado correctamente"))
        });           
    }
  });
};

export default Borrar;

