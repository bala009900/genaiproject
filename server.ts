import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// Initialize GoogleGenAI
const geminiApiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (geminiApiKey) {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Data structures
export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  keywords: string[];
  teluguQuestion?: string;
  teluguAnswer?: string;
  verified: boolean;
  lastUpdated: string;
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
}

// Load FAQs
const FAQS_PATH = path.resolve(process.cwd(), 'data/sample_faqs.json');
let academicFAQs: FAQItem[] = [];

try {
  if (fs.existsSync(FAQS_PATH)) {
    const raw = fs.readFileSync(FAQS_PATH, 'utf-8');
    academicFAQs = JSON.parse(raw);
    console.log(`[Backend] Loaded ${academicFAQs.length} academic FAQs.`);
  } else {
    console.warn(`[Backend] FAQ file not found at ${FAQS_PATH}`);
  }
} catch (err) {
  console.error('[Backend] Error loading FAQs:', err);
}

// In-memory chat storage with session management
const chatHistory: ChatMessage[] = [];

// Helper: detect Telugu script
function isTelugu(text: string): boolean {
  return /[\u0C00-\u0C7F]/.test(text);
}

// Helper: tokenize and clean text
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s\u0C00-\u0C7F]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 2);
}

// Academic FAQ Search Engine (TF-IDF inspired keyword scoring)
function searchKnowledgeBase(query: string, lang: 'en' | 'te' = 'en'): { item: FAQItem; score: number }[] {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return [];

  const results = academicFAQs.map((faq) => {
    let score = 0;
    const qLower = faq.question.toLowerCase();
    const aLower = faq.answer.toLowerCase();
    const catLower = faq.category.toLowerCase();
    const tqLower = (faq.teluguQuestion || '').toLowerCase();
    const taLower = (faq.teluguAnswer || '').toLowerCase();

    // Exact phrase match bonus
    const queryLower = query.toLowerCase().trim();
    if (qLower.includes(queryLower) || tqLower.includes(queryLower)) {
      score += 60;
    }

    queryTokens.forEach((token) => {
      // Keyword match (highest weight)
      if (faq.keywords.some((kw) => kw.toLowerCase().includes(token))) {
        score += 25;
      }
      // Question title match
      if (qLower.includes(token) || tqLower.includes(token)) {
        score += 20;
      }
      // Category match
      if (catLower.includes(token)) {
        score += 15;
      }
      // Answer body match
      if (aLower.includes(token) || taLower.includes(token)) {
        score += 8;
      }
    });

    return { item: faq, score };
  });

  return results.filter((r) => r.score > 0).sort((a, b) => b.score - a.score);
}

// Greetings handler
function checkGreeting(text: string): { isGreeting: boolean; response: string; lang: 'en' | 'te' } | null {
  const clean = text.trim().toLowerCase();
  const enGreetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'help', 'what can you do'];
  const teGreetings = ['నమస్కారం', 'హలో', 'నమస్తే', 'బాగున్నారా'];

  if (teGreetings.some((g) => clean.includes(g))) {
    return {
      isGreeting: true,
      lang: 'te',
      response:
        'నమస్కారం! నేను మీ కళాశాల AI విద్యార్థి సహాయక చాట్‌బాట్‌ని (AI Student Query Chatbot). మీరు కోర్సులు, హాజరు నిబంధనలు (Attendance), పరీక్షల షెడ్యూల్, ల్యాబ్‌లు మరియు కాలేజీ సదుపాయాల గురించి ఏదైనా అడగవచ్చు. మీ సందేహాన్ని ఇక్కడ టైప్ చేయండి!',
    };
  }

  if (enGreetings.some((g) => clean === g || clean.startsWith(g + ' '))) {
    return {
      isGreeting: true,
      lang: 'en',
      response:
        'Hello! Welcome to the AI Student Query Chatbot. I can assist you with:\n\n' +
        '• **Attendance Policies & Medical Leave** (minimum 75% rules, condonation)\n' +
        '• **Examinations & Grading** (mid-terms, end-sem dates, revaluation, hall tickets)\n' +
        '• **Courses & Curriculum** (B.Tech credit requirements, branch electives)\n' +
        '• **Assignments & Labs** (submission deadlines, plagiarism rules, CIE marks)\n' +
        '• **Faculty & Campus Facilities** (HOD office hours, library, Wi-Fi, hostels)\n\n' +
        'How can I help you today? Feel free to ask your question in English or Telugu!',
    };
  }

  return null;
}

// REST API Endpoints

