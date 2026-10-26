import React from 'react';
import {
  GraduationCap,
  MessageSquare,
  BookOpen,
  CheckCircle2,
  Presentation,
  Info,
  Globe,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { ActiveTab } from '../types.ts';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  language: 'auto' | 'en' | 'te';
  setLanguage: (lang: 'auto' | 'en' | 'te') => void;
  onOpenDisclaimer: () => void;
  faqCount: number;
  isAiActive: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  onOpenDisclaimer,
  faqCount,
  isAiActive,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Branding */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-tr from-indigo-700 to-blue-600 text-white shadow-md shadow-indigo-200">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900">
                DBala – Generative AI Project Work
              </span>
              <span className="hidden rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 border border-indigo-200 md:inline-flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> AI Student Query Chatbot
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Academic Support & Policy Intelligence System
            </p>
          </div>
        </div>

        {/* View Navigation Tabs */}
        <nav className="hidden md:flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200/80">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-sm font-semibold transition-all ${
              activeTab === 'chat'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            Chat Assistant
          </button>

          <button
            onClick={() => setActiveTab('faqs')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-sm font-semibold transition-all ${
              activeTab === 'faqs'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            Knowledge Base
            <span className="rounded-full bg-slate-200 px-1.5 py-0.2 text-[10px] text-slate-700 font-bold">
              {faqCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('tests')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-sm font-semibold transition-all ${
              activeTab === 'tests'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Test Suite
            <span className="rounded-full bg-emerald-100 px-1.5 py-0.2 text-[10px] text-emerald-800 font-bold">
              8 Tests
            </span>
          </button>

          <button
            onClick={() => setActiveTab('review')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-sm font-semibold transition-all ${
              activeTab === 'review'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Presentation className="h-4 w-4" />
            Review & Viva Hub
          </button>
        </nav>

        {/* Right Controls: Language Selector & Telemetry */}
        <div className="flex items-center gap-2.5">
          {/* Status Indicator */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{isAiActive ? 'Gemini 3.8 Flash' : 'Local FAQ Mode'}</span>
          </div>

          {/* Language Selector */}
          <div className="flex items-center rounded-lg border border-slate-200 bg-white p-0.5 text-xs font-semibold text-slate-700 shadow-2xs">
            <Globe className="h-3.5 w-3.5 ml-2 mr-1 text-slate-400" />
            <button
              onClick={() => setLanguage('auto')}
              className={`rounded-md px-2 py-1 transition-colors ${
                language === 'auto'
                  ? 'bg-indigo-50 text-indigo-700 font-bold'
                  : 'hover:text-slate-900'
              }`}
              title="Auto-detect English or Telugu"
            >
              Auto
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`rounded-md px-2 py-1 transition-colors ${
                language === 'en'
                  ? 'bg-indigo-50 text-indigo-700 font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('te')}
              className={`rounded-md px-2 py-1 transition-colors ${
                language === 'te'
                  ? 'bg-indigo-50 text-indigo-700 font-bold'
                  : 'hover:text-slate-900'
              }`}
              title="తెలుగు భాషలో సమాధానం"
            >
              తెలుగు
            </button>
          </div>

          {/* Project Info Button */}
          <button
            onClick={onOpenDisclaimer}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            title="Institutional Demonstration Disclaimer & Project Details"
          >
            <Info className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="flex md:hidden border-t border-slate-200 bg-slate-50 px-2 py-1.5 justify-around">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md ${
            activeTab === 'chat' ? 'bg-indigo-600 text-white' : 'text-slate-600'
          }`}
        >
          <MessageSquare className="h-3.5 w-3.5" />
          Chat
        </button>
        <button
          onClick={() => setActiveTab('faqs')}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md ${
            activeTab === 'faqs' ? 'bg-indigo-600 text-white' : 'text-slate-600'
          }`}
        >
          <BookOpen className="h-3.5 w-3.5" />
          FAQs ({faqCount})
        </button>
        <button
          onClick={() => setActiveTab('tests')}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md ${
            activeTab === 'tests' ? 'bg-indigo-600 text-white' : 'text-slate-600'
          }`}
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          Tests
        </button>
        <button
          onClick={() => setActiveTab('review')}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md ${
            activeTab === 'review' ? 'bg-indigo-600 text-white' : 'text-slate-600'
          }`}
        >
          <Presentation className="h-3.5 w-3.5" />
          Review Hub
        </button>
      </div>
    </header>
  );
};
