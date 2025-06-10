
import React from 'react';
import { GeneratedTemplate } from '../types';
import Button from './Button';
import Card from './Card';
import { CartIcon } from './icons/CartIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface TemplatePreviewProps {
  template: GeneratedTemplate;
  onAddToCart: () => void;
  onGenerateNew: () => void;
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({ template, onAddToCart, onGenerateNew }) => {
  return (
    <Card className="w-full">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-sky-400 mb-1">{template.name}</h2>
        <p className="text-slate-400 italic">Your AI-generated template preview:</p>
      </div>
      
      <div className="border-2 border-slate-700 rounded-lg shadow-lg overflow-hidden mb-6 bg-white">
        <iframe
          srcDoc={template.html}
          title="Template Preview"
          className="w-full h-[600px] template-preview-iframe" // Custom scrollbar class applied in index.html
          sandbox="allow-scripts allow-same-origin" // allow-scripts if templates might have JS, same-origin for asset loading within iframe
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <Button onClick={onGenerateNew} variant="outline" size="md" leftIcon={<SparklesIcon className="w-5 h-5" />}>
          Generate New
        </Button>
        <Button onClick={onAddToCart} variant="primary" size="lg" leftIcon={<CartIcon className="w-5 h-5" />}>
          Add to Cart & Proceed
        </Button>
      </div>
    </Card>
  );
};

export default TemplatePreview;
