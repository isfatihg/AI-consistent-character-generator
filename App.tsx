import React, { useState, useCallback } from 'react';
import { POSES, DEFAULT_CHARACTER_IMAGE } from './constants';
import { Pose } from './types';
import PoseSelector from './components/PoseSelector';
import ImageDisplay from './components/ImageDisplay';
import Controls from './components/Controls';
import Alert from './components/Alert';
import { generateImageFromPose, editImage, generateCharacterFromText, generateBackgroundFromText, generateBackgroundFromImage } from './services/geminiService';
import FullScreenModal from './components/FullScreenModal';

const base64ToFile = (base64: string, filename: string): File => {
  const arr = base64.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  if (!mimeMatch) {
    throw new Error('Invalid base64 string: MIME type not found.');
  }
  const mime = mimeMatch[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};


const App: React.FC = () => {
  const [characterImage, setCharacterImage] = useState<File | string>(DEFAULT_CHARACTER_IMAGE);
  const [characterImageUrl, setCharacterImageUrl] = useState<string>(DEFAULT_CHARACTER_IMAGE);
  const [selectedPose, setSelectedPose] = useState<Pose>(POSES[1]); // Default to "Standing" pose
  const [prompt, setPrompt] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  const [characterPrompt, setCharacterPrompt] = useState<string>('');
  const [isGeneratingCharacter, setIsGeneratingCharacter] = useState<boolean>(false);
  
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string | null>(null);
  const [backgroundPrompt, setBackgroundPrompt] = useState<string>('');
  const [isGeneratingBackground, setIsGeneratingBackground] = useState<boolean>(false);

  const [apparelImage, setApparelImage] = useState<File | null>(null);
  const [apparelImageUrl, setApparelImageUrl] = useState<string | null>(null);

  const [backgroundStyleImage, setBackgroundStyleImage] = useState<File | null>(null);
  const [backgroundStyleImageUrl, setBackgroundStyleImageUrl] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const clearApparel = () => {
    setApparelImage(null);
    setApparelImageUrl(null);
  }

  const clearBackgroundImage = () => {
    setBackgroundImage(null);
    setBackgroundImageUrl(null);
    setBackgroundPrompt('');
    setBackgroundStyleImage(null);
    setBackgroundStyleImageUrl(null);
  };

  const clearBackgroundStyleImage = () => {
    setBackgroundStyleImage(null);
    setBackgroundStyleImageUrl(null);
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCharacterImage(file);
      setCharacterImageUrl(URL.createObjectURL(file));
      setGeneratedImage(null);
      setCharacterPrompt('');
      clearBackgroundImage();
      clearApparel();
    }
  };
  
  const handleBackgroundFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        setBackgroundImage(file);
        setBackgroundImageUrl(URL.createObjectURL(file));
        setBackgroundStyleImage(null);
        setBackgroundStyleImageUrl(null);
    } else {
        clearBackgroundImage();
    }
  };

  const handleApparelFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        setApparelImage(file);
        setApparelImageUrl(URL.createObjectURL(file));
    } else {
        clearApparel();
    }
  };

  const handleBackgroundStyleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        setBackgroundStyleImage(file);
        setBackgroundStyleImageUrl(URL.createObjectURL(file));
        setBackgroundImage(null);
        setBackgroundImageUrl(null);
    } else {
        clearBackgroundStyleImage();
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
      clearBackgroundImage();
      clearApparel();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unknown error occurred while generating the character.');
    } finally {
      setIsGeneratingCharacter(false);
    }
  };
  
  const handleGenerateBackground = async () => {
    if (!backgroundPrompt) {
      setError("Please enter a description for the background.");
      return;
    }
    setIsGeneratingBackground(true);
    setError('');
    try {
      const resultBase64 = await generateBackgroundFromText(backgroundPrompt);
      setBackgroundImageUrl(resultBase64);
      const backgroundFile = base64ToFile(resultBase64, 'generated-background.png');
      setBackgroundImage(backgroundFile);
      clearBackgroundStyleImage();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unknown error occurred while generating the background.');
    } finally {
      setIsGeneratingBackground(false);
    }
  };

  const handleGenerateBackgroundFromImage = async () => {
    if (!backgroundPrompt || !backgroundStyleImage) {
        setError("Please provide both a style image and a description for the background.");
        return;
    }
    setIsGeneratingBackground(true);
    setError('');
    try {
        const resultBase64 = await generateBackgroundFromImage(backgroundStyleImage, backgroundPrompt);
        setBackgroundImageUrl(resultBase64);
        const backgroundFile = base64ToFile(resultBase64, 'generated-background-from-image.png');
        setBackgroundImage(backgroundFile);
    } catch (err: any) {
        console.error(err);
        setError(err.message || 'An unknown error occurred while generating the background from the image.');
    } finally {
        setIsGeneratingBackground(false);
    }
  };

  const handleGenerateClick = useCallback(async () => {
    setIsLoading(true);
    setError('');
    setGeneratedImage(null);
    try {
      if (selectedPose.id === 'edit' && !prompt && !apparelImage) {
        setError("Please provide editing instructions or an apparel image when using 'Edit Original'.");
        setIsLoading(false);
        return;
      }

      const result =
        selectedPose.id === 'edit'
          ? await editImage(characterImage, prompt, apparelImage)
          : await generateImageFromPose(characterImage, selectedPose.imageUrl, prompt, backgroundImage, apparelImage);
          
      setGeneratedImage(result);
    } catch (err: any)
    {
      console.error(err);
      setError(err.message || 'An unknown error occurred while generating the image.');
    } finally {
      setIsLoading(false);
    }
  }, [characterImage, selectedPose, prompt, backgroundImage, apparelImage]);
  
  const handleOpenFullScreen = () => {
    if (generatedImage) {
      setIsModalOpen(true);
    }
  };

  const handleCloseFullScreen = () => {
    setIsModalOpen(false);
  };

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
                    onBackgroundFileChange={handleBackgroundFileChange}
                    backgroundPrompt={backgroundPrompt}
                    setBackgroundPrompt={setBackgroundPrompt}
                    onGenerateBackground={handleGenerateBackground}
                    isGeneratingBackground={isGeneratingBackground}
                    backgroundImageUrl={backgroundImageUrl}
                    onClearBackground={clearBackgroundImage}
                    onApparelFileChange={handleApparelFileChange}
                    apparelImageUrl={apparelImageUrl}
                    onClearApparel={clearApparel}
                    onBackgroundStyleFileChange={handleBackgroundStyleFileChange}
                    backgroundStyleImageUrl={backgroundStyleImageUrl}
                    onClearBackgroundStyleImage={clearBackgroundStyleImage}
                    onGenerateBackgroundFromImage={handleGenerateBackgroundFromImage}
                />
                <PoseSelector poses={POSES} selectedPose={selectedPose} onSelectPose={setSelectedPose} />
                {error && <Alert message={error} />}
            </div>
          </div>

          <div className="lg:col-span-3">
            <ImageDisplay
              originalImage={characterImageUrl}
              generatedImage={generatedImage}
              isLoading={isLoading || isGeneratingCharacter || isGeneratingBackground}
              onViewFullScreen={handleOpenFullScreen}
            />
          </div>
        </main>
        
        {isModalOpen && generatedImage && (
          <FullScreenModal imageUrl={generatedImage} onClose={handleCloseFullScreen} />
        )}
      </div>
    </div>
  );
};

export default App;