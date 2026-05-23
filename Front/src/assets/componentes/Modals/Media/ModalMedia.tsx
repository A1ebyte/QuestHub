import { useEffect, useMemo, useRef } from "react";
import Hls from "hls.js";

import { Captura, Movie } from "../../../modelos/Videojuegos";

import "./Media.css";

interface ModalProps {
  movies: Movie[];
  captures: Captura[];
  activeIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

function ModalMedia({
  movies = [],
  captures = [],
  activeIndex,
  onClose,
  onNavigate,
}: ModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const items = useMemo(() => {
    return [
      ...movies.map((movie) => ({
        type: "video" as const,
        url: movie.video || "",
        thumb: movie.thumb,
      })),

      ...captures.map((capture) => ({
        type: "captura" as const,
        url: capture.imagen,
        thumb: capture.thumb,
      })),
    ];
  }, [movies, captures]);

  const currentItem = activeIndex !== null ? items[activeIndex] : null;

  useEffect(() => {
    if (!currentItem || currentItem.type !== "video" || !videoRef.current) {
      return;
    }
    const video = videoRef.current;

    // Safari
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = currentItem.url;
      return;
    }

    // Chrome / Firefox
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(currentItem.url);
      hls.attachMedia(video);
      return () => {
        hls.destroy();
      };
    }
  }, [currentItem]);

  const visibleThumbs = 8;
  const safeIndex = activeIndex ?? 0;
  const start = Math.max(0, Math.min(
      safeIndex - Math.floor(visibleThumbs / 2),
      Math.max(0, items.length - visibleThumbs),
    ),
  );

  const thumbsToShow = items.slice(start, start + visibleThumbs);

  if (activeIndex === null) return null;
  if (items.length === 0) return null;
  if (!currentItem) return null;

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
    <div className="media-modal-overlay">
      <button className="close-modal-btn" onClick={onClose}>
        ✕
      </button>

      <button className="nav-btn prev" onClick={handlePrev}>
        ←
      </button>

      <div className="media-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="main-display">
          {currentItem.type === "video" ? (
            <video ref={videoRef} className="modal-video" controls autoPlay />
          ) : (
            <img className="modal-image" src={currentItem.url} alt="Captura" />
          )}
        </div>

        <div className="thumbnails-strip">
          {thumbsToShow.map((item, idx) => {
            const realIndex = start + idx;

            return (
              <div
                key={realIndex}
                className={`thumb-container ${realIndex === activeIndex ? "active" : ""}`}
                onClick={() => onNavigate(realIndex)}>
                <img src={item.thumb} alt={`Preview ${realIndex}`} />
                {item.type === "video" && (
                  <div className="thumb-play-button">
                    <div className="thumb-play-button-svg-container">
                      <svg viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>);
            })}
        </div>
      </div>

      <button className="nav-btn next" onClick={handleNext}>
        →
      </button>
    </div>
  );
}

export default ModalMedia;
