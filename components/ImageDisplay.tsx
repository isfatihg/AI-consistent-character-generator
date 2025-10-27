
import React from 'react';
import Spinner from './Spinner';

interface ImageDisplayProps {
  originalImage: string;
  generatedImage: string | null;
  isLoading: boolean;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ originalImage, generatedImage, isLoading }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-xl font-bold text-center text-gray-200 mb-4">Original Character</h3>
        <div className="bg-gray-800 rounded-lg p-2 shadow-lg">
          <img src={originalImage} alt="Original character" className="w-full h-auto object-contain rounded-md aspect-square" />
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold text-center text-gray-200 mb-4">Generated Pose</h3>
        <div className="bg-gray-800 rounded-lg p-2 shadow-lg aspect-square flex items-center justify-center">
          {isLoading ? (
            <div className="flex flex-col items-center text-gray-400">
                <Spinner />
                <p className="mt-4">Generating your character...</p>
            </div>
          ) : generatedImage ? (
            <img src={generatedImage} alt="Generated pose" className="w-full h-auto object-contain rounded-md" />
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
