import React, { useRef, useState } from 'react';
import { AnalysisResult } from '../types';
import { BarChartIcon, CheckCircleIcon, XCircleIcon, AlertTriangleIcon, ExternalLinkIcon, ClipboardIcon, DownloadIcon } from './Icons';

// @ts-ignore
const { jsPDF } = window.jspdf;
// @ts-ignore
const html2canvas = window.html2canvas;


interface ResultsCardProps {
  result: AnalysisResult;
}

export const ResultsCard: React.FC<ResultsCardProps> = ({ result }) => {
  const { score, verdict, summary, highlights, confidence, nextSteps } = result;
  const resultsCardRef = useRef<HTMLDivElement>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

  const getVerdictStyles = () => {
    if (score >= 67) {
      return {
        borderColor: 'border-red-500',
        textColor: 'text-red-600 dark:text-red-400',
        barColor: 'bg-red-500',
        icon: <XCircleIcon className="w-8 h-8 mr-2" />,
        verdictText: 'Likely Fake'
      };
    } else if (score >= 34) {
      return {
        borderColor: 'border-yellow-500',
        textColor: 'text-yellow-600 dark:text-yellow-400',
        barColor: 'bg-yellow-500',
        icon: <AlertTriangleIcon className="w-8 h-8 mr-2" />,
        verdictText: 'Possibly False'
      };
    } else {
      return {
        borderColor: 'border-green-500',
        textColor: 'text-green-600 dark:text-green-400',
        barColor: 'bg-green-500',
        icon: <CheckCircleIcon className="w-8 h-8 mr-2" />,
        verdictText: 'Likely Real'
      };
    }
  };

  const { borderColor, textColor, barColor, icon, verdictText } = getVerdictStyles();

  const handleDownloadPdf = () => {
    if (resultsCardRef.current) {
        html2canvas(resultsCardRef.current, { scale: 2 }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save(`NEWS_lenss_Analysis_${result.id.slice(0, 8)}.pdf`);
        });
    }
  };

  const handleCopy = () => {
    const copyText = `
NEWS lenss Analysis Report
--------------------------
Verdict: ${verdictText} (Score: ${score}/100)
Summary: ${summary}
Highlights:
${highlights.map(h => `- "${h.text}" (Reason: ${h.rationale})`).join('\n')}
--------------------------
Analyzed with NEWS lenss
    `;
    navigator.clipboard.writeText(copyText.trim());
    setCopyStatus('copied');
    setTimeout(() => setCopyStatus('idle'), 2000);
  };

  return (
    <div ref={resultsCardRef} className={`bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg p-6 sm:p-8 rounded-xl shadow-xl border-t-4 ${borderColor} transition-all duration-300 ease-in-out`}>
      <div className="flex justify-between items-start">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
          <BarChartIcon className="text-indigo-600 dark:text-indigo-400 mr-3 h-7 w-7" />
          Analysis Results
        </h2>
        <div className="flex space-x-2">
           <button onClick={handleCopy} aria-label="Copy results" className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700">
             <ClipboardIcon className="w-5 h-5"/>
           </button>
           <button onClick={handleDownloadPdf} aria-label="Download as PDF" className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700">
             <DownloadIcon className="w-5 h-5"/>
           </button>
        </div>
      </div>
       {copyStatus === 'copied' && <div className="text-sm text-green-600 dark:text-green-400 absolute right-8 top-16 bg-white dark:bg-slate-700 px-2 py-1 rounded shadow-lg">Copied!</div>}
      
      {/* Verdict and Score */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className={`bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg border border-gray-200 dark:border-slate-700 flex flex-col justify-center text-center ${textColor}`}>
           <div className="flex items-center justify-center text-3xl font-extrabold">
             {icon}
             <span>{verdictText}</span>
           </div>
        </div>
        <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Fake News Probability Score</p>
          <p className={`text-3xl font-extrabold ${textColor} mt-1`}>{score}<span className="text-lg">%</span></p>
          <div className="h-3 bg-gray-200 dark:bg-slate-600 rounded-full mt-2">
            <div className={`h-3 ${barColor} rounded-full transition-all duration-500`} style={{ width: `${score}%` }}></div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Summary</h3>
        <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300">
          {summary}
        </div>
      </div>

      {/* Highlights */}
      {highlights && highlights.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Explainability Highlights</h3>
          <div className="space-y-3">
            {highlights.map((highlight, index) => (
              <div key={index} className={`p-3 border-l-4 ${borderColor} bg-gray-50 dark:bg-slate-700/50 rounded-r-lg`}>
                <blockquote className="italic text-gray-600 dark:text-gray-300">
                  "{highlight.text}"
                </blockquote>
                <p className="text-sm font-semibold mt-2 text-gray-700 dark:text-gray-200">{highlight.rationale}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Confidence & Limitations */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Model Confidence & Limitations</h3>
        <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 space-y-3">
            <div className="flex items-center">
                <p className="font-semibold mr-2">Confidence:</p>
                <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-4">
                   <div className="bg-indigo-500 h-4 rounded-full text-xs font-medium text-blue-100 text-center p-0.5 leading-none" style={{width: `${confidence * 100}%`}}>
                     {Math.round(confidence * 100)}%
                   </div>
                </div>
            </div>
            <p className="text-xs italic text-gray-500 dark:text-gray-400">Disclaimer: This tool provides a probabilistic assessment and is not a substitute for human judgment. Always verify information from multiple reputable sources.</p>
        </div>
      </div>


      {/* Next Steps */}
      {nextSteps && nextSteps.length > 0 && (
         <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
             <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Suggested Next Steps</h3>
             <ul className="space-y-2">
                 {nextSteps.map((step, index) => (
                     <li key={index} className="p-3 bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-700/50 rounded-lg">
                         <a
                             href={step.url}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="font-medium text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-200 hover:underline flex items-center"
                         >
                            {step.name}
                            <ExternalLinkIcon className="w-4 h-4 ml-1.5"/>
                         </a>
                     </li>
                 ))}
             </ul>
         </div>
      )}

    </div>
  );
};