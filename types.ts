
// FIX: Added InputType and centralized it here for use across the application.
export type InputType = 'Headline' | 'Short article (<=500 words)' | 'Long article';

export type Status = 'idle' | 'loading' | 'success' | 'error';

export type Verdict = 'Likely Real' | 'Possibly False' | 'Likely Fake';

export interface NextStep {
  name: string;
  url: string;
}

export interface Highlight {
  text: string;
  rationale: string;
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  score: number; // 0-100, likelihood of being FAKE
  verdict: Verdict;
  highlights: Highlight[];
  confidence: number; // 0.0 - 1.0
  summary: string;
  nextSteps: NextStep[];
  // Added for history reloading
  inputText: string;
  // FIX: Changed type from 'string' to the more specific 'InputType' to resolve type error in App.tsx.
  inputType: InputType;
}

// FIX: Added missing FactCheckResult and Source types used by FactCheckSection.tsx.
export interface Source {
  web: {
    uri: string;
    title: string;
  };
}

export interface FactCheckResult {
  summary: string;
  sources: Source[];
}
