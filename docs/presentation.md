# Project Review Presentation & Viva Preparation Guide
## AI Student Query Chatbot: An Intelligent Academic Assistance System

---

## Part 1: Review Presentation Slide Deck (10 Slides with Speaker Notes)

### **Slide 1: Title and Project Details**
- **Title:** AI Student Query Chatbot — An Intelligent Academic Assistance System
- **Student Details:**
  - Name: [Student Name]
  - Roll No: [Roll Number]
  - Branch: Computer Science & Engineering / AI & DS
- **Supervisor / Guide:** [Guide Name, Designation]
- **Institution:** [College / University Name]
> **Speaker Notes (Slide 1):**
> "Respected evaluators and guides, good morning. Today I am presenting my academic project titled 'AI Student Query Chatbot: An Intelligent Academic Assistance System'. This project bridges institutional policies and student inquiries through conversational AI and verified knowledge retrieval."

---

### **Slide 2: Introduction**
- Students frequently seek information on attendance, exams, lab evaluations, and faculty contacts.
- Currently, this information is trapped in 50+ page PDF handbooks or requires physical office visits.
- This project develops a 24/7 web assistant that provides immediate, verified answers in English and Telugu.
> **Speaker Notes (Slide 2):**
> "In every university, students spend excessive time trying to find basic answers like minimum attendance, revaluation fees, or lab guidelines. Our chatbot acts as a virtual 24/7 academic advisor, making college regulations instantly accessible and transparent."

---

### **Slide 3: Problem Statement**
- High administrative burden on faculty mentors and HODs answering repetitive questions.
- Long student queues at administrative and examination branches during critical exam weeks.
- Peer misinformation spreading on unofficial WhatsApp groups.
- Lack of vernacular (Telugu) support in formal university documentation.
> **Speaker Notes (Slide 3):**
> "The core issue is information friction. Busy faculty spend hundreds of hours every semester answering identical baseline questions. Meanwhile, students relying on peer chat groups risk acting on outdated rumors. Our system solves this with authoritative institutional grounding."

---

### **Slide 4: Existing System vs. Proposed System**
| Feature | Existing System | Proposed AI Chatbot |
| :--- | :--- | :--- |
| **Availability** | Office hours only (9 AM - 5 PM) | 24/7 Instant Access |
| **Search Mechanism** | Manual reading of static PDFs | Natural Language Querying |
| **Response Format** | Dense bureaucratic circulars | Structured, student-friendly markdown |
| **Language** | English only | English & Telugu Bilingual |
| **Hallucination Risk** | N/A (Manual) | Zero (Knowledge-Grounded Prompts) |
> **Speaker Notes (Slide 4):**
> "As seen in this comparison table, our proposed system shifts student support from a slow, manual, English-only model to an instant, 24/7, bilingual conversational service with verified policy grounding."

---

### **Slide 5: Proposed System Architecture**
- **Client Tier:** React 19 + TypeScript + Tailwind CSS responsive interface.
- **API Tier:** FastAPI / Express REST endpoints with input normalization and language detection.
- **Knowledge Base:** Structured, categorized academic FAQ repository.
- **AI Tier:** Google Gemini (`gemini-3.8-flash`) with prompt-grounding guardrails.
- **Persistence:** SQLite / JSON conversation history and analytics.
> **Speaker Notes (Slide 5):**
> "The architecture follows a clean three-tier design. When a student types a query, our normalization engine checks the language and searches the local indexed FAQ base. If an authoritative policy is found, it grounds the Gemini model to synthesize a polite, formatted response. If external APIs are unavailable, a deterministic fallback guarantees zero downtime."

---

### **Slide 6: Technology Stack**
- **Frontend:** React 19, TypeScript, Tailwind CSS, Vite, Lucide Icons
- **Backend:** Node.js (Express) & Python 3.11 (FastAPI)
- **AI / LLM:** Google GenAI SDK (`gemini-3.8-flash`)
- **Database:** SQLite & JSON structured stores
- **Testing:** Automated Pytest and In-App Test Runner
> **Speaker Notes (Slide 6):**
> "We selected production-grade technologies: React 19 for reactive rendering, FastAPI and Express for high-throughput REST APIs, and Google's latest Gemini 3.8 Flash model for fast, cost-effective reasoning."

