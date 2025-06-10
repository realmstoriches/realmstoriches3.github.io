
import React from 'react';

interface TemplatePreviewProps {
  htmlContent: string;
  onRegenerate: () => void;
  onAddToCart: () => void;
  onGoBack: () => void;
}

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({ htmlContent, onRegenerate, onAddToCart, onGoBack }) => {
  return (
    <div className="bg-slate-800 p-4 sm:p-6 rounded-xl shadow-2xl">
      <h2 className="text-2xl font-semibold text-sky-400 mb-6 text-center">Generated Website Preview</h2>
      
      <div className="mb-6 border-4 border-slate-700 rounded-lg overflow-hidden shadow-lg">
        <iframe
          srcDoc={htmlContent}
          title="Website Preview"
          className="w-full h-[60vh] min-h-[500px]"
          sandbox="allow-scripts allow-same-origin" // Allow scripts for interactivity, same-origin for potential relative paths if any (though unlikely with CDN)
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
        <button
          onClick={onGoBack}
          className="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg shadow-md transition duration-150 ease-in-out"
        >
          Back to Form
        </button>
        <button
          onClick={onRegenerate}
          className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold rounded-lg shadow-md transition duration-150 ease-in-out"
        >
          Regenerate
        </button>
        <button
          onClick={onAddToCart}
          className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition duration-150 ease-in-out"
        >
          Add to Cart & Proceed
        </button>
      </div>
    </div>
  );
};
