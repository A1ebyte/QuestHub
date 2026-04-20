import ServicioGeneros from "../../../servicios/Axios/ServicioGeneros.js";
import Swal from "sweetalert2";
import { enviarNoti,typeToast } from '../../../toolkit/notificacionToast.jsx'
import "../../../estilos/SweetAlert.css"

const Borrar = (genero, generos, setGeneros) => {
 
Swal.fire({
    title: "Eliminar plataforma",
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
        ServicioGeneros.borrar(genero.id)
        .then(() => {
          enviarNoti(typeToast.SUCCESS,(`Eliminado Correctamente ${genero.nombre}`))
          const newGeneros = generos.filter((a) => a.id !== genero.id);
          setGeneros(newGeneros);
        })
        .catch(() => {
          enviarNoti(typeToast.ERROR,("ERROR, No se ha borrado correctamente"))
        });           
    }
  });
};

export default Borrar;