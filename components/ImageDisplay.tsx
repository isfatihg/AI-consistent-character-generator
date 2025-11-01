import React from 'react';
import Spinner from './Spinner';
import { Pose } from '../types';

interface ImageDisplayProps {
  originalImage: string;
  generatedImage: string | null;
  isLoadingCombined: boolean;
  onViewFullScreen: () => void;
  onGenerate: () => void;
  isLoadingGenerate: boolean;
  isGenerationDisabled: boolean;
  selectedPose: Pose;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ 
  originalImage, 
  generatedImage, 
  isLoadingCombined, 
  onViewFullScreen,
  onGenerate,
  isLoadingGenerate,
  isGenerationDisabled,
  selectedPose
}) => {
  const isEditing = selectedPose.id === 'edit';
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-xl font-bold text-center text-gray-200 mb-4">Original Character</h3>
        <div className="bg-gray-800 rounded-lg p-2 shadow-lg">
          <img key={originalImage} src={originalImage} alt="Original character" className="w-full h-auto object-contain rounded-md aspect-square" />
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold text-center text-gray-200 mb-4">Generated Pose</h3>
        <button
          onClick={onGenerate}
          disabled={isGenerationDisabled}
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4"
        >
          {isLoadingGenerate ? 'Generating...' : isEditing ? 'Generate Edit' : 'Generate Character Pose'}
        </button>
        <div className="bg-gray-800 rounded-lg p-2 shadow-lg aspect-square flex items-center justify-center relative">
          {isLoadingCombined ? (
            <div className="flex flex-col items-center text-gray-400">
                <Spinner />
                <p className="mt-4">Generating your character...</p>
            </div>
          ) : generatedImage ? (
            <>
              <img key={generatedImage} src={generatedImage} alt="Generated pose" className="w-full h-auto object-contain rounded-md" />
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <button
                  onClick={onViewFullScreen}
                  className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                  aria-label="View full screen"
                  title="View full screen"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 110 2H5v3a1 1 0 11-2 0V4zm14 0a1 1 0 00-1-1h-4a1 1 0 100 2h3v3a1 1 0 102 0V4zM4 17a1 1 0 001 1h4a1 1 0 100-2H5v-3a1 1 0 10-2 0v4zm13-1a1 1 0 00-1-1h-4a1 1 0 100 2h3v3a1 1 0 102 0v-4z" clipRule="evenodd" />
                  </svg>
                </button>
                <a
                  href={generatedImage}
                  download="generated-character.png"
                  className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                  aria-label="Download image"
                  title="Download image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500">
              <p>Your generated image will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageDisplay;
