import React from 'react';

interface FooterProps {
  onShowModal: (modal: 'privacy') => void;
}

export const Footer: React.FC<FooterProps> = ({ onShowModal }) => {
  return (
    <footer className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg mt-10">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>NEWS lenss | AI Analysis Powered by Google Gemini</p>
        <button onClick={() => onShowModal('privacy')} className="text-xs hover:underline mt-1">
          Privacy Note
        </button>
      </div>
    </footer>
  );
};