import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Copy,
  Check,
  Volume2,
  VolumeX,
  ThumbsUp,
  ThumbsDown,
  Trash2,
  Download,
  AlertCircle,
  HelpCircle,
  CornerDownRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { ChatMessage } from '../types.ts';
import { QuickActionCards } from './QuickActionCards.tsx';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  onClearChat: () => void;
  language: 'auto' | 'en' | 'te';
}

// Clean helper to parse lightweight markdown safely
function renderFormattedMessage(text: string) {
  const lines = text.split('\n');
  return (
    <div className="space-y-1.5 text-sm leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        // Empty line
        if (!trimmed) {
          return <div key={idx} className="h-1.5" />;
        }

        // Bullet point
        if (trimmed.startsWith('•') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const content = trimmed.replace(/^[•\-\*]\s*/, '');
          return (
            <div key={idx} className="flex items-start gap-2 pl-2">
              <span className="text-indigo-600 font-bold mt-1 text-xs">•</span>
              <span dangerouslySetInnerHTML={{ __html: formatInline(content) }} />
            </div>
          );
        }

        // Heading
        if (trimmed.startsWith('### ') || trimmed.startsWith('## ')) {
          const heading = trimmed.replace(/^#{2,3}\s*/, '');
          return (
            <h4 key={idx} className="font-bold text-slate-900 pt-1 text-sm border-b border-slate-100 pb-0.5">
              {heading}
            </h4>
          );
        }

        // Regular paragraph
        return (
          <p key={idx} dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
        );
      })}
    </div>
  );
}

