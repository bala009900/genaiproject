# Technical Implementation Guide
## Project: AI Student Query Chatbot

### 1. Technology Stack Overview
- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide React icons, Vite build system.
- **Backend Service (Dual Implementation):**
  - **Full-Stack Node.js (Express):** Powers the live interactive preview on port 3000 with Vite middleware integration in `server.ts`.
  - **Python (FastAPI):** Standalone asynchronous Python implementation in `backend/` with Pydantic schemas, SQLite persistence, and CORS middleware.
- **AI / LLM Integration:** Google GenAI SDK with model `gemini-3.8-flash`.
- **Data Layer:** `data/sample_faqs.json` containing structured institutional knowledge entries with English and Telugu translations.

---

### 2. Retrieval and Answering Pipeline

```
[Student Input]
       │
       ▼
[Language & Script Detection]
       │
       ▼
[Tokenization & Normalization]
       │
       ▼
[Keyword-Weighted Knowledge Base Matching]
       │
       ├─ Score >= 35 ───────────► High Confidence Match
       │                                  │
       │                                  ▼
       │                          [LLM Available?]
       │                           ├── Yes ──► Grounded Gemini Generation (HYBRID_AI)
       │                           └── No  ──► Direct Verified FAQ Text (KNOWLEDGE_BASE)
       │
       └─ Score < 35 ────────────► Low / No Match
                                          │
                                          ▼
                                  [LLM Available?]
                                   ├── Yes ──► General Guidance + Disclaimer (GENERATIVE_AI)
                                   └── No  ──► Standard Fallback + Contacts (FALLBACK)
```

---

### 3. API Endpoints Specification

| Method | Endpoint | Description | Request Body | Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Server status and stats | None | `{ status, uptimeSeconds, faqCount, geminiConfigured }` |
| `GET` | `/api/faqs` | Retrieve all FAQs | `?category=...&search=...` | `{ total, categories, faqs }` |
| `POST` | `/api/faqs` | Add new academic notice | `{ category, question, answer, keywords }` | `{ message, faq }` |
| `POST` | `/api/chat` | Process student question | `{ message, sessionId, language }` | `{ answer, confidence, source, category, suggestions }` |
| `GET` | `/api/history` | Retrieve conversation logs | `?sessionId=...` | `{ total, messages }` |
| `POST` | `/api/clear-history` | Clear session chat | `{ sessionId }` | `{ message }` |
| `POST` | `/api/feedback` | Record helpfulness | `{ messageId, helpful }` | `{ message, helpful }` |
| `POST` | `/api/test-suite` | Run 8 automated tests | None | `{ summary: { passed, total }, tests: [...] }` |

---

### 4. Code File Structure

```
student-query-chatbot/
├── data/
│   └── sample_faqs.json        # Academic demonstration FAQ knowledge base
├── docs/
│   ├── project_report.md       # Complete 24-section formal academic project report
│   ├── problem_statement.md    # Problem statement and domain context
│   ├── implementation.md       # Technical architecture and API specifications
│   ├── test_cases.md           # 10 detailed test case specifications
│   └── presentation.md         # 10-slide review outline, speaker notes, viva Q&A
├── backend/
│   ├── app/
│   │   ├── main.py             # FastAPI entry point
│   │   ├── api/endpoints.py    # REST routes (/api/chat, /api/faqs, etc.)
│   │   ├── models/schemas.py   # Pydantic schemas
│   │   ├── services/           # FAQ retrieval & LLM services
│   │   └── database/           # SQLite database layer
│   ├── requirements.txt        # Python backend dependencies
│   ├── .env.example            # Environment variables example
│   └── test_api.py             # Pytest automated test suite
├── src/
│   ├── App.tsx                 # Master dashboard with multi-tab layout
│   ├── components/             # Reusable modular UI components
│   │   ├── ChatInterface.tsx   # Interactive chat stream & input
│   │   ├── KnowledgeExplorer.tsx # FAQ search and category filter
│   │   ├── TestRunnerView.tsx  # Interactive automated test runner
│   │   ├── VivaReviewHub.tsx   # Presentation slides, viva Q&A, and elevator pitch
│   │   ├── QuickActionCards.tsx# Quick category selector cards
│   │   └── Navbar.tsx          # Branding and status indicators
│   ├── types.ts                # TypeScript interface declarations
│   ├── main.tsx                # React entry
│   └── index.css               # Tailwind CSS imports
├── server.ts                   # Full-stack Node.js server with Vite middleware
├── package.json
└── README.md
```
