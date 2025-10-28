import React from 'react';

interface FullScreenModalProps {
  imageUrl: string;
  onClose: () => void;
}

const FullScreenModal: React.FC<FullScreenModalProps> = ({ imageUrl, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-3xl font-bold z-50 hover:opacity-80 transition-opacity"
        aria-label="Close full screen view"
      >
        &times;
      </button>
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <img
          src={imageUrl}
          alt="Generated image in full screen"
          className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
        />
      </div>
    </div>
  );
};

export default FullScreenModal;
