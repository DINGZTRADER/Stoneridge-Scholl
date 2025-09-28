import React, { useState } from 'react';
import { generateContent } from '../services/geminiService';
import Spinner from './shared/Spinner';
import LightBulbIcon from './icons/LightBulbIcon';
import EnvelopeIcon from './icons/EnvelopeIcon';
import MegaphoneIcon from './icons/MegaphoneIcon';

type ToolType = 'EmailDrafter' | 'AnnouncementCreator' | 'ActivityPlanner';

interface ToolContainerProps {
  tool: ToolType;
  title: string;
  description: string;
  placeholder: string;
}

const ToolContainer: React.FC<ToolContainerProps> = ({ tool, title, description, placeholder }) => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setResult('');
    setError(null);
    try {
      const response = await generateContent(prompt, tool);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const getIcon = () => {
    switch (tool) {
      case 'EmailDrafter': return <EnvelopeIcon className="w-8 h-8 text-stoneridge-green" />;
      case 'AnnouncementCreator': return <MegaphoneIcon className="w-8 h-8 text-stoneridge-green" />;
      case 'ActivityPlanner': return <LightBulbIcon className="w-8 h-8 text-stoneridge-green" />;
      default: return null;
    }
  }

  const formattedResult = result.split('\n').map((str, index, array) => (
    <React.Fragment key={index}>
      {str}
      {index === array.length - 1 ? null : <br />}
    </React.Fragment>
  ));

  return (
    <div className="p-8 h-full overflow-y-auto bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-start gap-4 mb-6">
          <div className="bg-white p-3 rounded-full shadow-sm">
            {getIcon()}
          </div>
          <div>
            <h2 className="text-3xl font-bold text-stoneridge-green">{title}</h2>
            <p className="text-gray-600 mt-1">{description}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-4 bg-red-50 text-red-700 border border-red-200 rounded-md" role="alert">
                <p className="font-bold">An error occurred</p>
                <p>{error}</p>
              </div>
            )}
            <label htmlFor="prompt-textarea" className="block text-sm font-medium text-gray-700 mb-2">
              Your Request
            </label>
            <textarea
              id="prompt-textarea"
              rows={5}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={placeholder}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-stoneridge-gold focus:border-stoneridge-gold transition"
              disabled={isLoading}
            />
            <div className="mt-4 text-right">
              <button
                type="submit"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-stoneridge-green hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stoneridge-green disabled:bg-gray-400 min-w-[180px]"
                disabled={!prompt.trim() || isLoading}
              >
                {isLoading ? <Spinner /> : 'Generate Content'}
              </button>
            </div>
          </form>
        </div>

        {(isLoading || result) && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-stoneridge-green mb-4">Generated Content</h3>
            <div className="bg-white p-6 rounded-lg shadow-sm prose max-w-none">
              {isLoading && !result ? (
                <div className="flex justify-center items-center py-8">
                  <Spinner />
                </div>
              ) : (
                <div className="whitespace-pre-wrap text-gray-800">{formattedResult}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolContainer;
