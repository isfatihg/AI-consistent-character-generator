
import React from 'react';
import { Pose } from '../types';

interface PoseSelectorProps {
  poses: Pose[];
  selectedPose: Pose;
  onSelectPose: (pose: Pose) => void;
}

const PoseSelector: React.FC<PoseSelectorProps> = ({ poses, selectedPose, onSelectPose }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-200 mb-3">2. Select a Target Pose or Edit</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {poses.map((pose) => (
          <div
            key={pose.id}
            onClick={() => onSelectPose(pose)}
            className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ${
              selectedPose.id === pose.id ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-600 hover:border-blue-400'
            }`}
          >
            <img 
                src={pose.imageUrl} 
                alt={pose.name} 
                className={`w-full h-auto bg-gray-700 aspect-square ${pose.id === 'edit' ? 'object-contain p-8' : 'object-cover'}`} 
            />
            <p className="text-center bg-gray-800 text-white py-1 px-2 text-sm">{pose.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PoseSelector;
