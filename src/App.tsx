import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { ChatInterface } from './components/ChatInterface.tsx';
import { KnowledgeExplorer } from './components/KnowledgeExplorer.tsx';
import { TestRunnerView } from './components/TestRunnerView.tsx';
import { VivaReviewHub } from './components/VivaReviewHub.tsx';
import { ActiveTab, ChatMessage, FAQItem, TestCaseResult, TestSummary } from './types.ts';
import { ShieldAlert, X, GraduationCap, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('chat');
  const [language, setLanguage] = useState<'auto' | 'en' | 'te'>('auto');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const [isAiActive, setIsAiActive] = useState(true);
  const [sessionId] = useState(() => `session-${Date.now()}`);

  // Fetch initial health and FAQs
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [healthRes, faqsRes] = await Promise.all([
          fetch('/api/health'),
          fetch('/api/faqs'),
        ]);

        if (healthRes.ok) {
          const healthData = await healthRes.json();
          setIsAiActive(Boolean(healthData.geminiConfigured));
        }

        if (faqsRes.ok) {
          const faqsData = await faqsRes.json();
          setFaqs(faqsData.faqs || []);
        }
      } catch (err) {
        console.warn('Could not load initial backend data:', err);
      }
    }

    loadInitialData();
  }, []);

  // Send message handler
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sessionId,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          sessionId,
          language,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sessionId,
        sender: 'bot',
        text: data.answer,
        timestamp: data.timestamp || new Date().toISOString(),
        source: data.source,
        category: data.category,
        confidence: data.confidence,
        matchedFaqId: data.matchedFaq?.id,
        language: data.language,
        suggestions: data.suggestions,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('Error contacting chat endpoint:', err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        sessionId,
        sender: 'bot',
        text:
          'I encountered a communication issue connecting to the academic query service. ' +
          'Please ensure the backend is running, or consult your Department Academic Advisor in Person.',
        timestamp: new Date().toISOString(),
        source: 'FALLBACK',
        category: 'System Communication',
        confidence: 0,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear chat handler
  const handleClearChat = async () => {
    try {
      await fetch('/api/clear-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });
    } catch (err) {
      console.warn('Could not clear history on server:', err);
    }
    setMessages([]);
  };

  // Add new FAQ handler
  const handleAddFaq = async (newFaq: Partial<FAQItem>): Promise<boolean> => {
    try {
      const res = await fetch('/api/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFaq),
      });

      if (res.ok) {
        const data = await res.json();
        setFaqs((prev) => [data.faq, ...prev]);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to add FAQ:', err);
      return false;
    }
  };

  // Run test suite handler
  const handleRunTests = async (): Promise<{
    summary: TestSummary;
    tests: TestCaseResult[];
  } | null> => {
    try {
      const res = await fetch('/api/test-suite', { method: 'POST' });
      if (res.ok) {
        return await res.json();
      }
      return null;
    } catch (err) {
      console.error('Test runner request failed:', err);
      return null;
    }
  };

  const handleSelectFaqFromExplorer = (question: string) => {
    setActiveTab('chat');
    handleSendMessage(question);
  };

  return (
    <div className="flex h-screen flex-col bg-slate-100 font-sans text-slate-800 antialiased overflow-hidden">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
        onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
        faqCount={faqs.length}
        isAiActive={isAiActive}
      />

      {/* Main Viewport */}
      <main className="flex-1 overflow-hidden relative">
        {activeTab === 'chat' && (
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            onClearChat={handleClearChat}
            language={language}
          />
        )}

        {activeTab === 'faqs' && (
          <div className="h-full overflow-y-auto">
            <KnowledgeExplorer
              faqs={faqs}
              onSelectQuestion={handleSelectFaqFromExplorer}
              onAddFaq={handleAddFaq}
            />
          </div>
        )}

        {activeTab === 'tests' && (
          <div className="h-full overflow-y-auto">
            <TestRunnerView onRunTests={handleRunTests} />
          </div>
        )}

        {activeTab === 'review' && (
          <div className="h-full overflow-y-auto">
            <VivaReviewHub />
          </div>
        )}
      </main>

      {/* Academic Disclaimer & Project Metadata Modal */}
      {isDisclaimerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    AI Student Query Chatbot
                  </h3>
                  <p className="text-xs text-slate-500">
                    Academic Engineering Project • Final Evaluation
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDisclaimerOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-xs text-slate-600 leading-relaxed">
              <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-3.5 text-amber-900">
                <div className="flex items-start gap-2">
                  <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-amber-800">
                      Demonstration Knowledge Base Disclaimer
                    </h4>
                    <p className="mt-0.5 text-xs text-amber-900/90 leading-relaxed">
                      This application incorporates a configurable demonstration knowledge base representing typical university engineering regulations (minimum 75% attendance, 10-point CGPA, 160 credits, etc.). Sample data is clearly demarcated for academic evaluation and should not be confused with unverified college policies.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1">Project Metadata:</h4>
                <ul className="space-y-1 text-slate-600">
                  <li>• <strong>Architecture:</strong> Hybrid AI (Gemini 3.8 Flash + Local Policy Matcher)</li>
                  <li>• <strong>Bilingual Support:</strong> English and Telugu (తెలుగు)</li>
                  <li>• <strong>Frameworks:</strong> React 19, TypeScript, Tailwind CSS, FastAPI / Express</li>
                  <li>• <strong>Safety Guardrails:</strong> Strict zero-hallucination grounding (Temp = 0.3)</li>
                  <li>• <strong>Testing:</strong> Automated 8-vector Test Suite with &lt;10ms local retrieval</li>
                </ul>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/80">
                <span className="font-bold text-slate-700">Project Review Tomorrow?</span>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  Switch to the <strong>"Review & Viva Hub"</strong> tab in the navigation bar to access the 10-slide deck with speaker notes, elevator speech scripts, and top 7 viva answers!
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end border-t border-slate-100 pt-3">
              <button
                onClick={() => setIsDisclaimerOpen(false)}
                className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white hover:bg-indigo-700 shadow-sm cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
