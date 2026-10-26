"""
LLM Integration Service with Google GenAI SDK (gemini-3.8-flash)
"""
import os
from typing import Optional, Dict, Any

class LLMService:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.client = None
        if self.api_key:
            try:
                from google import genai
                self.client = genai.Client(api_key=self.api_key)
            except Exception as e:
                print(f"[LLMService] Could not initialize Google GenAI SDK: {e}")

    def is_available(self) -> bool:
        return self.client is not None

    def generate_academic_answer(self, question: str, matched_faq: Optional[Dict[str, Any]] = None, lang: str = "en") -> str:
        if not self.client:
            raise RuntimeError("Gemini API client not configured")

        system_instruction = (
            "You are the official AI Academic Assistant for student query resolution. "
            "Provide accurate, polite, and well-structured answers using Markdown. "
            f"Language requirement: {'Respond in clear Telugu' if lang == 'te' else 'Respond in clear English'}. "
            "Ground your response strictly on provided institutional policy. If no policy is provided, give standard general academic guidance with a note to verify with HOD."
        )

        user_content = f"Student Question: {question}\n\n"
        if matched_faq:
            policy_text = matched_faq.get("teluguAnswer") if lang == "te" and matched_faq.get("teluguAnswer") else matched_faq.get("answer")
            user_content += f"Institutional Policy Reference:\n{policy_text}\n"

        response = self.client.models.generate_content(
            model="gemini-3.8-flash",
            contents=user_content,
            config={"system_instruction": system_instruction, "temperature": 0.3}
        )
        return response.text
