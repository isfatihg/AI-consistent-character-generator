import React, { useState } from 'react';
import { Pose } from '../types';

interface ControlsProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  selectedPose: Pose;
  characterPrompt: string;
  setCharacterPrompt: (prompt: string) => void;
  onGenerateCharacter: () => void;
  isGeneratingCharacter: boolean;
  onBackgroundFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  backgroundPrompt: string;
  setBackgroundPrompt: (prompt: string) => void;
  onGenerateBackground: () => void;
  isGeneratingBackground: boolean;
  backgroundImageUrl: string | null;
  onClearBackground: () => void;
  onApparelFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  apparelImageUrl: string | null;
  onClearApparel: () => void;
  onBackgroundStyleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  backgroundStyleImageUrl: string | null;
  onClearBackgroundStyleImage: () => void;
  onGenerateBackgroundFromImage: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  prompt,
  setPrompt,
  onFileChange,
  isLoading,
  selectedPose,
  characterPrompt,
  setCharacterPrompt,
  onGenerateCharacter,
  isGeneratingCharacter,
  onBackgroundFileChange,
  backgroundPrompt,
  setBackgroundPrompt,
  onGenerateBackground,
  isGeneratingBackground,
  backgroundImageUrl,
  onClearBackground,
  onApparelFileChange,
  apparelImageUrl,
  onClearApparel,
  onBackgroundStyleFileChange,
  backgroundStyleImageUrl,
  onClearBackgroundStyleImage,
  onGenerateBackgroundFromImage,
}) => {
  const isEditing = selectedPose.id === 'edit';
  const [characterCreationMode, setCharacterCreationMode] = useState<'upload' | 'text'>('upload');
  const [backgroundCreationMode, setBackgroundCreationMode] = useState<'upload' | 'generate' | 'fromImage'>('upload');
  const overallLoading = isLoading || isGeneratingCharacter || isGeneratingBackground;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-200 mb-3">1. Provide Your Character</h3>
        <div className="flex border-b border-gray-600 mb-4">
          <button
            onClick={() => setCharacterCreationMode('upload')}
            disabled={overallLoading}
            className={`flex-1 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${
              characterCreationMode === 'upload' ? 'border-b-2 border-blue-500 text-white' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Upload Image
          </button>
          <button
            onClick={() => setCharacterCreationMode('text')}
            disabled={overallLoading}
            className={`flex-1 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${
              characterCreationMode === 'text' ? 'border-b-2 border-blue-500 text-white' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Generate from Text
          </button>
        </div>

        {characterCreationMode === 'upload' && (
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

        {characterCreationMode === 'text' && (
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
              disabled={overallLoading || !characterPrompt}
              className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGeneratingCharacter ? 'Generating...' : 'Generate Character'}
            </button>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-200 mb-3">
          3. Describe Your Changes & Apparel
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
        <div className="mt-4">
            <label className="text-sm font-medium text-gray-300 mb-2 block">Apparel Image (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={onApparelFileChange}
              className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-600 file:text-white hover:file:bg-gray-700 disabled:opacity-50"
              disabled={overallLoading}
            />
             {apparelImageUrl && (
             <div className="relative mt-4 w-32">
                <img src={apparelImageUrl} alt="Apparel preview" className="rounded-lg w-full aspect-square object-cover" />
                <button 
                    onClick={onClearApparel} 
                    disabled={overallLoading}
                    className="absolute -top-2 -right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80 transition-colors disabled:opacity-50"
                    aria-label="Remove apparel image"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </button>
             </div>
          )}
        </div>
      </div>

      {!isEditing && (
        <div>
          <h3 className="text-lg font-semibold text-gray-200 mb-3">4. Add Background Scene (Optional)</h3>
          <div className="flex border-b border-gray-600 mb-4">
            <button onClick={() => setBackgroundCreationMode('upload')} disabled={overallLoading} className={`flex-1 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${ backgroundCreationMode === 'upload' ? 'border-b-2 border-blue-500 text-white' : 'border-transparent text-gray-400 hover:text-white' }`}>Upload</button>
            <button onClick={() => setBackgroundCreationMode('generate')} disabled={overallLoading} className={`flex-1 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${ backgroundCreationMode === 'generate' ? 'border-b-2 border-blue-500 text-white' : 'border-transparent text-gray-400 hover:text-white' }`}>Generate</button>
            <button onClick={() => setBackgroundCreationMode('fromImage')} disabled={overallLoading} className={`flex-1 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${ backgroundCreationMode === 'fromImage' ? 'border-b-2 border-blue-500 text-white' : 'border-transparent text-gray-400 hover:text-white' }`}>From Image</button>
          </div>

          {backgroundCreationMode === 'upload' && (
            <div>
              <input type="file" accept="image/*" onChange={onBackgroundFileChange} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-600 file:text-white hover:file:bg-gray-700 disabled:opacity-50" disabled={overallLoading} />
              <p className="text-xs text-gray-500 mt-2">Upload an image to place your character in a new scene.</p>
            </div>
          )}

          {backgroundCreationMode === 'generate' && (
             <div className="space-y-3">
                <textarea value={backgroundPrompt} onChange={(e) => setBackgroundPrompt(e.target.value)} placeholder="e.g., A neon-lit nightclub, a serene beach at sunset..." className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:opacity-50" rows={2} disabled={overallLoading}/>
                <button onClick={onGenerateBackground} disabled={overallLoading || !backgroundPrompt} className="w-full bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {isGeneratingBackground ? 'Generating...' : 'Generate Background'}
                </button>
              </div>
          )}
          
          {backgroundCreationMode === 'fromImage' && (
             <div className="space-y-3">
                <p className="text-xs text-gray-400">Generate a new background based on the style of an image you upload.</p>
                <input type="file" accept="image/*" onChange={onBackgroundStyleFileChange} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-600 file:text-white hover:file:bg-gray-700 disabled:opacity-50" disabled={overallLoading}/>
                {backgroundStyleImageUrl && (
                 <div className="relative mt-2 w-32">
                    <img src={backgroundStyleImageUrl} alt="Background style preview" className="rounded-lg w-full aspect-square object-cover" />
                    <button onClick={onClearBackgroundStyleImage} disabled={overallLoading} className="absolute -top-2 -right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80 transition-colors disabled:opacity-50" aria-label="Remove background style image">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    </button>
                 </div>
                )}
                <textarea value={backgroundPrompt} onChange={(e) => setBackgroundPrompt(e.target.value)} placeholder="Describe the scene to generate, e.g., 'a futuristic city street'" className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:opacity-50" rows={2} disabled={overallLoading}/>
                <button onClick={onGenerateBackgroundFromImage} disabled={overallLoading || !backgroundPrompt || !backgroundStyleImageUrl} className="w-full bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {isGeneratingBackground ? 'Generating...' : 'Generate From Image'}
                </button>
              </div>
          )}

          {backgroundImageUrl && (
             <div className="relative mt-4">
                <p className="text-sm text-gray-300 mb-2">Background Preview:</p>
                <img src={backgroundImageUrl} alt="Background preview" className="rounded-lg w-full aspect-video object-cover" />
                <button onClick={onClearBackground} disabled={overallLoading} className="absolute top-8 right-2 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/80 transition-colors disabled:opacity-50" aria-label="Remove background image">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </button>
             </div>
          )}

        </div>
      )}
    </div>
  );
};

export default Controls;
