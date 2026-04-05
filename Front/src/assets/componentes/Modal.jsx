import React from "react";
import "../estilos/Modal.css";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn pixel" onClick={onClose}>
          X
        </button>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
