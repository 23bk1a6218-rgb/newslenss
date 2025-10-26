
import React from 'react';
import { AnalysisResult } from '../types';
import { HistoryIcon, CheckCircleIcon, XCircleIcon, AlertTriangleIcon } from './Icons';

interface HistoryCardProps {
  history: AnalysisResult[];
  onLoadHistory: (result: AnalysisResult) => void;
}

const VerdictIcon: React.FC<{ score: number }> = ({ score }) => {
    if (score >= 67) return <XCircleIcon className="w-5 h-5 text-red-500 flex-shrink-0" />;
    if (score >= 34) return <AlertTriangleIcon className="w-5 h-5 text-yellow-500 flex-shrink-0" />;
    return <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />;
};


export const HistoryCard: React.FC<HistoryCardProps> = ({ history, onLoadHistory }) => {
  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg p-6 sm:p-8 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 h-full">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
        <HistoryIcon className="text-indigo-600 dark:text-indigo-400 mr-3 h-6 w-6" />
        Analysis History
      </h2>
      {history.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">Your recent analyses will appear here.</p>
      ) : (
        <ul className="space-y-3 max-h-80 lg:max-h-full overflow-y-auto pr-2">
          {history.map((item) => (
            <li key={item.id}>
              <button 
                onClick={() => onLoadHistory(item)}
                className="w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-150 flex items-start space-x-3"
                aria-label={`Load analysis from ${new Date(item.timestamp).toLocaleString()}`}
              >
                <VerdictIcon score={item.score} />
                <div className="flex-grow overflow-hidden">
                  <p className="font-semibold text-gray-800 dark:text-gray-200 truncate">
                    {item.inputText}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="text-sm font-bold text-gray-600 dark:text-gray-300">{item.score}%</div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
