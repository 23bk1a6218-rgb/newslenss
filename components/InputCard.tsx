
import React from 'react';
import { ZapIcon, SpinnerIcon } from './Icons';
// FIX: Changed import source for InputType from App.tsx to types.ts for consistency.
import { Status, InputType } from '../types';

interface InputCardProps {
  newsText: string;
  setNewsText: (text: string) => void;
  inputType: InputType;
  setInputType: (type: InputType) => void;
  onAnalyze: () => void;
  onClear: () => void;
  status: Status;
  error: string | null;
}

export const InputCard: React.FC<InputCardProps> = ({ newsText, setNewsText, inputType, setInputType, onAnalyze, onClear, status, error }) => {
  const isLoading = status === 'loading';

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg p-6 sm:p-10 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 transition-all duration-300 ease-in-out">
      <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">Check for Misinformation</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Paste a news article or headline below. The AI will analyze its properties to detect potential misinformation.
      </p>

      <div className="mb-4">
        <label htmlFor="input-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Input Type
        </label>
        <select
            id="input-type"
            value={inputType}
            onChange={(e) => setInputType(e.target.value as InputType)}
            className="w-full p-2.5 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 dark:text-gray-200 transition duration-150 ease-in-out bg-white/50 dark:bg-slate-700/50"
            disabled={isLoading}
        >
            <option>Headline</option>
            <option>Short article (&lt;=500 words)</option>
            <option>Long article</option>
        </select>
      </div>
      
      <textarea
        id="news-input"
        rows={8}
        maxLength={50000}
        value={newsText}
        onChange={(e) => setNewsText(e.target.value)}
        className="w-full p-4 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 dark:text-gray-200 transition duration-150 ease-in-out bg-white/50 dark:bg-slate-700/50"
        placeholder="Paste your news text here..."
        disabled={isLoading}
      />

      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex items-center space-x-4">
            <button
              id="analyze-button"
              onClick={onAnalyze}
              disabled={isLoading || !newsText}
              className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all transform duration-150 ease-in-out flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1 active:translate-y-px disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <SpinnerIcon className="w-5 h-5 mr-2" />
                  Checking...
                </>
              ) : (
                <>
                  <ZapIcon className="w-5 h-5 mr-2" />
                  Check
                </>
              )}
            </button>
             <button
              onClick={onClear}
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-3 bg-slate-200 text-slate-700 dark:bg-slate-600 dark:text-slate-200 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 shadow-sm hover:shadow-md transition-all duration-150 ease-in-out flex items-center justify-center disabled:opacity-50"
            >
              Clear
            </button>
        </div>
        <div id="status-message" className="text-sm text-center sm:text-left text-gray-500 dark:text-gray-400 h-5">
          {status === 'error' && <span className="text-red-600 dark:text-red-400">{error}</span>}
          {status === 'success' && <span className="text-green-600 dark:text-green-400">Analysis complete.</span>}
        </div>
      </div>
    </div>
  );
};
