import React from 'react';
import './Borrado.css';

interface BorradoProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const ModalBorrado: React.FC<BorradoProps> = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="modal" onClick={onClose}>
            {/* stopPropagation evita que al hacer click en el cuadro se cierre el modal */}
            <div className="modal-contenedor" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>¿Confirmar eliminación?</h3>
                </div>
                
                <div className="modal-cuerpo">
                    <p>
                        Estás a punto de eliminar tu cuenta de <span>QuestHub</span>. 
                        Esta acción borrará permanentemente tu lista de deseos y tus preferencias.
                    </p>
                    <p className="resaltado">¿Deseas continuar con la baja definitiva?</p>
                </div>

                <div className="modal-footer">
                    <button className="btn-cancelar" onClick={onClose}>
                        Mantener cuenta
                    </button>
                    <button className="btn-eliminar" onClick={onConfirm}>
                        Eliminar permanentemente
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalBorrado;