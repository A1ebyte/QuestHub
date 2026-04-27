import "./Modal.css";

interface MediaItem {
  tipo: 'video' | 'imagen';
  url: string;
}

interface ModalProps {
  items: MediaItem[];
  activeIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

function Modal({ items, activeIndex, onClose, onNavigate }: ModalProps) {
  if (activeIndex === null) return null;

  const currentMedia = items[activeIndex];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    onNavigate(newIndex);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    onNavigate(newIndex);
  };

  return (
    <div className="media-modal-overlay" onClick={onClose}>
      <button className="close-modal-btn" onClick={onClose}>✕</button>

      {/* Flecha Izquierda */}
      <button className="nav-btn prev" onClick={handlePrev}>←</button>

      <div className="media-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="main-display">
          {currentMedia.tipo === 'video' ? (
            <iframe src={currentMedia.url} title="Video" frameBorder="0" allowFullScreen></iframe>
          ) : (
            <img src={currentMedia.url} alt="Ampliación" />
          )}
        </div>

        {/* Tira de miniaturas inferior */}
        <div className="thumbnails-strip">
          {items.map((item, idx) => (
            <div 
              key={idx} 
              className={`thumb-container ${idx === activeIndex ? 'active' : ''}`}
              onClick={() => onNavigate(idx)}
            >
              {item.tipo === 'video' ? (
                <div className="thumb-video-placeholder">▶</div>
              ) : (
                <img src={item.url} alt={`Vista previa ${idx}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Flecha Derecha */}
      <button className="nav-btn next" onClick={handleNext}>→</button>
    </div>
  );
}

export default Modal;