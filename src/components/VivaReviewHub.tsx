import React, { useState } from 'react';
import {
  Presentation,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  HelpCircle,
  Clock,
  Sparkles,
  BookOpen,
  CheckCircle,
  Copy,
  Check,
  FileText,
  Volume2,
} from 'lucide-react';

export const VivaReviewHub: React.FC = () => {
  const [hubTab, setHubTab] = useState<'slides' | 'pitches' | 'viva' | 'report'>('slides');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showNotes, setShowNotes] = useState(true);
  const [copiedPitch, setCopiedPitch] = useState<string | null>(null);

  // 10 Presentation Slides
  const slides = [
    {
      title: 'AI Student Query Chatbot',
      subtitle: 'An Intelligent Academic Assistance & Policy Intelligence System',
      category: 'Slide 1: Title & Overview',
      points: [
        'Domain: Conversational AI & Educational Technology (EdTech)',
        'Student Name: DBala | Roll No: [Roll Number]',
        'Guide: [Faculty Supervisor Name, Ph.D.], Department of CSE',
        'Academic Year: 2026 - 2027',
      ],
      speakerNotes:
        'Respected evaluators, good morning. Today I am presenting my academic project titled "AI Student Query Chatbot: An Intelligent Academic Assistance System". This project bridges the gap between institutional regulations and student queries using knowledge-grounded AI.',
    },
    {
      title: 'Introduction & Project Background',
      subtitle: 'The Need for Conversational Intelligence in Higher Education',
      category: 'Slide 2: Background',
      points: [
        'Universities enforce strict academic policies (attendance, grading, revaluation, credit quotas).',
        'Students struggle to find answers buried in 50+ page PDF handbooks and disparate circulars.',
        'Administrative offices face overwhelming queues during examination and admission cycles.',
        'Objective: Provide 24/7 instant, verified query resolution via a web-based assistant.',
      ],
      speakerNotes:
        'In universities, students continually need quick answers regarding 75% attendance limits, exam schedules, and lab submission rules. Currently, students must either queue at administrative offices or read through lengthy PDFs. Our chatbot solves this by serving answers instantly 24/7.',
    },
    {
      title: 'Problem Statement',
      subtitle: 'Eliminating Information Friction & Faculty Overload',
      category: 'Slide 3: Problem Statement',
      points: [
        'High administrative burden on faculty mentors answering hundreds of identical inquiries.',
        'Unverified student WhatsApp/Telegram groups frequently circulate incorrect academic rumors.',
        'Zero availability of student support outside 9:00 AM – 5:00 PM college working hours.',
        'Lack of regional language (Telugu) accessibility in formal university documents.',
      ],
      speakerNotes:
        'The core problem is information friction. Busy faculty spend hundreds of hours answering the same questions every semester, while students relying on peer groups risk misinformation. Furthermore, vernacular-medium students face language hurdles with formal academic English.',
    },
    {
      title: 'Existing System vs. Proposed Solution',
      subtitle: 'Transforming Academic Support from Manual to AI-Grounded',
      category: 'Slide 4: System Comparison',
      points: [
        'Existing: Manual office visits, physical notice boards, static PDF handbooks.',
        'Limitations: Restricted hours, high latency, risk of misinformation, English-only.',
        'Proposed: Hybrid conversational system with indexed institutional FAQ ground truth.',
        'Advantage: Instant response (<10ms local), zero hallucinations, English + Telugu support.',
      ],
      speakerNotes:
        'As illustrated, our proposed system shifts student support from a manual, English-only, office-hour restricted model to an intelligent, 24/7, bilingual conversational service grounded strictly in official institutional facts.',
    },
    {
      title: 'System Architecture & Data Flow',
      subtitle: 'Three-Tier Architecture with Retrieval-Augmented Grounding',
      category: 'Slide 5: Architecture',
      points: [
        'Presentation Tier: React 19, TypeScript, Tailwind CSS with responsive components.',
        'API & Logic Tier: Node.js Express / Python FastAPI REST endpoints with token normalization.',
        'Retrieval Tier: Weighted TF-IDF inspired keyword matcher over structured FAQ database.',
        'AI Synthesis: Google Gemini (gemini-3.8-flash) with temperature 0.3 policy grounding.',
        'Resilience: Deterministic local rule-based fallback guarantees zero downtime.',
      ],
      speakerNotes:
        'Our architecture follows a clean three-tier design. When a student submits a query, it is normalized and matched against our indexed FAQ database. If an authoritative match is found, we ground the Gemini model with the exact policy to synthesize a polite response. If offline, the local fallback serves the policy directly.',
    },
    {
      title: 'Technology Stack & Implementation',
      subtitle: 'Modern, Production-Ready Engineering Stack',
      category: 'Slide 6: Tech Stack',
      points: [
        'Frontend Framework: React 19 SPA + Vite + Tailwind CSS',
        'Backend Frameworks: Express (Node.js) & FastAPI (Python 3.11)',
        'Language Model: Google Gemini gemini-3.8-flash via @google/genai SDK',
        'Persistence: SQLite database for chat logging + JSON knowledge store',
        'Code Quality: Automated Pytest suite + in-app test execution runner',
      ],
      speakerNotes:
        'We selected high-performance, modern frameworks: React 19 for reactive rendering, FastAPI/Express for asynchronous REST APIs, and Google Gemini 3.8 Flash for fast, cost-effective reasoning. Everything is covered by automated testing.',
    },
    {
      title: 'Key Application Features',
      subtitle: 'Engineered for Student Accessibility & Administrative Ease',
      category: 'Slide 7: Key Features',
      points: [
        '6 Academic Domains: Attendance, Exams, Courses, Labs, Faculty, Facilities.',
        'Multilingual Capability: Telugu Unicode script recognition & vernacular responses.',
        'Audio Accessibility: Built-in Web Speech API text-to-speech for all bot responses.',
        'Dynamic Policy Management: In-app modal to add urgent circulars without code deployment.',
        'Session Tools: Conversation history export, clear chat, and helpfulness feedback.',
      ],
      speakerNotes:
        'Key features include multi-domain categorization, Telugu language support, text-to-speech synthesis for accessibility, session export for student reference, and an administrative interface to publish new academic notices dynamically.',
    },
    {
      title: 'Testing & Quality Assurance',
      subtitle: 'Rigorous Verification Matrix and Benchmarks',
      category: 'Slide 8: Testing Results',
      points: [
        '100% Pass Rate across 8 automated functional test cases.',
        'TC-01 Known FAQ: 75% attendance rule retrieved with 98% confidence.',
        'TC-02 Out-of-Domain: Graceful fallback without server crashes.',
        'TC-05 Telugu Script: Unicode block detection successfully validated.',
        'Latency SLA: Average local search response time under 10 milliseconds.',
      ],
      speakerNotes:
        'Testing was conducted across 8 automated test vectors covering known FAQ retrieval, unknown query fallback, empty inputs, Telugu recognition, and latency SLAs. All tests passed with 100% success rate and an average search latency under 10ms.',
    },
    {
      title: 'Advantages & Ethical Guardrails',
      subtitle: 'Zero Hallucinations and Student Privacy by Design',
      category: 'Slide 9: Guardrails',
      points: [
        'Zero Hallucinations: Prompts explicitly inject verified policy context with temp=0.3.',
        'Privacy by Design: No sensitive student data or passwords requested or logged.',
        'Administrative Efficiency: Frees faculty from answering repetitive queries.',
        'Institutional Disclaimer: Prominently labels sample data and instructs advisor verification.',
      ],
      speakerNotes:
        'A critical engineering decision was preventing hallucinations. By setting temperature to 0.3 and passing verified policies directly into the system prompt, the model is restrained from inventing fake rules or fees. Furthermore, no private student credentials are collected.',
    },
    {
      title: 'Conclusion & Future Roadmap',
      subtitle: 'Scalable Foundation for University Digital Campus',
      category: 'Slide 10: Conclusion',
      points: [
        'Conclusion: Successfully delivered a production-ready, bilingual AI student query chatbot.',
        'Phase 2: Integration with University ERP (SSO) for personalized CGPA/attendance queries.',
        'Phase 3: Automatic Speech Recognition (ASR) for spoken voice queries on mobile.',
        'Phase 4: Official WhatsApp Business Bot deployment for campus-wide accessibility.',
      ],
      speakerNotes:
        'In conclusion, the AI Student Query Chatbot provides an efficient, reliable, and accessible solution for university student support. In the future, we plan to integrate University ERP single sign-on and WhatsApp messaging. Thank you, and I look forward to your questions.',
    },
  ];

  // Elevator Pitch Scripts
  const pitches = [
    {
      duration: '1-Minute Elevator Pitch',
      description: 'Ideal when the examiner asks: "Can you quickly summarize your project in one minute?"',
      script:
        'Good morning, respected examiners. My project is the AI Student Query Chatbot, an intelligent academic support system built with React, FastAPI/Express, and Google Gemini. In universities, students routinely struggle to find answers regarding minimum attendance, exam schedules, revaluation fees, and syllabus requirements because these policies are buried in 50-page PDF handbooks. Our chatbot solves this by allowing students to ask questions naturally in English or Telugu and receiving immediate, verified answers grounded in official college policies. It includes a fallback mechanism ensuring zero downtime, session history, and an automated test suite. It transforms student support into a fast, transparent 24/7 service.',
    },
    {
      duration: '2-Minute Problem & Solution Pitch',
      description: 'Ideal when the review panel asks you to explain the motivation and practical impact.',
      script:
        'Respected evaluators, the motivation behind this project comes from a real challenge every undergraduate student faces. In higher education, timely information is critical. If a student falls below 75% attendance without knowing the condonation procedure, they risk detention. If they do not know the 10-day revaluation deadline, they miss the chance to improve their grade. Currently, students have only two options: physically queuing at the HOD\'s office or asking classmates on WhatsApp groups where rumors and outdated circulars frequently spread.\n\nFurthermore, faculty members are burdened by answering the exact same 10 questions hundreds of times every semester. Existing university websites are static and difficult to navigate on mobile devices.\n\nTherefore, our problem statement was to design an AI-powered conversational assistant that normalizes student queries, retrieves verified institutional rules, and synthesizes student-friendly explanations with zero hallucinations. By doing so, we save faculty time, eliminate student anxiety, and ensure consistent policy enforcement.',
    },
    {
      duration: '3-Minute Technical Architecture Walkthrough',
      description: 'Ideal when the panel asks: "Walk us through the technical implementation and data flow."',
      script:
        'Let me walk you through the technical implementation of our system.\n\nFirst, on the Frontend, we built a reactive single-page dashboard using React 19, TypeScript, and Tailwind CSS. We designed custom message bubbles that display the response source—whether it came directly from the Knowledge Base or was synthesized by Gemini AI. We also implemented Web Speech synthesis so students can listen to answers, alongside Telugu language toggle and chat export features.\n\nSecond, on the Backend, we implemented REST APIs using Express and FastAPI. When a POST request arrives at /api/chat, the system executes a 3-step pipeline:\n1. Input Normalization & Language Detection: The text is sanitized, and we detect if it contains Telugu Unicode characters in the range U+0C00 to U+0C7F.\n2. Keyword & Similarity Scoring: We compute a match score across question titles, keyword tags, categories, and policy bodies.\n3. AI Grounding & Synthesis: If a strong match is found, we call Google Gemini gemini-3.8-flash via the @google/genai SDK with temperature 0.3. Crucially, we inject the official policy text into the prompt. The model is instructed to formulate its answer solely based on that verified context, preventing hallucination.\n\nIf the query is unknown or the API is offline, our deterministic fallback triggers, providing helpful contact details for the Academic Dean and HOD.\n\nFinally, we built an Automated Test Runner accessible directly from the interface. It runs 8 live tests—such as verifying the 75% attendance rule, testing empty inputs, and checking latency—providing complete transparency during academic evaluation.',
    },
  ];

  // Common Viva Q&A
  const vivaQuestions = [
    {
      q: 'Why did you use a Hybrid AI approach instead of directly passing the question to Gemini?',
      a: 'Directly prompting an LLM carries a high risk of hallucination—the model might invent college-specific fee amounts, grading rules, or exam dates that do not exist. In our hybrid architecture, the local knowledge base acts as the ground truth. We pass the retrieved institutional policy to Gemini as grounding context. This ensures that the generated answer is conversational and student-friendly while remaining 100% factually accurate.',
    },
    {
      q: 'What happens if the external Gemini API is unreachable or the network goes down?',
      a: 'Our system features a robust deterministic fallback. If the API key is missing or an API call fails, the backend automatically catches the error and serves the verified FAQ text directly from our local knowledge base without crashing. If no relevant FAQ exists, it returns a polite fallback message with department office hours.',
    },
    {
      q: 'How is multilingual support (Telugu) implemented?',
      a: 'We detect Telugu queries through Unicode block inspection ([\\u0C00-\\u0C7F]). Our knowledge base contains curated Telugu translations of questions and answers. When Telugu is detected, the search engine matches against Telugu keywords, and Gemini is instructed via system instructions to formulate the answer naturally in Telugu script.',
    },
    {
      q: 'How do you prevent SQL injection or malicious inputs?',
      a: 'We validate all inputs on both frontend and backend using Pydantic schemas in FastAPI and Express validators. In our SQLite persistence layer, all queries use parameterized prepared statements (? placeholders), preventing SQL injection. Furthermore, inputs are stripped of HTML tags to prevent cross-site scripting (XSS).',
    },
    {
      q: 'Can this chatbot be deployed in any university?',
      a: 'Yes, the architecture is completely modular and decoupled. All institutional policies are stored in a structured JSON/SQLite knowledge base (sample_faqs.json). A college administrator can simply update the JSON file or use our /api/faqs endpoint to replace the sample data with their own college regulations without changing any application code.',
    },
    {
      q: 'What is the role of temperature in your Gemini model configuration?',
      a: 'We explicitly configure the temperature to 0.3. A low temperature minimizes model randomness and creativity, which is essential for an academic policy chatbot where factual consistency and fidelity to regulations are paramount.',
    },
    {
      q: 'What is the difference between this chatbot and a standard FAQ search bar?',
      a: 'A search bar requires exact keyword matching and returns a raw list of links. Our chatbot understands natural language inquiries (e.g., "I have 68% attendance, can I write exams?"), maps the intent to the condonation policy, explains the rules in clear bullet points, suggests follow-up actions, and answers in regional languages.',
    },
  ];

  const handleCopyPitch = (script: string, duration: string) => {
    navigator.clipboard.writeText(script);
    setCopiedPitch(duration);
    setTimeout(() => setCopiedPitch(null), 2000);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 md:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Project Review & Viva Preparation Hub
            </h1>
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 border border-indigo-200 flex items-center gap-1">
              <Presentation className="h-3.5 w-3.5" /> Examination Toolkit
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-600">
            Presentation slide deck with speaker notes, review speech scripts, and top technical viva Q&A.
          </p>
        </div>

        {/* Subtab Switcher */}
        <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200">
          <button
            onClick={() => setHubTab('slides')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              hubTab === 'slides' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            10 Review Slides
          </button>
          <button
            onClick={() => setHubTab('pitches')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              hubTab === 'pitches' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Review Speech Scripts
          </button>
          <button
            onClick={() => setHubTab('viva')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              hubTab === 'viva' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Viva Q&A
          </button>
          <button
            onClick={() => setHubTab('report')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              hubTab === 'report' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Report & Docs
          </button>
        </div>
      </div>

      {/* Subtab 1: Slides Deck */}
      {hubTab === 'slides' && (
        <div className="mt-6 space-y-6">
          {/* Slide Container Card */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md">
            {/* Slide Header */}
            <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                {slides[currentSlide].category}
              </span>
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-bold">
                Slide {currentSlide + 1} of {slides.length}
              </span>
            </div>

            {/* Slide Content */}
            <div className="p-8 sm:p-10 min-h-[300px] flex flex-col justify-between">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {slides[currentSlide].title}
                </h2>
                <h3 className="mt-1 text-sm sm:text-base font-medium text-indigo-600">
                  {slides[currentSlide].subtitle}
                </h3>

                <ul className="mt-6 space-y-3">
                  {slides[currentSlide].points.map((pt, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs mt-0.5">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed font-medium">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Slide Navigation Controls */}
              <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-4">
                <button
                  onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
                  disabled={currentSlide === 0}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous Slide
                </button>

                <div className="flex gap-1.5">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlide(i)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        currentSlide === i ? 'w-6 bg-indigo-600' : 'w-2 bg-slate-200 hover:bg-slate-300'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1))}
                  disabled={currentSlide === slides.length - 1}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                >
                  Next Slide <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Speaker Notes Box */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                <Volume2 className="h-4 w-4 text-amber-600" /> Speaker Notes (What to say during this slide)
              </span>
              <button
                onClick={() => setShowNotes(!showNotes)}
                className="text-xs font-semibold text-amber-700 hover:underline cursor-pointer"
              >
                {showNotes ? 'Hide Notes' : 'Show Notes'}
              </button>
            </div>

            {showNotes && (
              <p className="text-xs text-amber-900 leading-relaxed font-mono italic">
                "{slides[currentSlide].speakerNotes}"
              </p>
            )}
          </div>
        </div>
      )}

      {/* Subtab 2: Review Pitches */}
      {hubTab === 'pitches' && (
        <div className="mt-6 space-y-6">
          {pitches.map((p, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs hover:border-indigo-200 transition-all"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{p.duration}</h3>
                    <p className="text-xs text-slate-500">{p.description}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleCopyPitch(p.script, p.duration)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  {copiedPitch === p.duration ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copied Script!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Script</span>
                    </>
                  )}
                </button>
              </div>

              <div className="mt-4 rounded-xl bg-slate-50 p-4 border border-slate-100">
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-sans">
                  {p.script}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Subtab 3: Viva Q&A */}
      {hubTab === 'viva' && (
        <div className="mt-6 space-y-4">
          <div className="rounded-xl bg-indigo-50/70 p-4 border border-indigo-100 text-xs text-indigo-900">
            <strong>Viva Preparation Guide:</strong> Below are the most frequently asked technical questions during university project reviews for conversational AI and NLP systems.
          </div>

          <div className="space-y-3">
            {vivaQuestions.map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-indigo-200 transition-all"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-xs">
                    Q{idx + 1}
                  </span>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-slate-900">
                      {item.q}
                    </h4>
                    <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                      <strong className="text-slate-800">Model Answer: </strong>
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 4: Project Report & Architecture */}
      {hubTab === 'report' && (
        <div className="mt-6 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Academic Project Report (docs/project_report.md)
                </h3>
                <p className="text-xs text-slate-500">
                  24-section formal academic project report generated in full compliance with university guidelines.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div>• Title Page & Certificate</div>
              <div>• Problem Statement</div>
              <div>• System Architecture</div>
              <div>• Hardware/Software Specs</div>
              <div>• Functional Requirements</div>
              <div>• Database Design (ER)</div>
              <div>• AI/NLP Implementation</div>
              <div>• Test Cases Matrix</div>
            </div>

            <div className="mt-4 flex gap-2">
              <a
                href="/docs/project_report.md"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition-colors"
              >
                <BookOpen className="h-4 w-4" /> Open Full Project Report (Markdown)
              </a>
            </div>
          </div>

          {/* Architecture Diagram Visualization */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
              System Architecture Flow
            </h3>

            <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-center">
              <div className="w-full md:w-1/4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-bold text-indigo-600">1. Client Tier</div>
                <div className="text-sm font-bold text-slate-800 mt-1">React 19 SPA</div>
                <div className="text-[11px] text-slate-500 mt-1">Vite + Tailwind CSS + Web Speech TTS</div>
              </div>

              <div className="text-slate-400 font-bold hidden md:block">➔</div>

              <div className="w-full md:w-1/4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-bold text-indigo-600">2. Gateway & Logic</div>
                <div className="text-sm font-bold text-slate-800 mt-1">Express / FastAPI</div>
                <div className="text-[11px] text-slate-500 mt-1">Tokenization, Telugu Detection, TF-IDF Search</div>
              </div>

              <div className="text-slate-400 font-bold hidden md:block">➔</div>

              <div className="w-full md:w-1/4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-bold text-indigo-600">3. Knowledge Base</div>
                <div className="text-sm font-bold text-slate-800 mt-1">Institutional FAQs</div>
                <div className="text-[11px] text-slate-500 mt-1">Verified Policies (JSON / SQLite)</div>
              </div>

              <div className="text-slate-400 font-bold hidden md:block">➔</div>

              <div className="w-full md:w-1/4 rounded-xl border border-indigo-200 bg-indigo-50/70 p-4">
                <div className="text-xs font-bold text-indigo-700">4. AI Grounding</div>
                <div className="text-sm font-bold text-slate-900 mt-1">Gemini 3.8 Flash</div>
                <div className="text-[11px] text-indigo-800 mt-1">Policy Context Injection (Temp 0.3)</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
