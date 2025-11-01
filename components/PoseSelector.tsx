import React, { useRef, ChangeEvent } from 'react';
import { Pose } from '../types';
import Spinner from './Spinner';

interface PoseSelectorProps {
  poses: Pose[];
  selectedPose: Pose;
  onSelectPose: (pose: Pose) => void;
  isAnalyzing: boolean;
  onAddNewPose: (event: ChangeEvent<HTMLInputElement>) => void;
}

const PoseSelector: React.FC<PoseSelectorProps> = ({ poses, selectedPose, onSelectPose, isAnalyzing, onAddNewPose }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-200 mb-3">2. Select a Target Pose or Edit</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {poses.map((pose) => (
          <div
            key={pose.id}
            onClick={() => onSelectPose(pose)}
            className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 relative ${
              selectedPose.id === pose.id ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-600 hover:border-blue-400'
            }`}
          >
            {isAnalyzing && selectedPose.id === pose.id && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                    <Spinner />
                </div>
            )}
            <img 
                src={pose.imageUrl} 
                alt={pose.name} 
                className={`w-full h-auto bg-gray-700 aspect-square ${pose.id === 'edit' ? 'object-contain p-8' : 'object-cover'}`} 
            />
            <p className="text-center bg-gray-800 text-white py-1 px-2 text-sm truncate" title={pose.name}>{pose.name}</p>
          </div>
        ))}
        <div
          onClick={handleAddClick}
          className="cursor-pointer rounded-lg border-2 border-dashed border-gray-500 hover:border-blue-400 transition-all duration-200 flex flex-col items-center justify-center aspect-square text-gray-400 hover:text-white"
          title="Add new pose"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={onAddNewPose}
            accept="image/*"
            className="hidden"
            aria-label="Upload new pose"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-sm font-medium">Add Pose</span>
        </div>
      </div>
    </div>
  );
};

export default PoseSelector;
