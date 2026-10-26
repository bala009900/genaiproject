import React, { useState } from 'react';
import {
  Search,
  Filter,
  ShieldCheck,
  PlusCircle,
  MessageSquare,
  Globe,
  Calendar,
  X,
  CheckCircle,
  BookOpen,
} from 'lucide-react';
import { FAQItem } from '../types.ts';

interface KnowledgeExplorerProps {
  faqs: FAQItem[];
  onSelectQuestion: (question: string) => void;
  onAddFaq: (faq: Partial<FAQItem>) => Promise<boolean>;
}

export const KnowledgeExplorer: React.FC<KnowledgeExplorerProps> = ({
  faqs,
  onSelectQuestion,
  onAddFaq,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedTelugu, setExpandedTelugu] = useState<Record<string, boolean>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New FAQ form state
  const [newCategory, setNewCategory] = useState('Attendance Policies');
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [newKeywords, setNewKeywords] = useState('');
  const [newTeluguQ, setNewTeluguQ] = useState('');
  const [newTeluguA, setNewTeluguA] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const categories = ['All', ...Array.from(new Set(faqs.map((f) => f.category)))];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory =
      selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesSearch =
      searchTerm.trim() === '' ||
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.keywords.some((k) => k.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (faq.teluguQuestion && faq.teluguQuestion.includes(searchTerm)) ||
      (faq.teluguAnswer && faq.teluguAnswer.includes(searchTerm));
    return matchesCategory && matchesSearch;
  });

  const toggleTelugu = (id: string) => {
    setExpandedTelugu((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreateFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;

    setIsSubmitting(true);
    const success = await onAddFaq({
      category: newCategory,
      question: newQuestion,
      answer: newAnswer,
      keywords: newKeywords.split(',').map((k) => k.trim()).filter(Boolean),
      teluguQuestion: newTeluguQ.trim() || undefined,
      teluguAnswer: newTeluguA.trim() || undefined,
    });
    setIsSubmitting(false);

    if (success) {
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setIsModalOpen(false);
        setNewQuestion('');
        setNewAnswer('');
        setNewKeywords('');
        setNewTeluguQ('');
        setNewTeluguA('');
      }, 1200);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:px-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Academic Knowledge Base
            </h1>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> Institutional Repository
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-600">
            Browse, search, and manage verified college regulations, exam schedules, and student policies.
          </p>
        </div>

        {/* Action Button: Add Dynamic FAQ */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-all cursor-pointer"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add Academic Circular / FAQ</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mt-6 flex flex-col md:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search academic regulations, keywords, attendance rules, revaluation..."
            className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-600 focus:outline-hidden focus:ring-2 focus:ring-indigo-100 shadow-2xs"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-semibold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Dropdown (Mobile) & Badges (Desktop) */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3 py-2 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="mt-4 flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong className="text-slate-800">{filteredFaqs.length}</strong> of{' '}
          {faqs.length} institutional policies
        </span>
        {selectedCategory !== 'All' && (
          <span>
            Filtered by: <strong className="text-indigo-600">{selectedCategory}</strong>
          </span>
        )}
      </div>

      {/* FAQ Grid */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFaqs.map((faq) => {
          const hasTelugu = Boolean(faq.teluguQuestion && faq.teluguAnswer);
          const isTeluguExpanded = expandedTelugu[faq.id];

          return (
            <div
              key={faq.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-indigo-200 hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="rounded-md bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 border border-indigo-100">
                    {faq.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Verified Policy</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {faq.question}
                </h3>

                <p className="mt-2.5 text-xs text-slate-600 leading-relaxed">
                  {faq.answer}
                </p>

                {/* Keywords */}
                {faq.keywords && faq.keywords.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {faq.keywords.slice(0, 5).map((kw, i) => (
                      <span
                        key={i}
                        className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                )}

                {/* Telugu Accordion */}
                {hasTelugu && (
                  <div className="mt-3.5 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => toggleTelugu(faq.id)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                    >
                      <Globe className="h-3.5 w-3.5" />
                      <span>{isTeluguExpanded ? 'Hide Telugu' : 'తెలుగు అనువాదం చూడండి (View in Telugu)'}</span>
                    </button>

                    {isTeluguExpanded && (
                      <div className="mt-2 rounded-xl bg-slate-50 p-3 border border-slate-200 text-xs text-slate-700 space-y-1 animate-in fade-in">
                        <p className="font-bold text-slate-800">{faq.teluguQuestion}</p>
                        <p className="text-slate-600 leading-relaxed">{faq.teluguAnswer}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Ref: {faq.id}
                </span>

                <button
                  onClick={() => onSelectQuestion(faq.question)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-600 hover:text-white transition-all cursor-pointer"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>Ask Bot</span>
                </button>
              </div>
            </div>
          );
        })}

        {filteredFaqs.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-slate-300" />
            <h3 className="mt-3 text-base font-bold text-slate-800">
              No matching academic policies found
            </h3>
            <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
              Try searching with alternative keywords, clearing the filter, or adding a new circular.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Add New Circular Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <PlusCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Add New Academic FAQ / Circular
                  </h3>
                  <p className="text-xs text-slate-500">
                    Contribute an official notice to the searchable institutional database.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="py-12 text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-emerald-500 animate-bounce" />
                <h4 className="mt-3 text-base font-bold text-slate-900">
                  Academic Policy Successfully Published!
                </h4>
                <p className="mt-1 text-xs text-slate-600">
                  The query resolution engine and chat assistant have been updated instantly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreateFaq} className="mt-4 space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Academic Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:border-indigo-600 focus:outline-hidden"
                  >
                    <option value="Attendance Policies">Attendance Policies</option>
                    <option value="Examinations & Grading">Examinations & Grading</option>
                    <option value="Courses & Curriculum">Courses & Curriculum</option>
                    <option value="Assignments & Labs">Assignments & Labs</option>
                    <option value="Faculty & Departments">Faculty & Departments</option>
                    <option value="College Facilities & Support">College Facilities & Support</option>
                    <option value="Notices & Announcements">Notices & Announcements</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Question / Inquiry (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="e.g. When will mid-term results be published?"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-indigo-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Verified Answer / Policy Regulation *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    placeholder="Provide the precise institutional answer, deadlines, and authority contacts..."
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-indigo-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Search Keywords (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newKeywords}
                    onChange={(e) => setNewKeywords(e.target.value)}
                    placeholder="e.g. results, mid-term, evaluation, grade sheet"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-indigo-600 focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Telugu Question (Optional)
                    </label>
                    <input
                      type="text"
                      value={newTeluguQ}
                      onChange={(e) => setNewTeluguQ(e.target.value)}
                      placeholder="తెలుగు ప్రశ్న"
                      className="w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Telugu Answer (Optional)
                    </label>
                    <input
                      type="text"
                      value={newTeluguA}
                      onChange={(e) => setNewTeluguA(e.target.value)}
                      placeholder="తెలుగు సమాధానం"
                      className="w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs text-slate-800"
                    />
                  </div>
                </div>

                <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 shadow-sm"
                  >
                    {isSubmitting ? 'Saving...' : 'Publish to Knowledge Base'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
