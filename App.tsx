
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { InputCard } from './components/InputCard';
import { ResultsCard } from './components/ResultsCard';
import { Footer } from './components/Footer';
import { HistoryCard } from './components/HistoryCard';
import { Modal } from './components/Modal';
import { Dashboard } from './components/Dashboard';
import { LoginPage } from './components/LoginPage'; // Import LoginPage
import { generateAnalysis } from './services/geminiService';
import { Status, AnalysisResult, InputType } from './types';

type Theme = 'light' | 'dark';
type ModalType = 'about' | 'how' | 'privacy' | null;
type AnalyticsData = Record<string, number>;

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    // Initialize isLoggedIn from localStorage
    return localStorage.getItem('newslenss-logged-in') === 'true';
  });
  const [newsText, setNewsText] = useState<string>('');
  const [inputType, setInputType] = useState<InputType>('Short article (<=500 words)');
  const [status, setStatus] = useState<Status>('idle');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({});
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    return savedTheme || 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'light' ? 'dark' : 'light');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('newslenss-history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
      const savedAnalytics = localStorage.getItem('newslenss-analytics');
      if (savedAnalytics) {
        setAnalyticsData(JSON.parse(savedAnalytics));
      }
    } catch (e) {
      console.error("Failed to parse data from localStorage", e);
      setHistory([]);
      setAnalyticsData({});
    }
  }, []);

  const handleThemeToggle = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleAnalyze = useCallback(async () => {
    if (newsText.length < 20) {
      setError("Please enter a news article or headline (min 20 chars).");
      setStatus('error');
      return;
    }

    setStatus('loading');
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await generateAnalysis(newsText, inputType);
      setAnalysisResult(result);
      setStatus('success');
      
      // Update history
      setHistory(prevHistory => {
        const newHistory = [result, ...prevHistory].slice(0, 10);
        localStorage.setItem('newslenss-history', JSON.stringify(newHistory));
        return newHistory;
      });

      // Update analytics
      setAnalyticsData(prevData => {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const newData = { ...prevData, [today]: (prevData[today] || 0) + 1 };
        localStorage.setItem('newslenss-analytics', JSON.stringify(newData));
        return newData;
      });

    } catch (err) {
      console.error("Analysis failed:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred during analysis.");
      setStatus('error');
    }
  }, [newsText, inputType]);

  const handleClear = () => {
    setNewsText('');
    setStatus('idle');
    setAnalysisResult(null);
    setError(null);
  }

  const handleLoadHistory = (result: AnalysisResult) => {
    setAnalysisResult(result);
    setNewsText(result.inputText);
    setInputType(result.inputType);
    setStatus('success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const handleShowModal = (modal: ModalType) => setActiveModal(modal);
  const handleCloseModal = () => setActiveModal(null);

  const handleLogin = (rememberMe: boolean) => {
    setIsLoggedIn(true);
    if (rememberMe) {
      localStorage.setItem('newslenss-logged-in', 'true');
    } else {
      localStorage.removeItem('newslenss-logged-in');
    }
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header theme={theme} onThemeToggle={handleThemeToggle} onShowModal={handleShowModal} />
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-10">
            <InputCard
              newsText={newsText}
              setNewsText={setNewsText}
              inputType={inputType}
              setInputType={setInputType}
              onAnalyze={handleAnalyze}
              onClear={handleClear}
              status={status}
              error={error}
            />
            {status === 'loading' && (
              <div className="flex justify-center items-center text-indigo-600 dark:text-indigo-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin h-6 w-6 mr-3">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                <span className="text-lg">Analyzing...</span>
              </div>
            )}
            {(status === 'success' || status === 'error') && analysisResult && (
              <ResultsCard 
                result={analysisResult} 
              />
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <HistoryCard history={history} onLoadHistory={handleLoadHistory}/>
              <Dashboard data={analyticsData} />
            </div>
        </div>
      </main>
      <Footer onShowModal={handleShowModal} />
      
      <Modal title="About NEWS lenss" isOpen={activeModal === 'about'} onClose={handleCloseModal}>
        <p className="text-gray-600 dark:text-gray-300">
          NEWS lenss is an AI-powered tool designed to help users critically evaluate news articles and headlines. It analyzes text for common indicators of misinformation, such as sensational language, logical fallacies, and unsourced claims. It provides a risk score, a clear verdict, and actionable next steps to encourage further investigation.
        </p>
      </Modal>

      <Modal title="How It Works" isOpen={activeModal === 'how'} onClose={handleCloseModal}>
        <div className="text-gray-600 dark:text-gray-300 space-y-2">
            <p>
                When you submit a piece of text, our AI model performs a multi-faceted analysis based on a vast dataset of credible and non-credible news sources.
            </p>
            <p>
                It identifies key phrases, assesses the emotional tone, checks for sourcing language, and evaluates the overall structure to produce its assessment. The result is a combination of a quantitative score and qualitative highlights to explain the reasoning.
            </p>
        </div>
      </Modal>

      <Modal title="Privacy Note" isOpen={activeModal === 'privacy'} onClose={handleCloseModal}>
        <div className="text-gray-600 dark:text-gray-300 space-y-2">
            <p>
                We respect your privacy. The news text you enter is sent to the AI for analysis but is not stored on our servers.
            </p>
            <p>
                Your analysis history and usage analytics are saved directly in your browser's local storage and are never transmitted to us. You can clear this history by clearing your browser's site data for NEWS lenss.
            </p>
        </div>
      </Modal>
    </div>
  );
};

export default App;