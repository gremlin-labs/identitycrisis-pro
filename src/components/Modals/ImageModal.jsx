import React, { useEffect, useRef } from 'react';
import { X } from 'phosphor-react';

function ImageModal({ show, onClose, imageUrl, title = 'Profile Image' }) {
  const backdropRef = useRef(null);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [show]);

  if (!show || !imageUrl) return null;

  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
      aria-modal="true"
      role="dialog"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      {/* Minimal close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 p-3 rounded-full bg-black bg-opacity-60 hover:bg-opacity-80 transition-all text-white"
        title="Close"
        aria-label="Close image"
      >
        <X size={24} weight="bold" />
      </button>

      {/* Image Content */}
      <div className="max-w-[90vw] max-h-[90vh] flex justify-center items-center">
        <img
          src={imageUrl}
          alt={title}
          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
        />
      </div>
    </div>
  );
}

export default ImageModal; 