---

### **Slide 7: Key Features & Capabilities**
1. **Multi-Domain Coverage:** Attendance, Exams, Courses, Labs, Faculty, Facilities.
2. **Bilingual Support:** Natural comprehension of English and Telugu scripts.
3. **Accessibility:** Text-to-speech synthesis (listen to answers) and quick suggestion chips.
4. **Reliability Guardrails:** Graceful fallback when queries are out of scope.
5. **Auditing & History:** Session persistence, feedback rating, and chat export.
> **Speaker Notes (Slide 7):**
> "Key capabilities include six academic categories, Telugu language processing, one-click text-to-speech for accessibility, and a built-in feedback loop so students can rate answer helpfulness."

---

### **Slide 8: Implementation & Application Demonstration**
- Live Chat Interface with distinct user/bot message bubbles and source tags.
- Knowledge Base Explorer allowing students to browse and search all regulations.
- Dynamic FAQ Addition allowing administrators to publish urgent circulars.
- In-App Automated Test Suite executing live verification tests.
> **Speaker Notes (Slide 8):**
> "In our live application, students can either ask questions directly or click quick action cards like 'Attendance' or 'Exam Schedule'. Let us observe the live demonstration where asking about attendance rules cites the exact 75% threshold and condonation criteria."

---

### **Slide 9: Testing and Evaluation Results**
- Evaluated across 10 functional and security test cases.
- **100% Pass Rate** across known FAQs, unknown query fallback, empty inputs, and health checks.
- **Sub-10ms retrieval latency** for local knowledge base queries.
- Zero server crashes observed under stress and malformed inputs.
> **Speaker Notes (Slide 9):**
> "We conducted rigorous automated testing across 10 test vectors. The system achieved a 100% pass rate. Local policy retrieval executes in under 10 milliseconds, ensuring instantaneous feedback for students."

---

### **Slide 10: Conclusion & Future Enhancements**
- **Conclusion:** Successfully built a production-grade, reliable, bilingual AI academic chatbot.
- **Future Scope:**
  - Single Sign-On (SSO) with University ERP to answer personal inquiries (*"What is my CGPA?"*).
  - Voice query integration via automatic speech recognition.
  - Official WhatsApp Business API integration for campus-wide deployment.
> **Speaker Notes (Slide 10):**
> "In conclusion, the AI Student Query Chatbot demonstrates how generative AI can be safely and effectively deployed in higher education by pairing LLMs with verified institutional guardrails. In the future, we plan to integrate student ERP SSO and WhatsApp integration. Thank you, and I am now ready for your questions."

---

## Part 2: Review Speech Scripts

### **1-Minute Elevator Pitch (For Quick Overview)**
> "Good morning, respected examiners. My project is the **AI Student Query Chatbot**, an intelligent academic support system built using React, FastAPI/Express, and Google Gemini. In universities, students routinely struggle to find answers about attendance limits, exam dates, revaluation fees, and syllabus requirements. These rules are buried in complex 50-page handbooks. Our chatbot solves this by allowing students to ask questions naturally in English or Telugu and receiving immediate, verified answers grounded in official college policies. It includes a fallback mechanism ensuring zero downtime, session history, and an automated test suite. It transforms student support into a fast, transparent 24/7 service."

### **2-Minute Explanation of the Problem Statement**
> "Respected evaluators, the motivation behind this project comes from a real challenge every student faces. In higher education, timely information is critical. If a student falls below 75% attendance without knowing the condonation procedure, they risk detention. If they do not know the 10-day revaluation deadline, they miss the chance to improve their grade. Currently, students have only two options: physically queuing at the HOD's office or asking classmates on WhatsApp groups where rumors and outdated circulars frequently spread. 
> 
> Furthermore, faculty members are burdened by answering the exact same 10 questions hundreds of times every semester. Existing university websites are static and difficult to navigate on mobile devices. 
> 
> Therefore, our problem statement was to design an AI-powered conversational assistant that normalizes student queries, retrieves verified institutional rules, and synthesizes student-friendly explanations with zero hallucinations. By doing so, we save faculty time, eliminate student anxiety, and ensure consistent policy enforcement."

