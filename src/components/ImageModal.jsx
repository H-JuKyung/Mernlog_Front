import { useState, useEffect } from 'react';
import css from './imageModal.module.css';

export default function ImageModal({ imageList, currentIndex, onClose }) {
  const [index, setIndex] = useState(currentIndex);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const nextImage = () => {
    setIndex((index + 1) % imageList.length);
  };

  const prevImage = () => {
    setIndex((index - 1 + imageList.length) % imageList.length);
  };

  return (
    <div className={css.modalOverlay} onClick={onClose}>
      <button className={css.closeButton} onClick={onClose}>
        <i className="fa-solid fa-xmark"></i>
      </button>

      <button
        className={css.prevButton}
        onClick={e => {
          e.stopPropagation();
          prevImage();
        }}
      >
        <div className={css.buttonBackground}>
          <i className="fa-solid fa-chevron-left"></i>
        </div>
      </button>
      <button
        className={css.nextButton}
        onClick={e => {
          e.stopPropagation();
          nextImage();
        }}
      >
        <div className={css.buttonBackground}>
          <i className="fa-solid fa-chevron-right"></i>
        </div>
      </button>

      <img
        src={imageList[index]}
        alt={`이미지 ${index + 1}`}
        className={css.mainImage}
        onClick={e => e.stopPropagation()}
      />

      <div className={css.imageIndex}>
        {index + 1} / {imageList.length}
      </div>

      <div className={css.thumbnailList} onClick={e => e.stopPropagation()}>
        {imageList.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`썸네일 ${idx + 1}`}
            className={`${css.thumbnail} ${index === idx ? css.active : ''}`}
            onClick={() => setIndex(idx)}
          />
        ))}
      </div>
    </div>
  );
}
