
import React, { useState } from 'react';
import { Pose } from '../types';

interface ControlsProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onGenerate: () => void;
  isLoading: boolean;
  selectedPose: Pose;
  characterPrompt: string;
  setCharacterPrompt: (prompt: string) => void;
  onGenerateCharacter: () => void;
  isGeneratingCharacter: boolean;
}

const Controls: React.FC<ControlsProps> = ({
  prompt,
  setPrompt,
  onFileChange,
  onGenerate,
  isLoading,
  selectedPose,
  characterPrompt,
  setCharacterPrompt,
  onGenerateCharacter,
  isGeneratingCharacter,
}) => {
  const isEditing = selectedPose.id === 'edit';
  const [creationMode, setCreationMode] = useState<'upload' | 'text'>('upload');
  const overallLoading = isLoading || isGeneratingCharacter;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-200 mb-3">1. Provide Your Character</h3>
        <div className="flex border-b border-gray-600 mb-4">
          <button
            onClick={() => setCreationMode('upload')}
            disabled={overallLoading}
            className={`flex-1 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${
              creationMode === 'upload' ? 'border-b-2 border-blue-500 text-white' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Upload Image
          </button>
          <button
            onClick={() => setCreationMode('text')}
            disabled={overallLoading}
            className={`flex-1 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${
              creationMode === 'text' ? 'border-b-2 border-blue-500 text-white' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Generate from Text
          </button>
        </div>

        {creationMode === 'upload' && (
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 disabled:opacity-50"
              disabled={overallLoading}
            />
            <p className="text-xs text-gray-500 mt-2">Or use the default character provided.</p>
          </div>
        )}

        {creationMode === 'text' && (
          <div className="space-y-3">
            <textarea
              value={characterPrompt}
              onChange={(e) => setCharacterPrompt(e.target.value)}
              placeholder="e.g., A futuristic knight with glowing blue armor, holding a plasma sword."
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:opacity-50"
              rows={3}
              disabled={overallLoading}
            />
            <button
              onClick={onGenerateCharacter}
              disabled={overallLoading}
              className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGeneratingCharacter ? 'Generating...' : 'Generate Character'}
            </button>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-200 mb-3">
          {isEditing ? '3. Describe Your Changes' : '3. Add Editing Instructions (Optional)'}
        </h3>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={isEditing ? 'e.g., Add a retro filter, remove the person in the background...' : 'e.g., Add a sword, change background to a sci-fi city...'}
          className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:opacity-50"
          rows={3}
          disabled={overallLoading}
          required={isEditing}
        />
      </div>

      <button
        onClick={onGenerate}
        disabled={overallLoading}
        className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? 'Generating...' : isEditing ? 'Generate Edit' : 'Generate Character Pose'}
      </button>
    </div>
  );
};

export default Controls;