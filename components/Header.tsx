import React from 'react';
import { ShieldCheckIcon, SunIcon, MoonIcon } from './Icons';

type Theme = 'dark' | 'light';

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="relative w-14 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center p-1 transition-colors duration-300 ease-in-out"
      aria-label="Toggle theme"
    >
      <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${theme === 'dark' ? 'translate-x-6' : ''}`}>
        <SunIcon className={`w-full h-full p-1 text-yellow-500 transition-opacity duration-300 ease-in-out ${theme === 'light' ? 'opacity-100' : 'opacity-0'}`} />
        <MoonIcon className={`absolute top-0 left-0 w-full h-full p-1 text-indigo-500 transition-opacity duration-300 ease-in-out ${theme === 'dark' ? 'opacity-100' : 'opacity-0'}`} />
      </div>
    </button>
  );
};

interface HeaderProps {
  theme: Theme;
  onThemeToggle: () => void;
  onShowModal: (modal: 'about' | 'how') => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, onThemeToggle, onShowModal }) => {
  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
          <ShieldCheckIcon className="text-indigo-600 mr-2 h-7 w-7 animate-float" />
          NEWS lenss
        </h1>
        <div className="flex items-center space-x-4">
           <button onClick={() => onShowModal('about')} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">About</button>
           <button onClick={() => onShowModal('how')} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">How It Works</button>
          <ThemeToggle theme={theme} onToggle={onThemeToggle} />
        </div>
      </div>
    </header>
  );
};