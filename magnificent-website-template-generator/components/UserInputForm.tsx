
import React, { useState, useEffect } from 'react';
import Button from './Button';
import Card from './Card';
import { SparklesIcon } from './icons/SparklesIcon'; // Assuming you create this icon

interface UserInputFormProps {
  onSubmit: (description: string) => void;
  initialError: string | null;
  initialPrompt: string;
  onClearError: () => void;
}

const UserInputForm: React.FC<UserInputFormProps> = ({ onSubmit, initialError, initialPrompt, onClearError }) => {
  const [description, setDescription] = useState<string>(initialPrompt);
  const [error, setError] = useState<string | null>(initialError);

  useEffect(() => {
    setError(initialError);
  }, [initialError]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setError("Please describe the website template you'd like to create.");
      return;
    }
    setError(null);
    onClearError();
    onSubmit(description);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    if (error) {
      setError(null);
      onClearError();
    }
  };

  return (
    <Card title="Describe Your Dream Website" titleIcon={<SparklesIcon className="w-7 h-7" />}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-1">
            Template Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={6}
            className="block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-slate-100 resize-none"
            placeholder="e.g., A modern portfolio for a photographer, clean and minimalist, with a gallery page and a contact form."
            value={description}
            onChange={handleChange}
          />
          <p className="mt-2 text-xs text-slate-400">
            Be as descriptive as possible for the best results. Mention style, purpose, key features, color preferences, etc.
          </p>
        </div>

        {error && (
          <div className="bg-red-700/50 border border-red-600 text-red-200 px-4 py-3 rounded-md text-sm" role="alert">
            <p className="font-semibold">Generation Error:</p>
            <p>{error}</p>
          </div>
        )}

        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="lg" leftIcon={<SparklesIcon className="w-5 h-5" />}>
            Generate Template
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default UserInputForm;
