# db.py
import sqlite3
from flask import current_app


def get_db_connection():
   conn = sqlite3.connect(current_app.config["DATABASE"])
   conn.row_factory = sqlite3.Row
   return conn


def init_db():
   with get_db_connection() as conn:
      conn.execute("""
                CREATE TABLE IF NOT EXISTS product (
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  category TEXT NOT NULL,
                  name TEXT NOT NULL,
                  price REAL NOT NULL
                )
                """)


def create_product(category, name, price):
   with get_db_connection() as conn:
      cursor = conn.execute(
         "INSERT INTO product (category, name, price) VALUES (?, ?, ?)",
         (category, name, price),
      )
      return cursor.lastrowid


def get_product(product_id):
   with get_db_connection() as conn:
      product = conn.execute(
         "SELECT id, category, name, price FROM product WHERE id = ?",
         (product_id,),
      ).fetchone()
      return dict(product) if product else None


def get_products():
   with get_db_connection() as conn:
      products = conn.execute(
         "SELECT id, category, name, price FROM product ORDER BY id"
      ).fetchall()
      return [dict(product) for product in products]


def update_product(product_id, category, name, price):
   with get_db_connection() as conn:
      cursor = conn.execute(
         """UPDATE product
            SET category = ?, name = ?, price = ?
            WHERE id = ?""",
         (category, name, price, product_id),
      )
      return cursor.rowcount > 0


def delete_product(product_id):
   with get_db_connection() as conn:
      cursor = conn.execute("DELETE FROM product WHERE id = ?", (product_id,))
      return cursor.rowcount > 0

