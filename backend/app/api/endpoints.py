"""
FastAPI REST Endpoints for AI Student Query Chatbot
"""
import time
import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException, Query
from ..models.schemas import ChatRequest, ChatResponse, HealthResponse, FeedbackRequest
from ..services.faq_service import FAQService
from ..services.llm_service import LLMService
from ..database.database import log_message, get_session_history

router = APIRouter(prefix="/api")
faq_service = FAQService()
llm_service = LLMService()
START_TIME = time.time()

@router.get("/health", response_model=HealthResponse)
def health_check():
    return HealthResponse(
        status="healthy",
        timestamp=datetime.utcnow().isoformat() + "Z",
        uptimeSeconds=int(time.time() - START_TIME),
        faqCount=len(faq_service.faqs),
        geminiConfigured=llm_service.is_available(),
        version="1.0.0-academic"
    )

@router.get("/faqs")
def get_faqs(category: str = Query(None), search: str = Query(None)):
    faqs = list(faq_service.faqs)
    if category and category != "All":
        faqs = [f for f in faqs if f.get("category", "").lower() == category.lower()]
    if search:
        s = search.lower()
        faqs = [f for f in faqs if s in f.get("question", "").lower() or s in f.get("answer", "").lower()]
    categories = ["All"] + sorted(list(set(f.get("category", "") for f in faq_service.faqs if f.get("category"))))
    return {"total": len(faqs), "categories": categories, "faqs": faqs}

@router.post("/chat", response_model=ChatResponse)
def handle_chat(req: ChatRequest):
    message = req.message.strip()
    if not message:
        raise HTTPException(status_code=400, detail="Empty query string")

    lang = "te" if req.language == "te" or (req.language == "auto" and faq_service.is_telugu(message)) else "en"
    
    # Greetings check
    clean = message.lower()
    if any(g in clean for g in ["hi", "hello", "hey", "నమస్కారం", "help"]):
        ans = (
            "నమస్కారం! నేను మీ కాలేజీ AI విద్యార్థి చాట్‌బాట్‌ని. హాజరు, పరీక్షలు, ల్యాబ్‌లు మరియు కోర్సుల వివరాల గురించి అడగవచ్చు."
            if lang == "te" else
            "Hello! I am your AI Student Query Chatbot. I can assist with syllabus, exam dates, attendance regulations, lab guidelines, and college facilities."
        )
        return ChatResponse(
            answer=ans,
            confidence=100,
            source="KNOWLEDGE_BASE",
            category="General Greetings",
            language=lang,
            suggestions=["What is the minimum attendance required?", "When are end-semester exams?"],
            disclaimer="Institutional Demonstration Data",
            timestamp=datetime.utcnow().isoformat() + "Z"
        )

    # Search KB
    matches = faq_service.search(message, lang=lang)
    best = matches[0] if matches else None
    
    answer = ""
    source = "KNOWLEDGE_BASE"
    confidence = 50
    cat = best["item"]["category"] if best else "General Academic"

    if best and best["score"] >= 25:
        confidence = min(98, int(best["score"] * 1.2))
        if llm_service.is_available():
            try:
                answer = llm_service.generate_academic_answer(message, best["item"], lang=lang)
                source = "HYBRID_AI"
            except Exception:
                answer = best["item"].get("teluguAnswer") if lang == "te" and best["item"].get("teluguAnswer") else best["item"]["answer"]
                source = "KNOWLEDGE_BASE"
        else:
            answer = best["item"].get("teluguAnswer") if lang == "te" and best["item"].get("teluguAnswer") else best["item"]["answer"]
            source = "KNOWLEDGE_BASE"
    else:
        if llm_service.is_available():
            try:
                answer = llm_service.generate_academic_answer(message, None, lang=lang)
                source = "GENERATIVE_AI"
                confidence = 65
            except Exception:
                answer = "I could not locate this academic policy in the college database. Please consult your Department HOD."
                source = "FALLBACK"
                confidence = 20
        else:
            answer = "I could not locate this academic policy in the college database. Please consult your Department HOD."
            source = "FALLBACK"
            confidence = 20

    # Log to SQLite
    msg_id = f"msg-{uuid.uuid4()}"
    log_message(msg_id, req.sessionId, "user", message, language=lang)
    log_message(f"msg-{uuid.uuid4()}", req.sessionId, "bot", answer, source=source, category=cat, confidence=confidence, language=lang)

    return ChatResponse(
        answer=answer,
        confidence=confidence,
        source=source,
        category=cat,
        language=lang,
        suggestions=["Check attendance policy", "Exam revaluation process", "Library hours"],
        disclaimer="Institutional Demonstration Data for academic project evaluation.",
        timestamp=datetime.utcnow().isoformat() + "Z"
    )

@router.get("/history")
def get_history(sessionId: str = Query(None)):
    return {"history": get_session_history(sessionId)}
