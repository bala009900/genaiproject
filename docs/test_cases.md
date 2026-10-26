# Test Cases and Verification Matrix
## Project: AI Student Query Chatbot

This document details the test scenarios, preconditions, execution steps, expected outcomes, and observed results for the AI Student Query Chatbot.

---

### Test Summary Dashboard
- **Total Test Cases:** 10
- **Passed:** 10
- **Failed:** 0
- **Pass Rate:** 100%
- **Execution Environment:** Full-Stack Node.js (v22), FastAPI (v0.110), React 19, Google Chrome / Chromium

---

### Detailed Test Specifications

#### TC-01: Known Academic FAQ Retrieval (Attendance Policy)
- **Objective:** Verify that asking about minimum attendance retrieves the official 75% rule from `faq-att-001`.
- **Preconditions:** Server running, knowledge base loaded with `faq-att-001`.
- **Input:** `"What is the minimum attendance required to appear for semester examinations?"`
- **Steps:** Submit input via chat interface or `POST /api/chat`.
- **Expected Result:** Response contains 75% threshold, condonation criteria (65%-74.9%), and detention penalty. Source labeled as `KNOWLEDGE_BASE` or `HYBRID_AI`. Confidence score >= 80%.
- **Status:** **PASS**

#### TC-02: Examination Revaluation Procedure and Fee
- **Objective:** Verify accurate retrieval of revaluation timelines and fee amounts from `faq-exam-003`.
- **Input:** `"How can I apply for paper revaluation and what is the fee?"`
- **Expected Result:** Returns 10-day application window, Rs. 1,000 per theory paper fee, and recounting fee of Rs. 200.
- **Status:** **PASS**

#### TC-03: Unknown Question Fallback Handling
- **Objective:** Verify that out-of-domain or unanswerable queries trigger a polite fallback without crashing.
- **Input:** `"Quantum particle physics of interstellar propulsion engines"`
- **Expected Result:** System recognizes query as out of institutional scope. If LLM is active, provides general guidance with disclaimer to consult HOD; if offline, returns standard institutional fallback.
- **Status:** **PASS**

#### TC-04: Empty and Whitespace Input Validation
- **Objective:** Ensure empty or whitespace-only inputs are safely rejected.
- **Input:** `""` and `"     "`
- **Expected Result:** HTTP 400 Bad Request with descriptive JSON error message; UI prevents sending empty input.
- **Status:** **PASS**

#### TC-05: Telugu Regional Language Query Recognition
- **Objective:** Verify that Telugu script is detected and processed with vernacular response.
- **Input:** `"కనీస హాజరు ఎంత ఉండాలి?"`
- **Expected Result:** Telugu Unicode block (`[\u0C00-\u0C7F]`) is detected; returns Telugu explanation citing 75% attendance rule.
- **Status:** **PASS**

#### TC-06: Backend Health Endpoint Integrity
- **Objective:** Verify `GET /api/health` returns correct service status and telemetry.
- **Input:** `GET /api/health`
- **Expected Result:** HTTP 200 OK with `status: "healthy"`, positive `uptimeSeconds`, `faqCount >= 10`, and boolean `geminiConfigured`.
- **Status:** **PASS**

#### TC-07: Chat Session History Logging
- **Objective:** Verify that user inquiries and bot responses are persistently logged.
- **Input:** Send a message with `sessionId: "test-session-123"`.
- **Steps:** Call `GET /api/history?sessionId=test-session-123`.
- **Expected Result:** History contains both user turn and bot turn with valid timestamps.
- **Status:** **PASS**

#### TC-08: Clear Chat Functionality
- **Objective:** Verify that clearing a chat session deletes conversation entries.
- **Input:** `POST /api/clear-history` with `sessionId: "test-session-123"`.
- **Expected Result:** Subsequent `GET /api/history` returns zero messages for that session.
- **Status:** **PASS**

#### TC-09: Dynamic FAQ Addition by Administrator
- **Objective:** Verify that adding a new FAQ at runtime updates the searchable knowledge base.
- **Input:** `POST /api/faqs` with `{ category: "Notices", question: "When is the annual tech fest?", answer: "March 15-17" }`.
- **Expected Result:** HTTP 201 Created; subsequent query about "tech fest" retrieves the newly added record.
- **Status:** **PASS**

#### TC-10: Cross-Device Responsive Layout
- **Objective:** Ensure UI adapts smoothly between desktop (1920x1080), tablet (768x1024), and mobile (375x812) viewports.
- **Expected Result:** Navigation tabs collapse cleanly, quick action cards reflow, input toolbar remains sticky, chat bubbles don't overflow viewport.
- **Status:** **PASS**
