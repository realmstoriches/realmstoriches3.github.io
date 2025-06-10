
import React, { useState, useCallback } from 'react';
import { AppView, GeneratedTemplate } from './types';
import UserInputForm from './components/UserInputForm';
import TemplatePreview from './components/TemplatePreview';
import CartView from './components/CartView';
import CheckoutPage from './components/CheckoutPage';
import DownloadDisplay from './components/DownloadDisplay';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import { generateWebsiteTemplate } from './services/geminiService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('input');
  const [generatedTemplate, setGeneratedTemplate] = useState<GeneratedTemplate | null>(null);
  const [cartItem, setCartItem] = useState<GeneratedTemplate | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userInput, setUserInput] = useState<string>('');

  const handleGenerateTemplate = useCallback(async (description: string) => {
    setIsLoading(true);
    setError(null);
    setUserInput(description); // Store user input to re-populate if needed
    try {
      const template = await generateWebsiteTemplate(description);
      setGeneratedTemplate(template);
      setCurrentView('preview');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred while generating the template.');
      }
      setCurrentView('input'); 
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleAddToCart = useCallback(() => {
    if (generatedTemplate) {
      setCartItem(generatedTemplate);
      setCurrentView('cart');
    }
  }, [generatedTemplate]);

  const handleProceedToCheckout = useCallback(() => {
    if (cartItem) {
      setCurrentView('checkout');
    }
  }, [cartItem]);

  const handleConfirmPurchase = useCallback(() => {
    if (cartItem) {
      setCurrentView('download');
    }
  }, [cartItem]);
  
  const handleStartOver = useCallback(() => {
    setGeneratedTemplate(null);
    setCartItem(null);
    // Error is kept if it was an API key issue, otherwise cleared.
    // setError(null); // Decide if error should persist or clear on start over
    setUserInput(''); // Clear previous input for a fresh start
    setCurrentView('input');
  }, []);

  const renderView = () => {
    if (isLoading) {
      return <LoadingSpinner message="Crafting your magnificent template... this may take a moment." />;
    }

    switch (currentView) {
      case 'input':
        return <UserInputForm onSubmit={handleGenerateTemplate} initialError={error} initialPrompt={userInput} onClearError={() => setError(null)} />;
      case 'preview':
        return generatedTemplate && <TemplatePreview template={generatedTemplate} onAddToCart={handleAddToCart} onGenerateNew={handleStartOver} />;
      case 'cart':
        return cartItem && <CartView item={cartItem} onCheckout={handleProceedToCheckout} onBack={() => setCurrentView('preview')} />;
      case 'checkout':
        return cartItem && <CheckoutPage item={cartItem} onConfirm={handleConfirmPurchase} onBack={() => setCurrentView('cart')} />;
      case 'download':
        return cartItem && <DownloadDisplay template={cartItem} onGenerateAnother={handleStartOver} />;
      default:
        return <UserInputForm onSubmit={handleGenerateTemplate} initialError={error} initialPrompt={userInput} onClearError={() => setError(null)} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 flex flex-col items-center p-2 sm:p-4 selection:bg-sky-500 selection:text-white">
      <Header />
      <main className="container mx-auto p-4 md:p-6 lg:p-8 flex-grow w-full max-w-5xl bg-slate-800 bg-opacity-60 shadow-2xl rounded-xl mt-6 mb-6 backdrop-blur-md border border-slate-700">
        {renderView()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
