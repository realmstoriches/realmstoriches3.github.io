
import React, { useState } from 'react';
import { GeneratedTemplate } from '../types';
import Button from './Button';
import Card from './Card';
import { CopyIcon } from './icons/CopyIcon';
import { SparklesIcon } from './icons/SparklesIcon'; // For "Generate Another" button
import { CheckIcon } from './icons/CheckIcon';

interface DownloadDisplayProps {
  template: GeneratedTemplate;
  onGenerateAnother: () => void;
}

const DownloadDisplay: React.FC<DownloadDisplayProps> = ({ template, onGenerateAnother }) => {
  const [htmlCopySuccess, setHtmlCopySuccess] = useState<boolean>(false);
  const [cssCopySuccess, setCssCopySuccess] = useState<boolean>(false);

  const handleCopy = async (text: string, type: 'HTML' | 'CSS') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'HTML') {
        setHtmlCopySuccess(true);
        setTimeout(() => setHtmlCopySuccess(false), 2000);
      } else {
        setCssCopySuccess(true);
        setTimeout(() => setCssCopySuccess(false), 2000);
      }
    } catch (err) {
      console.error(`Failed to copy ${type}: `, err);
      alert(`Failed to copy ${type}. Please copy manually.`);
    }
  };

  const FileDisplayCard: React.FC<{ title: string; content: string; language: string; onCopy: () => void; copySuccess: boolean }> = 
    ({ title, content, language, onCopy, copySuccess }) => (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-semibold text-sky-300">{title}</h3>
        <Button onClick={onCopy} variant="ghost" size="sm" leftIcon={copySuccess ? <CheckIcon className="w-4 h-4 text-green-400" /> : <CopyIcon className="w-4 h-4" />}>
          {copySuccess ? 'Copied!' : 'Copy'}
        </Button>
      </div>
      <textarea
        readOnly
        className="w-full h-64 p-3 font-mono text-sm bg-slate-900 border border-slate-700 rounded-md text-slate-300 focus:ring-1 focus:ring-sky-500 focus:outline-none resize-none"
        value={content}
        wrap="off"
      />
      <p className="text-xs text-slate-500 mt-1">Filename suggestion: <code className="bg-slate-700 px-1 rounded">template.{language === 'HTML' ? 'html' : 'css'}</code></p>
    </div>
  );

  return (
    <Card title="Download Your Template Files">
      <p className="text-slate-300 mb-2">
        Congratulations! Your template "<span className="font-semibold text-sky-400">{template.name}</span>" is ready.
      </p>
      <p className="text-slate-400 mb-8 text-sm">
        Copy the code below and save it into appropriate files (e.g., <code className="bg-slate-700 px-1 rounded">index.html</code> and <code className="bg-slate-700 px-1 rounded">style.css</code>).
        The HTML file already includes the CSS in a <code className="bg-slate-700 px-1 rounded">&lt;style&gt;</code> tag for convenience.
      </p>

      <FileDisplayCard 
        title="HTML Code" 
        content={template.html} 
        language="HTML" 
        onCopy={() => handleCopy(template.html, 'HTML')}
        copySuccess={htmlCopySuccess}
      />
      <FileDisplayCard 
        title="CSS Code (Separate)" 
        content={template.css} 
        language="CSS" 
        onCopy={() => handleCopy(template.css, 'CSS')}
        copySuccess={cssCopySuccess}
      />
      
      <div className="mt-10 text-center">
        <Button onClick={onGenerateAnother} variant="primary" size="lg" leftIcon={<SparklesIcon className="w-5 h-5" />}>
          Generate Another Template
        </Button>
      </div>
    </Card>
  );
};

export default DownloadDisplay;
