# db.py
import sqlite3
from flask import current_app

def init_db():
    conn = sqlite3.connect(current_app.config["DATABASE"])
    conn.execute("""
                 CREATE TABLE IF NOT EXISTS product (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    category TEXT NOT NULL,
                    name TEXT NOT NULL,
                    price REAL NOT NULL
                 )
                 """)
    conn.commit()
    conn.close()
