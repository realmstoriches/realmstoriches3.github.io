
import React, { useState } from 'react';
import { type UserPreferences } from '../types';

interface UserInputFormProps {
  onSubmit: (preferences: UserPreferences) => void;
  initialValues?: UserPreferences | null;
}

export const UserInputForm: React.FC<UserInputFormProps> = ({ onSubmit, initialValues }) => {
  const [websiteType, setWebsiteType] = useState(initialValues?.websiteType || 'Portfolio');
  const [topic, setTopic] = useState(initialValues?.topic || '');
  const [sections, setSections] = useState(initialValues?.sections || 'Hero, About, Projects, Contact');
  const [colorScheme, setColorScheme] = useState(initialValues?.colorScheme || 'Blue and Gray');
  const [specificRequests, setSpecificRequests] = useState(initialValues?.specificRequests || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
        alert("Please provide a main topic or purpose for your website.");
        return;
    }
    onSubmit({ websiteType, topic, sections, colorScheme, specificRequests });
  };

  const commonInputClass = "mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-slate-100 placeholder-slate-400";
  const commonLabelClass = "block text-sm font-medium text-sky-300";

  return (
    <div className="max-w-2xl mx-auto p-6 bg-slate-800 rounded-xl shadow-2xl">
      <h2 className="text-2xl font-semibold text-sky-400 mb-6 text-center">Describe Your Dream Website</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="websiteType" className={commonLabelClass}>Type of Website</label>
          <select
            id="websiteType"
            value={websiteType}
            onChange={(e) => setWebsiteType(e.target.value)}
            className={commonInputClass}
          >
            <option>Portfolio</option>
            <option>Business</option>
            <option>Blog</option>
            <option>E-commerce Product Page</option>
            <option>Landing Page</option>
            <option>Event</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="topic" className={commonLabelClass}>Main Topic/Purpose*</label>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className={commonInputClass}
            placeholder="e.g., Personal photography portfolio, Local bakery services"
            required
          />
        </div>
        <div>
          <label htmlFor="sections" className={commonLabelClass}>Key Sections (comma-separated)</label>
          <input
            type="text"
            id="sections"
            value={sections}
            onChange={(e) => setSections(e.target.value)}
            className={commonInputClass}
            placeholder="e.g., Hero, About Me, Gallery, Testimonials, Contact Form"
          />
           <p className="mt-1 text-xs text-slate-400">Example: Hero, About, Services, Pricing, Contact</p>
        </div>
        <div>
          <label htmlFor="colorScheme" className={commonLabelClass}>Preferred Color Scheme</label>
          <input
            type="text"
            id="colorScheme"
            value={colorScheme}
            onChange={(e) => setColorScheme(e.target.value)}
            className={commonInputClass}
            placeholder="e.g., Dark mode with blue accents, Light and airy pastels"
          />
        </div>
        <div>
          <label htmlFor="specificRequests" className={commonLabelClass}>Specific Requests or Features</label>
          <textarea
            id="specificRequests"
            value={specificRequests}
            onChange={(e) => setSpecificRequests(e.target.value)}
            rows={3}
            className={commonInputClass}
            placeholder="e.g., Include a prominent call-to-action button in the hero section, I need a section for customer logos."
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 transition duration-150 ease-in-out"
          >
            Generate My Website Template
          </button>
        </div>
      </form>
    </div>
  );
};