function formatInline(str: string): string {
  return str
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic text-slate-700">$1</em>')
    .replace(/`([^`]+)`/g, '<code class="rounded bg-slate-100 px-1 py-0.5 text-xs font-mono text-indigo-700 border border-slate-200">$1</code>');
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  isLoading,
  onClearChat,
  language,
}) => {
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Adjust textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputText]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const text = inputText;
    setInputText('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    await onSendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*•`#]/g, ' ');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleFeedback = async (msgId: string, helpful: boolean) => {
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId: msgId, helpful }),
      });
      setFeedbackGiven((prev) => ({ ...prev, [msgId]: helpful }));
    } catch (err) {
      console.warn('Could not record feedback:', err);
    }
  };

  const exportChatHistory = () => {
    if (messages.length === 0) return;
    const content = messages
      .map(
        (m) =>
          `[${m.timestamp}] ${m.sender.toUpperCase()} (${m.source || 'USER'}):\n${m.text}\n`
      )
      .join('\n---\n\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `academic_query_chat_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const starterSuggestions = [
    'What is the minimum attendance required for examinations?',
    'When are mid-term and end-semester exams scheduled?',
    'How do I apply for paper revaluation and recounting?',
    'What are the rules regarding assignment submission & plagiarism?',
    'Who is the CSE HOD and what are faculty office hours?',
    'What are the Central Library timings and book limits?',
  ];

  return (
    <div className="flex h-full flex-col bg-slate-50">
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 md:px-8">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Welcome Screen when no messages */}
          {messages.length === 0 && (
            <div className="space-y-6 py-4 animate-in fade-in duration-300">
              <div className="rounded-2xl border border-indigo-100 bg-linear-to-b from-indigo-50/70 via-white to-white p-6 shadow-xs text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-200">
                  <Sparkles className="h-7 w-7" />
                </div>
                <h2 className="mt-3 text-xl font-extrabold text-slate-900 tracking-tight sm:text-2xl">
                  AI Student Query Assistant
                </h2>
                <p className="mt-2 text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
                  Ask any question regarding curriculum, examination timetables, 75% attendance policy, laboratory evaluations, faculty contacts, or campus amenities.
                </p>

                {/* Demonstration Alert Banner */}
                <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-amber-50 px-3.5 py-1.5 text-xs font-semibold text-amber-800 border border-amber-200">
                  <ShieldCheck className="h-4 w-4 text-amber-600" />
                  <span>Demonstration Academic Knowledge Base: Verified institutional sample data.</span>
                </div>
              </div>

              {/* Quick Action Domain Cards */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-1">
                  Explore Academic Categories
                </h3>
                <QuickActionCards onSelectQuery={(q) => onSendMessage(q)} />
              </div>

              {/* Quick Starters */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-1 flex items-center gap-1.5">
                  <HelpCircle className="h-3.5 w-3.5" /> Frequently Asked Questions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {starterSuggestions.map((query, i) => (
                    <button
                      key={i}
                      onClick={() => onSendMessage(query)}
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 text-left text-xs font-medium text-slate-700 shadow-2xs hover:border-indigo-300 hover:bg-indigo-50/40 hover:text-indigo-900 transition-all cursor-pointer"
                    >
                      <span className="line-clamp-1">{query}</span>
                      <CornerDownRight className="h-3.5 w-3.5 text-slate-400 shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Chat Messages */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {/* Bot Avatar */}
              {msg.sender === 'bot' && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-tr from-indigo-700 to-blue-600 text-white shadow-sm mt-0.5">
                  <Bot className="h-5 w-5" />
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 shadow-xs transition-all ${
                  msg.sender === 'user'
                    ? 'bg-linear-to-tr from-indigo-600 to-indigo-700 text-white rounded-tr-xs'
                    : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs'
                }`}
              >
                {/* Header for Bot Message (Source and Category Badges) */}
                {msg.sender === 'bot' && (
                  <div className="mb-2.5 flex flex-wrap items-center justify-between gap-1.5 border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-1.5">
                      {msg.source === 'KNOWLEDGE_BASE' && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 border border-emerald-200">
                          <ShieldCheck className="h-3 w-3" /> Official Knowledge Base
                        </span>
                      )}
                      {msg.source === 'HYBRID_AI' && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-800 border border-indigo-200">
                          <Sparkles className="h-3 w-3 text-indigo-600" /> AI-Grounded Response
                        </span>
                      )}
                      {msg.source === 'GENERATIVE_AI' && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-800 border border-blue-200">
                          <Bot className="h-3 w-3 text-blue-600" /> General Academic AI
                        </span>
                      )}
                      {msg.source === 'FALLBACK' && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-800 border border-amber-200">
                          <AlertCircle className="h-3 w-3 text-amber-600" /> Institutional Fallback
                        </span>
                      )}

                      {msg.category && (
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                          {msg.category}
                        </span>
                      )}
                    </div>

                    {msg.confidence !== undefined && (
                      <span className="text-[10px] font-semibold text-slate-400">
                        {msg.confidence}% Match
                      </span>
                    )}
                  </div>
                )}

                {/* Message Body */}
                {msg.sender === 'user' ? (
                  <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">
                    {msg.text}
                  </p>
                ) : (
                  renderFormattedMessage(msg.text)
                )}

                {/* Bot Message Action Toolbar */}
                {msg.sender === 'bot' && (
                  <div className="mt-3.5 flex flex-wrap items-center justify-between border-t border-slate-100 pt-2 text-xs text-slate-500">
                    <span className="text-[11px] text-slate-400">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>

                    <div className="flex items-center gap-1">
                      {/* Text-to-Speech */}
                      <button
                        onClick={() => handleSpeak(msg.id, msg.text)}
                        className={`flex h-7 w-7 items-center justify-center rounded-md hover:bg-slate-100 transition-colors ${
                          speakingId === msg.id ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400'
                        }`}
                        title={speakingId === msg.id ? 'Stop listening' : 'Listen to answer'}
                      >
                        {speakingId === msg.id ? (
                          <VolumeX className="h-3.5 w-3.5" />
                        ) : (
                          <Volume2 className="h-3.5 w-3.5" />
                        )}
                      </button>

                      {/* Copy Text */}
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-slate-100 text-slate-400 transition-colors"
                        title="Copy answer"
                      >
                        {copiedId === msg.id ? (
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>

                      {/* Helpful Feedback */}
                      <div className="flex items-center border-l border-slate-200 pl-1 ml-1">
                        <button
                          onClick={() => handleFeedback(msg.id, true)}
                          className={`flex h-7 w-7 items-center justify-center rounded-md hover:bg-slate-100 transition-colors ${
                            feedbackGiven[msg.id] === true
                              ? 'text-emerald-600 bg-emerald-50'
                              : 'text-slate-400'
                          }`}
                          title="Helpful answer"
                        >
                          <ThumbsUp className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleFeedback(msg.id, false)}
                          className={`flex h-7 w-7 items-center justify-center rounded-md hover:bg-slate-100 transition-colors ${
                            feedbackGiven[msg.id] === false
                              ? 'text-rose-600 bg-rose-50'
                              : 'text-slate-400'
                          }`}
                          title="Not helpful"
                        >
                          <ThumbsDown className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Follow-up Suggestions Chips */}
                {msg.sender === 'bot' && msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-100">
                    <p className="text-[11px] font-semibold text-slate-500 mb-1.5">
                      Suggested follow-ups:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestions.map((sug, idx) => (
                        <button
                          key={idx}
                          onClick={() => onSendMessage(sug)}
                          className="rounded-lg bg-indigo-50/70 hover:bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-700 transition-colors border border-indigo-200/60 text-left"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User Avatar */}
              {msg.sender === 'user' && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-white shadow-sm mt-0.5">
                  <User className="h-5 w-5" />
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-tr from-indigo-700 to-blue-600 text-white shadow-sm">
                <Bot className="h-5 w-5" />
              </div>
              <div className="rounded-2xl rounded-tl-xs border border-slate-200 bg-white px-4 py-3 shadow-xs">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-indigo-600 animate-bounce"></span>
                  <span
                    className="h-2 w-2 rounded-full bg-indigo-600 animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  ></span>
                  <span
                    className="h-2 w-2 rounded-full bg-indigo-600 animate-bounce"
                    style={{ animationDelay: '0.4s' }}
                  ></span>
                  <span className="ml-2 text-xs font-semibold text-slate-500">
                    Consulting academic knowledge base...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Toolbar Area */}
      <div className="border-t border-slate-200 bg-white p-3 sm:p-4 shadow-sm">
        <div className="mx-auto max-w-4xl">
          {/* Action Row: Clear Chat & Export */}
          {messages.length > 0 && (
            <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium text-slate-400">
                Active Session • {messages.length} messages
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={exportChatHistory}
                  className="flex items-center gap-1 rounded-md px-2 py-1 hover:bg-slate-100 text-slate-600 transition-colors"
                  title="Export chat transcript"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export Chat</span>
                </button>
                <button
                  onClick={onClearChat}
                  className="flex items-center gap-1 rounded-md px-2 py-1 hover:bg-rose-50 text-rose-600 transition-colors"
                  title="Reset conversation"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Clear</span>
                </button>
              </div>
            </div>
          )}

          {/* Form Input Box */}
          <form onSubmit={handleSubmit} className="relative flex items-end gap-2">
            <div className="relative flex-1 rounded-2xl border border-slate-300 bg-slate-50 focus-within:border-indigo-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  language === 'te'
                    ? 'మీ కాలేజీ సందేహాన్ని ఇక్కడ టైప్ చేయండి... (ఉదా: హాజరు నిబంధనలు, పరీక్షల తేదీలు)'
                    : 'Ask about attendance rules, exam schedules, revaluation, credit requirements...'
                }
                rows={1}
                className="w-full resize-none bg-transparent px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden max-h-32"
              />
            </div>

            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-semibold shadow-md transition-all ${
                inputText.trim() && !isLoading
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
              title="Send question (Enter)"
            >
              {isLoading ? (
                <RefreshCw className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </form>

          {/* Disclaimer Note */}
          <p className="mt-2 text-center text-[11px] text-slate-400">
            AI Student Query Chatbot — Grounded in official institutional regulations. For official circulars, always verify with your Department Office.
          </p>
        </div>
      </div>
    </div>
  );
};
