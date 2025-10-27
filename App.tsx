
import React, { useState, useCallback } from 'react';
import { POSES, DEFAULT_CHARACTER_IMAGE } from './constants';
import { Pose } from './types';
import PoseSelector from './components/PoseSelector';
import ImageDisplay from './components/ImageDisplay';
import Controls from './components/Controls';
import Alert from './components/Alert';
import { generateImageFromPose, editImage, generateCharacterFromText } from './services/geminiService';

const App: React.FC = () => {
  const [characterImage, setCharacterImage] = useState<File | string>(DEFAULT_CHARACTER_IMAGE);
  const [characterImageUrl, setCharacterImageUrl] = useState<string>(DEFAULT_CHARACTER_IMAGE);
  const [selectedPose, setSelectedPose] = useState<Pose>(POSES[0]);
  const [prompt, setPrompt] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [characterPrompt, setCharacterPrompt] = useState<string>('');
  const [isGeneratingCharacter, setIsGeneratingCharacter] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCharacterImage(file);
      setCharacterImageUrl(URL.createObjectURL(file));
      setGeneratedImage(null); // Clear previous generation
      setCharacterPrompt(''); // Clear text prompt
    }
  };
  
  const handleGenerateCharacter = async () => {
    if (!characterPrompt) {
      setError("Please enter a description for your character.");
      return;
    }
    setIsGeneratingCharacter(true);
    setError('');
    setGeneratedImage(null);
    try {
      const result = await generateCharacterFromText(characterPrompt);
      setCharacterImage(result);
      setCharacterImageUrl(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unknown error occurred while generating the character.');
    } finally {
      setIsGeneratingCharacter(false);
    }
  };


  const handleGenerateClick = useCallback(async () => {
    setIsLoading(true);
    setError('');
    setGeneratedImage(null);
    try {
      if (selectedPose.id === 'edit' && !prompt) {
        setError("Please provide editing instructions when using 'Edit Original'.");
        setIsLoading(false);
        return;
      }

      const result =
        selectedPose.id === 'edit'
          ? await editImage(characterImage, prompt)
          : await generateImageFromPose(characterImage, selectedPose.imageUrl, prompt);
          
      setGeneratedImage(result);
    } catch (err: any)
    {
      console.error(err);
      setError(err.message || 'An unknown error occurred while generating the image.');
    } finally {
      setIsLoading(false);
    }
  }, [characterImage, selectedPose, prompt]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            AI Consistent Character Generator
          </h1>
          <p className="text-gray-400 mt-2 max-w-2xl mx-auto">
            Bring your characters to life. Upload an image, select a pose, and add your creative touch to generate new character art instantly.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 bg-gray-800/50 p-6 rounded-2xl shadow-xl border border-gray-700">
            <div className="space-y-8">
                <Controls 
                    prompt={prompt}
                    setPrompt={setPrompt}
                    onFileChange={handleFileChange}
                    onGenerate={handleGenerateClick}
                    isLoading={isLoading}
                    selectedPose={selectedPose}
                    characterPrompt={characterPrompt}
                    setCharacterPrompt={setCharacterPrompt}
                    onGenerateCharacter={handleGenerateCharacter}
                    isGeneratingCharacter={isGeneratingCharacter}
                />
                <PoseSelector poses={POSES} selectedPose={selectedPose} onSelectPose={setSelectedPose} />
                {error && <Alert message={error} />}
            </div>
          </div>

          <div className="lg:col-span-3">
            <ImageDisplay
              originalImage={characterImageUrl}
              generatedImage={generatedImage}
              isLoading={isLoading || isGeneratingCharacter}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;