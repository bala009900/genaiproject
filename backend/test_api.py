"""
Automated Backend Unit & Integration Tests
Run via: pytest test_api.py
"""
import pytest
from app.services.faq_service import FAQService

@pytest.fixture
def faq_service():
    return FAQService()

def test_faqs_loaded(faq_service):
    assert len(faq_service.faqs) >= 10, "FAQ Knowledge base should contain at least 10 items"

def test_attendance_query_match(faq_service):
    matches = faq_service.search("What is the minimum attendance required?")
    assert len(matches) > 0, "Should match attendance query"
    assert matches[0]["item"]["id"] == "faq-att-001"
    assert matches[0]["score"] > 30

def test_revaluation_query_match(faq_service):
    matches = faq_service.search("revaluation fee and procedure")
    assert len(matches) > 0, "Should match revaluation query"
    assert "reval" in matches[0]["item"]["id"].lower() or "exam" in matches[0]["item"]["id"].lower()

def test_telugu_detection(faq_service):
    assert faq_service.is_telugu("కనీస హాజరు ఎంత ఉండాలి?") is True
    assert faq_service.is_telugu("Minimum attendance?") is False

def test_empty_query_safely_handled(faq_service):
    matches = faq_service.search("    ")
    assert matches == []

def test_unknown_query_low_score(faq_service):
    matches = faq_service.search("astrophysics quantum flux capacitor teleportation")
    if matches:
        assert matches[0]["score"] < 25, "Unrelated query should not have high match score"
