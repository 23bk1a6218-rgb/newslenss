import React from 'react';
import { FactCheckResult } from '../types';
import { XCircleIcon } from './Icons';

interface FactCheckSectionProps {
  result: FactCheckResult | null;
  error: string | null;
}

export const FactCheckSection: React.FC<FactCheckSectionProps> = ({ result, error }) => {
  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/40 border border-red-200 dark:border-red-700/50 text-red-700 dark:text-red-300 rounded-lg flex items-start">
        <XCircleIcon className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold">Fact-Check Failed</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Factual Summary</h4>
        <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
          {result.summary}
        </div>
      </div>
      {result.sources.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Sources Found</h4>
          <ul className="space-y-2">
            {result.sources.map((source, index) => (
              <li key={index} className="p-3 bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-700/50 rounded-lg">
                <a
                  href={source.web.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-200 hover:underline break-words"
                >
                  {source.web.title || source.web.uri}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};