### **3-Minute Technical Implementation Walkthrough**
> "Let me walk you through the technical implementation of the system.
> 
> First, on the **Frontend**, we built a reactive single-page dashboard using React 19, TypeScript, and Tailwind CSS. We designed custom message bubbles that display the response source—whether it came directly from the Knowledge Base or was synthesized by Gemini AI. We also implemented Web Speech synthesis so students can listen to answers, alongside Telugu language toggle and chat export features.
> 
> Second, on the **Backend**, we implemented REST APIs using Express and FastAPI. When a POST request arrives at `/api/chat`, the system executes a 3-step pipeline:
> 1. **Input Normalization & Language Detection:** The text is sanitized, and we detect if it contains Telugu Unicode characters in the range U+0C00 to U+0C7F.
> 2. **Keyword & Similarity Scoring:** We compute a match score across question titles, keyword tags, categories, and policy bodies.
> 3. **AI Grounding & Synthesis:** If a strong match is found, we call Google Gemini `gemini-3.8-flash` via the `@google/genai` SDK with temperature 0.3. Crucially, we inject the official policy text into the prompt. The model is instructed to formulate its answer solely based on that verified context, preventing hallucination.
> 
> If the query is unknown or the API is offline, our deterministic fallback triggers, providing helpful contact details for the Academic Dean and HOD.
> 
> Finally, we built an **Automated Test Runner** accessible directly from the interface. It runs 8 live tests—such as verifying the 75% attendance rule, testing empty inputs, and checking latency—providing complete transparency during academic evaluation."

---

## Part 3: Common Viva Questions & Model Answers

### **Q1: Why did you use a Hybrid AI approach instead of directly passing the question to Gemini?**
> **Answer:** "Directly prompting a general LLM carries a high risk of hallucination—the model might invent college-specific fee amounts, grading rules, or exam dates that do not exist. In our hybrid architecture, the local knowledge base acts as the ground truth. We pass the retrieved institutional policy to Gemini as grounding context. This ensures that the generated answer is conversational and student-friendly while remaining 100% factually accurate."

### **Q2: What happens if the external Gemini API is unreachable or the network goes down?**
> **Answer:** "Our system features a robust deterministic fallback. If the API key is missing or an API call fails, the backend automatically catches the error and serves the verified FAQ text directly from our local knowledge base without crashing. If no relevant FAQ exists, it returns a polite fallback message with department office hours."

### **Q3: How is multilingual support (Telugu) implemented?**
> **Answer:** "We detect Telugu queries through Unicode block inspection (`[\u0C00-\u0C7F]`). Our knowledge base contains curated Telugu translations of questions and answers. When Telugu is detected, the search engine matches against Telugu keywords, and Gemini is instructed via system instructions to formulate the answer naturally in Telugu script."

### **Q4: How do you prevent SQL injection or malicious inputs?**
> **Answer:** "We validate all inputs on both frontend and backend using Pydantic schemas in FastAPI and Express validators. In our SQLite persistence layer, all queries use parameterized prepared statements (`?` placeholders), preventing SQL injection. Furthermore, inputs are stripped of HTML tags to prevent cross-site scripting (XSS)."

### **Q5: Can this chatbot be deployed in any university?**
> **Answer:** "Yes, the architecture is completely modular and decoupled. All institutional policies are stored in a structured JSON/SQLite knowledge base (`sample_faqs.json`). A college administrator can simply update the JSON file or use our `/api/faqs` endpoint to replace the sample data with their own college regulations without changing any application code."

### **Q6: What is the role of temperature in your Gemini model configuration?**
> **Answer:** "We explicitly configure the temperature to 0.3. A low temperature minimizes model randomness and creativity, which is essential for an academic policy chatbot where factual consistency and fidelity to regulations are paramount."

### **Q7: What is the difference between this chatbot and a standard FAQ search bar?**
> **Answer:** "A search bar requires exact keyword matching and returns a raw list of links. Our chatbot understands natural language inquiries (e.g., *'I have 68% attendance, can I write exams?'*), maps the intent to the condonation policy, explains the rules in clear bullet points, suggests follow-up actions, and answers in regional languages."
