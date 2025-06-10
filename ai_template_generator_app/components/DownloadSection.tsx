import React from 'react';
import { type GeneratedTemplate } from '../types';

interface DownloadSectionProps {
  purchasedItems: GeneratedTemplate[];
  onGenerateNew: () => void;
}

export const DownloadSection: React.FC<DownloadSectionProps> = ({ purchasedItems, onGenerateNew }) => {
  const downloadFile = (filename: string, content: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const handleDownload = (item: GeneratedTemplate) => {
    const filename = `${item.name.replace(/\s+/g, '_').toLowerCase()}_template.html`;
    downloadFile(filename, item.htmlContent, 'text/html');
  };

  if (purchasedItems.length === 0) {
    return (
      <div className="text-center p-8 bg-slate-800 rounded-xl shadow-2xl">
        <h2 className="text-2xl font-semibold text-sky-400 mb-4">No Items to Download</h2>
        <p className="text-slate-300 mb-6">It seems your purchase was not completed or your cart was empty.</p>
        <button
          onClick={onGenerateNew}
          className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-md transition duration-150 ease-in-out"
        >
          Generate a New Template
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-slate-800 rounded-xl shadow-2xl">
      <div className="text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-400 mx-auto mb-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
        <h2 className="text-3xl font-bold text-green-400 mb-3">Thank You For Your Purchase!</h2>
        <p className="text-slate-300 mb-8 text-lg">Your website template(s) are ready for download.</p>
      </div>

      <div className="space-y-4 mb-8">
        {purchasedItems.map((item) => (
          <div key={item.id} className="p-4 bg-slate-700 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            <div>
              <h3 className="text-lg font-medium text-slate-100">{item.name}</h3>
              <p className="text-sm text-slate-400">Website Template (HTML)</p>
            </div>
            <button
              onClick={() => handleDownload(item)}
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-md transition duration-150 ease-in-out w-full sm:w-auto text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2 -mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Download HTML
            </button>
          </div>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={onGenerateNew}
          className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition duration-150 ease-in-out"
        >
          Create Another Website
        </button>
      </div>
    </div>
  );
};
