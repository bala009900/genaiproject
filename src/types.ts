export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  keywords: string[];
  teluguQuestion?: string;
  teluguAnswer?: string;
  verified: boolean;
  lastUpdated?: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  source?: 'KNOWLEDGE_BASE' | 'HYBRID_AI' | 'GENERATIVE_AI' | 'FALLBACK';
  category?: string;
  confidence?: number;
  matchedFaqId?: string;
  language?: 'en' | 'te';
  helpful?: boolean;
  suggestions?: string[];
}

export interface TestCaseResult {
  testId: string;
  name: string;
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
  latencyMs: number;
}

export interface TestSummary {
  totalTests: number;
  passed: number;
  failed: number;
  passRate: string;
  status: string;
  timestamp: string;
}

export type ActiveTab = 'chat' | 'faqs' | 'tests' | 'review';
