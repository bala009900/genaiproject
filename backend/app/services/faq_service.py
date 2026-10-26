"""
Academic FAQ Retrieval Service
"""
import json
import os
import re
from typing import List, Dict, Any, Optional

DATA_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../data/sample_faqs.json"))

class FAQService:
    def __init__(self):
        self.faqs: List[Dict[str, Any]] = []
        self.load_faqs()

    def load_faqs(self):
        if os.path.exists(DATA_PATH):
            with open(DATA_PATH, "r", encoding="utf-8") as f:
                self.faqs = json.load(f)
        else:
            self.faqs = []

    def is_telugu(self, text: str) -> bool:
        return bool(re.search(r"[\u0C00-\u0C7F]", text))

    def tokenize(self, text: str) -> List[str]:
        cleaned = re.sub(r"[^\w\s\u0C00-\u0C7F]", " ", text.lower())
        return [t for t in cleaned.split() if len(t) > 2]

    def search(self, query: str, lang: str = "en") -> List[Dict[str, Any]]:
        tokens = self.tokenize(query)
        if not tokens:
            return []

        scored = []
        q_lower = query.lower().strip()

        for faq in self.faqs:
            score = 0
            faq_q = faq.get("question", "").lower()
            faq_a = faq.get("answer", "").lower()
            faq_cat = faq.get("category", "").lower()
            tq = (faq.get("teluguQuestion") or "").lower()
            ta = (faq.get("teluguAnswer") or "").lower()

            if q_lower in faq_q or q_lower in tq:
                score += 60

            for t in tokens:
                for kw in faq.get("keywords", []):
                    if t in kw.lower():
                        score += 25
                if t in faq_q or t in tq:
                    score += 20
                if t in faq_cat:
                    score += 15
                if t in faq_a or t in ta:
                    score += 8

            if score > 0:
                scored.append({"item": faq, "score": score})

        scored.sort(key=lambda x: x["score"], reverse=True)
        return scored
