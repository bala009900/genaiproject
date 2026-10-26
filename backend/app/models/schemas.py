"""
Pydantic Schemas for AI Student Query Chatbot
"""
from typing import List, Optional
from pydantic import BaseModel, Field

class FAQItem(BaseModel):
    id: str
    category: str
    question: str
    answer: str
    keywords: List[str] = []
    teluguQuestion: Optional[str] = None
    teluguAnswer: Optional[str] = None
    verified: bool = True
    lastUpdated: Optional[str] = None

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, description="Student academic query")
    sessionId: Optional[str] = Field("default-session", description="Session identifier")
    language: Optional[str] = Field("auto", description="Query language: 'auto', 'en', or 'te'")

class ChatResponse(BaseModel):
    answer: str
    confidence: int
    source: str
    category: str
    language: str
    suggestions: List[str] = []
    disclaimer: str
    timestamp: str

class HealthResponse(BaseModel):
    status: str
    timestamp: str
    uptimeSeconds: int
    faqCount: int
    geminiConfigured: bool
    version: str

class FeedbackRequest(BaseModel):
    messageId: str
    helpful: bool
    comment: Optional[str] = None
