"""
SQLite Database Layer for AI Student Query Chatbot
"""
import sqlite3
import os
import json
from typing import List, Dict, Any, Optional

DB_PATH = os.path.join(os.path.dirname(__file__), "../../../student_chatbot.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    
    # Create chats table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS chat_messages (
        id TEXT PRIMARY KEY,
        session_id TEXT NOT NULL,
        sender TEXT NOT NULL,
        message TEXT NOT NULL,
        source TEXT,
        category TEXT,
        confidence INTEGER,
        language TEXT,
        helpful BOOLEAN,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Create faqs table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS faqs (
        id TEXT PRIMARY KEY,
        category TEXT NOT NULL,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        keywords TEXT,
        telugu_question TEXT,
        telugu_answer TEXT,
        verified BOOLEAN DEFAULT 1,
        last_updated TEXT
    )
    """)
    conn.commit()
    conn.close()

def log_message(msg_id: str, session_id: str, sender: str, text: str, source: str = "", category: str = "", confidence: int = 100, language: str = "en"):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO chat_messages (id, session_id, sender, message, source, category, confidence, language)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (msg_id, session_id, sender, text, source, category, confidence, language))
    conn.commit()
    conn.close()

def get_session_history(session_id: Optional[str] = None) -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    if session_id:
        cursor.execute("SELECT * FROM chat_messages WHERE session_id = ? ORDER BY created_at ASC", (session_id,))
    else:
        cursor.execute("SELECT * FROM chat_messages ORDER BY created_at ASC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]