// 1. GET /api/health
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    faqCount: academicFAQs.length,
    geminiConfigured: !!ai,
    chatMessagesStored: chatHistory.length,
    version: '1.0.0-academic',
  });
});

// 2. GET /api/faqs
app.get('/api/faqs', (req: Request, res: Response) => {
  const { category, search } = req.query;
  let filtered = [...academicFAQs];

  if (category && typeof category === 'string' && category !== 'All') {
    filtered = filtered.filter((f) => f.category.toLowerCase() === category.toLowerCase());
  }

  if (search && typeof search === 'string' && search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (f) =>
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q) ||
        f.keywords.some((k) => k.toLowerCase().includes(q))
    );
  }

  // Extract unique categories
  const categories = Array.from(new Set(academicFAQs.map((f) => f.category)));

  res.json({
    total: filtered.length,
    categories: ['All', ...categories],
    faqs: filtered,
  });
});

// 3. POST /api/faqs (Allow adding dynamic notices/FAQs)
app.post('/api/faqs', (req: Request, res: Response) => {
  const { category, question, answer, keywords, teluguQuestion, teluguAnswer } = req.body;

  if (!category || !question || !answer) {
    res.status(400).json({ error: 'category, question, and answer are required.' });
    return;
  }

  const newFaq: FAQItem = {
    id: `faq-custom-${Date.now()}`,
    category: String(category).trim(),
    question: String(question).trim(),
    answer: String(answer).trim(),
    keywords: Array.isArray(keywords) ? keywords : [String(keywords || '')],
    teluguQuestion: teluguQuestion ? String(teluguQuestion).trim() : undefined,
    teluguAnswer: teluguAnswer ? String(teluguAnswer).trim() : undefined,
    verified: true,
    lastUpdated: new Date().toISOString().split('T')[0],
  };

  academicFAQs.unshift(newFaq);

  // Attempt to write back to file if writable
  try {
    fs.writeFileSync(FAQS_PATH, JSON.stringify(academicFAQs, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[Backend] Could not persist FAQ to disk:', err);
  }

  res.status(201).json({ message: 'FAQ added successfully', faq: newFaq });
});

// 4. POST /api/chat
app.post('/api/chat', async (req: Request, res: Response) => {
  const { message, sessionId = 'default-session', language = 'auto' } = req.body;

  // Validate input
  if (!message || typeof message !== 'string' || !message.trim()) {
    res.status(400).json({
      error: 'Invalid input. Please provide a non-empty question string.',
    });
    return;
  }

  const trimmedMessage = message.trim();
  const detectedLang: 'en' | 'te' = language === 'te' || (language === 'auto' && isTelugu(trimmedMessage)) ? 'te' : 'en';

  // 1. Check greeting
  const greetingResult = checkGreeting(trimmedMessage);
  if (greetingResult) {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-u`,
      sessionId,
      sender: 'user',
      text: trimmedMessage,
      timestamp: new Date().toISOString(),
      language: detectedLang,
    };
    const botMsg: ChatMessage = {
      id: `msg-${Date.now()}-b`,
      sessionId,
      sender: 'bot',
      text: greetingResult.response,
      timestamp: new Date().toISOString(),
      source: 'KNOWLEDGE_BASE',
      category: 'General Greetings',
      confidence: 100,
      language: greetingResult.lang,
    };
    chatHistory.push(userMsg, botMsg);

    res.json({
      answer: greetingResult.response,
      confidence: 100,
      source: 'KNOWLEDGE_BASE',
      category: 'General Greetings',
      language: greetingResult.lang,
      suggestions: [
        'What is the minimum attendance required for exams?',
        'When are the end-semester examinations?',
        'How do I apply for paper revaluation?',
        'What are the total credit requirements for B.Tech?',
      ],
      disclaimer: 'Institutional Demonstration Knowledge Base: Real academic data may vary by college regulations.',
    });
    return;
  }

  // 2. Search Academic Knowledge Base
  const matched = searchKnowledgeBase(trimmedMessage, detectedLang);
  const bestMatch = matched.length > 0 ? matched[0] : null;
  const isStrongMatch = bestMatch && bestMatch.score >= 35;

  let finalAnswer = '';
  let source: 'KNOWLEDGE_BASE' | 'HYBRID_AI' | 'GENERATIVE_AI' | 'FALLBACK' = 'KNOWLEDGE_BASE';
  let category = bestMatch ? bestMatch.item.category : 'General Academic';
  let confidence = bestMatch ? Math.min(98, Math.round(bestMatch.score * 1.2)) : 40;
  let matchedFaqId = bestMatch?.item.id;

  // 3. AI or Fallback processing
  if (ai) {
    try {
      // Craft grounded academic prompt
      let systemPrompt =
        'You are the AI Student Query Chatbot for an engineering institution. ' +
        'Provide clear, polite, structured answers using Markdown (bullet points, bold key terms). ' +
        'Always maintain an encouraging and academic tone. ' +
        (detectedLang === 'te' ? 'Respond in clear, natural Telugu script. ' : 'Respond in English. ');

      let userPrompt = `Student Question: "${trimmedMessage}"\n\n`;

      if (bestMatch && bestMatch.score >= 20) {
        // Grounded answer with Knowledge Base
        source = 'HYBRID_AI';
        const kbText = detectedLang === 'te' && bestMatch.item.teluguAnswer
          ? `ప్రశ్న: ${bestMatch.item.teluguQuestion || bestMatch.item.question}\nసమాధానం: ${bestMatch.item.teluguAnswer}`
          : `Official Policy Reference:\nQuestion: ${bestMatch.item.question}\nPolicy: ${bestMatch.item.answer}`;

        userPrompt +=
          `Relevant Institutional Policy from Knowledge Base:\n${kbText}\n\n` +
          'Instructions: Formulate a comprehensive, student-friendly answer based strictly on the above official institutional policy. ' +
          'Include any important rules, deadlines, or fees mentioned. Do not contradict the policy.';
      } else {
        // Generative answer for general academic inquiries with disclaimer
        source = 'GENERATIVE_AI';
        confidence = 65;
        userPrompt +=
          'No exact institutional policy was found in the sample database. ' +
          'Answer this academic inquiry based on standard university engineering regulations and practices. ' +
          'Be helpful, structured, and advise the student to verify with their specific Department Head (HOD) or Academic Section for college-specific circulars.';
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.3,
        },
      });

      finalAnswer = response.text || '';
    } catch (aiError) {
      console.error('[Backend] Gemini API error, falling back to rule-based retrieval:', aiError);
      // Fallback directly to KB or default template
      if (bestMatch && bestMatch.score >= 20) {
        source = 'KNOWLEDGE_BASE';
        finalAnswer = detectedLang === 'te' && bestMatch.item.teluguAnswer
          ? bestMatch.item.teluguAnswer
          : bestMatch.item.answer;
      } else {
        source = 'FALLBACK';
        confidence = 20;
        finalAnswer = detectedLang === 'te'
          ? 'క్షమించండి, మీ ప్రశ్నకు సంబంధించిన ఖచ్చితమైన సమాచారం మా నాలెడ్జ్ బేస్‌లో లభించలేదు. దయచేసి మీ డిపార్ట్‌మెంట్ HOD లేదా అకడమిక్ విభాగాన్ని సంప్రదించండి.'
          : 'I could not locate an exact institutional policy for your query in the current knowledge base.\n\n' +
            '**Recommended Next Steps:**\n' +
            '• Please visit your Department Administrative Office or consult your Faculty Mentor.\n' +
            '• Check the College ERP Portal for latest circulars.\n' +
            '• You can try searching our Knowledge Base using keywords like *attendance*, *exams*, *revaluation*, or *library*.';
      }
    }
  } else {
    // No API key configured -> Rule-based FAQ retrieval
    if (bestMatch && bestMatch.score >= 20) {
      source = 'KNOWLEDGE_BASE';
      finalAnswer = detectedLang === 'te' && bestMatch.item.teluguAnswer
        ? bestMatch.item.teluguAnswer
        : bestMatch.item.answer;
    } else {
      source = 'FALLBACK';
      confidence = 20;
      finalAnswer = detectedLang === 'te'
        ? 'క్షమించండి, మీ ప్రశ్నకు సంబంధించిన సమాచారం మా డేటాబేస్‌లో లభించలేదు. దయచేసి అకడమిక్ విభాగాన్ని సంప్రదించండి.'
        : 'I could not find a specific institutional record matching your question.\n\n' +
          '**Suggestions:**\n' +
          '• Check your query spelling or try related keywords (e.g. *grading*, *attendance*, *hostel*, *credits*).\n' +
          '• Visit the Academic Dean or Exam Cell in the Administrative Block.\n' +
          '• Browse all topics in the FAQ Explorer tab.';
    }
  }

  // Contextual suggested follow-ups
  const suggestions: string[] = [];
  if (category === 'Attendance Policies') {
    suggestions.push('How do I apply for medical leave?', 'What are the condonation fees?');
  } else if (category === 'Examinations & Grading') {
    suggestions.push('What is the procedure for paper revaluation?', 'How can I collect my hall ticket?');
  } else if (category === 'Courses & Curriculum') {
    suggestions.push('Where can I download the complete syllabus?', 'How do I register for Open Electives?');
  } else {
    suggestions.push('What is the minimum attendance required?', 'What are the Central Library timings?');
  }

  // Store in conversation history
  const userMsg: ChatMessage = {
    id: `msg-${Date.now()}-u`,
    sessionId,
    sender: 'user',
    text: trimmedMessage,
    timestamp: new Date().toISOString(),
    language: detectedLang,
  };
  const botMsg: ChatMessage = {
    id: `msg-${Date.now()}-b`,
    sessionId,
    sender: 'bot',
    text: finalAnswer,
    timestamp: new Date().toISOString(),
    source,
    category,
    confidence,
    matchedFaqId,
    language: detectedLang,
  };
  chatHistory.push(userMsg, botMsg);

  res.json({
    answer: finalAnswer,
    confidence,
    source,
    category,
    matchedFaq: bestMatch?.item,
    language: detectedLang,
    suggestions,
    disclaimer: 'Institutional Demonstration Knowledge Base: Sample data for academic project evaluation.',
    timestamp: new Date().toISOString(),
  });
});

// 5. GET /api/history
app.get('/api/history', (req: Request, res: Response) => {
  const { sessionId } = req.query;
  let history = [...chatHistory];
  if (sessionId && typeof sessionId === 'string') {
    history = history.filter((m) => m.sessionId === sessionId);
  }
  res.json({
    total: history.length,
    messages: history,
  });
});

// 6. POST /api/clear-history
app.post('/api/clear-history', (req: Request, res: Response) => {
  const { sessionId } = req.body;
  if (sessionId) {
    const initialLen = chatHistory.length;
    for (let i = chatHistory.length - 1; i >= 0; i--) {
      if (chatHistory[i].sessionId === sessionId) {
        chatHistory.splice(i, 1);
      }
    }
    res.json({ message: `Cleared ${initialLen - chatHistory.length} messages for session ${sessionId}` });
  } else {
    const count = chatHistory.length;
    chatHistory.length = 0;
    res.json({ message: `Cleared all ${count} chat history records.` });
  }
});

// 7. POST /api/feedback
app.post('/api/feedback', (req: Request, res: Response) => {
  const { messageId, helpful } = req.body;
  const msg = chatHistory.find((m) => m.id === messageId);
  if (msg) {
    msg.helpful = Boolean(helpful);
    res.json({ message: 'Feedback recorded', messageId, helpful: msg.helpful });
  } else {
    res.status(404).json({ error: 'Message not found' });
  }
});

// 8. POST /api/test-suite (Automated test runner for project review demonstration!)
app.post('/api/test-suite', async (_req: Request, res: Response) => {
  const testResults = [];

  // Test 1: Known FAQ - Attendance
  const t1Start = Date.now();
  const res1 = searchKnowledgeBase('What is the minimum attendance required?');
  const t1Pass = res1.length > 0 && res1[0].item.id === 'faq-att-001';
  testResults.push({
    testId: 'TC-01',
    name: 'Known Academic FAQ Retrieval',
    input: 'What is the minimum attendance required?',
    expected: 'Match faq-att-001 (75% minimum attendance policy)',
    actual: res1.length > 0 ? `Matched ${res1[0].item.id} with score ${res1[0].score}` : 'No match found',
    passed: t1Pass,
    latencyMs: Date.now() - t1Start,
  });

  // Test 2: Unknown query fallback handling
  const t2Start = Date.now();
  const res2 = searchKnowledgeBase('Quantum thermodynamics of intergalactic spacecraft');
  const t2Pass = res2.length === 0 || res2[0].score < 20;
  testResults.push({
    testId: 'TC-02',
    name: 'Unknown Query Fallback Trigger',
    input: 'Quantum thermodynamics of intergalactic spacecraft',
    expected: 'Score below threshold (< 20) triggering graceful fallback',
    actual: res2.length > 0 ? `Top score: ${res2[0].score}` : 'Score: 0 (No match)',
    passed: t2Pass,
    latencyMs: Date.now() - t2Start,
  });

  // Test 3: Empty input validation
  const t3Start = Date.now();
  const tokensEmpty = tokenize('    ');
  const t3Pass = tokensEmpty.length === 0;
  testResults.push({
    testId: 'TC-03',
    name: 'Empty and Whitespace Input Validation',
    input: '   ',
    expected: 'Zero tokens produced, safe rejection without crash',
    actual: `Tokens: ${tokensEmpty.length}`,
    passed: t3Pass,
    latencyMs: Date.now() - t3Start,
  });

  // Test 4: Health endpoint integrity
  const t4Start = Date.now();
  const t4Pass = academicFAQs.length > 10;
  testResults.push({
    testId: 'TC-04',
    name: 'Backend Academic Knowledge Base Integrity',
    input: 'GET /api/faqs',
    expected: 'Knowledge base loaded with > 10 verified academic FAQs',
    actual: `${academicFAQs.length} verified institutional records loaded`,
    passed: t4Pass,
    latencyMs: Date.now() - t4Start,
  });

  // Test 5: Telugu query language detection
  const t5Start = Date.now();
  const isTe = isTelugu('కనీస హాజరు ఎంత ఉండాలి?');
  const teMatches = searchKnowledgeBase('కనీస హాజరు');
  const t5Pass = isTe && teMatches.length > 0;
  testResults.push({
    testId: 'TC-05',
    name: 'Telugu Query Language Recognition & Matching',
    input: 'కనీస హాజరు ఎంత ఉండాలి?',
    expected: 'Recognized as Telugu script and matched attendance FAQ',
    actual: `isTelugu: ${isTe}, Matched: ${teMatches.length > 0 ? teMatches[0].item.id : 'None'}`,
    passed: t5Pass,
    latencyMs: Date.now() - t5Start,
  });

  // Test 6: Revaluation and fee query match
  const t6Start = Date.now();
  const res6 = searchKnowledgeBase('revaluation procedure and fee');
  const t6Pass = res6.length > 0 && res6[0].item.id === 'faq-exam-003';
  testResults.push({
    testId: 'TC-06',
    name: 'Examination Revaluation Matching',
    input: 'revaluation procedure and fee',
    expected: 'Match faq-exam-003',
    actual: res6.length > 0 ? `Matched ${res6[0].item.id}` : 'No match',
    passed: t6Pass,
    latencyMs: Date.now() - t6Start,
  });

  // Test 7: Plagiarism policy match
  const t7Start = Date.now();
  const res7 = searchKnowledgeBase('plagiarism rules for assignments');
  const t7Pass = res7.length > 0 && res7[0].item.id === 'faq-lab-002';
  testResults.push({
    testId: 'TC-07',
    name: 'Assignment & Plagiarism Rules Retrieval',
    input: 'plagiarism rules for assignments',
    expected: 'Match faq-lab-002 (Turnitin 15% threshold)',
    actual: res7.length > 0 ? `Matched ${res7[0].item.id}` : 'No match',
    passed: t7Pass,
    latencyMs: Date.now() - t7Start,
  });

  // Test 8: Response time performance SLA (< 50ms for local search)
  const t8Start = Date.now();
  for (let i = 0; i < 50; i++) {
    searchKnowledgeBase('hostel curfew timings');
  }
  const avgLatency = (Date.now() - t8Start) / 50;
  const t8Pass = avgLatency < 10;
  testResults.push({
    testId: 'TC-08',
    name: 'Retrieval Engine Latency Benchmark',
    input: '50 sequential queries ("hostel curfew timings")',
    expected: 'Average latency under 10ms per query',
    actual: `Average latency: ${avgLatency.toFixed(2)}ms`,
    passed: t8Pass,
    latencyMs: Math.round(avgLatency),
  });

  const totalPassed = testResults.filter((t) => t.passed).length;

  res.json({
    summary: {
      totalTests: testResults.length,
      passed: totalPassed,
      failed: testResults.length - totalPassed,
      passRate: `${Math.round((totalPassed / testResults.length) * 100)}%`,
      status: totalPassed === testResults.length ? 'ALL_TESTS_PASSED' : 'SOME_TESTS_FAILED',
      timestamp: new Date().toISOString(),
    },
    tests: testResults,
  });
});

// Vite Integration: Serve frontend in dev & prod
async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AI Student Query Chatbot] Full-stack server running at http://localhost:${PORT}`);
    console.log(`[Backend] Gemini API configured: ${Boolean(ai)}`);
    console.log(`[Backend] Loaded ${academicFAQs.length} institutional FAQs.`);
  });
}

startServer().catch((err) => {
  console.error('[Backend] Failed to start server:', err);
  process.exit(1);
});
