# Academic Problem Statement
## Project: AI Student Query Chatbot

### 1. Context and Domain
Higher education institutions enforce diverse academic guidelines covering attendance requirements, grading systems, examination schedules, assignment submissions, lab evaluations, and campus amenities. In a typical college with thousands of enrolled students, timely dissemination of accurate academic information is critical for student performance and institutional compliance.

### 2. Core Problem
Students continually encounter difficulties obtaining immediate, authentic answers to routine academic inquiries:
- **Administrative Friction:** Physical offices (Examination Branch, Dean's Office, HOD Chambers) have limited operating hours and long queues.
- **Fragmented Documentation:** Information is scattered across hundreds of pages of unindexed PDF circulars, college portals, and notice boards.
- **Peer Misinformation:** Unofficial WhatsApp and Telegram groups frequently disseminate rumors, incorrect exam schedules, or obsolete fee amounts.
- **Staff Overburden:** Administrative personnel and faculty mentors spend hundreds of working hours every semester manually answering the exact same repetitive questions.
- **Language Barriers:** First-generation or vernacular-medium students struggle to parse convoluted academic English in formal regulations.

### 3. Proposed Solution
To engineer an intelligent, web-based conversational assistant that:
1. Normalizes and interprets natural language student queries in English and regional Telugu.
2. Performs keyword-weighted similarity retrieval against an indexed, verified institutional knowledge base.
3. Augments matched policy text using Google Gemini (`gemini-3.8-flash`) to generate student-friendly, empathetic explanations while strictly suppressing hallucinations.
4. Provides deterministic fallbacks when external APIs or network connectivity fail.
5. Logs conversational analytics and provides automated test verification for academic evaluation.

### 4. Target Beneficiaries
- **Enrolled Undergraduate and Postgraduate Students:** Instant 24/7 answers to pressing questions.
- **Department Faculty & Mentors:** Drastic reduction in repetitive administrative queries.
- **Academic Administration & Exam Branch:** Streamlined communication and consistent policy enforcement.
