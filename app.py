from flask import Flask, jsonify, request
from flask_cors import CORS
from db import *
import datetime as dt
import os

app = Flask(__name__)
CORS(
    app,
    resources={
        r"/products*": {"origins": "http://localhost:5173"},
        r"/getproducts": {"origins": "http://localhost:5173"},
    },
)
app.config["DATABASE"] = os.path.join(app.instance_path, "app.db")
os.makedirs(app.instance_path, exist_ok=True)

with app.app_context():
    init_db()

@app.route("/")
def hello_world():
    time = dt.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    return "<p>Hello from pythonAnywhere, time is now " + time + ".</p>"


@app.post("/products")
def add_product():
    data = request.get_json(silent=True)
    required_fields = ("category", "name", "price")

    if not isinstance(data, dict) or any(
        field not in data or data[field] is None for field in required_fields
    ):
        return jsonify({"error": "category, name, and price are required"}), 400

    product_id = create_product(
        data["category"],
        data["name"],
        data["price"],
    )
    return jsonify(get_product(product_id)), 201


@app.get("/getproducts")
def list_products():
    products = get_products()
    return jsonify(products)

@app.get("/products/<int:product_id>")
def get_product_by_id(product_id):
    product = get_product(product_id)
    if product is None:
        return jsonify({"error": "product not found"}), 404
    return jsonify(product)


@app.put("/products/<int:product_id>")
def update_product_by_id(product_id):
    data = request.get_json(silent=True)
    required_fields = ("category", "name", "price")

    if not isinstance(data, dict) or any(
        field not in data or data[field] is None for field in required_fields
    ):
        return jsonify({"error": "category, name, and price are required"}), 400

    if get_product(product_id) is None:
        return jsonify({"error": "product not found"}), 404

    updated = update_product(
        product_id,
        data["category"],
        data["name"],
        data["price"],
    )
    if not updated:
        return jsonify({"error": "product not found"}), 404

    return jsonify(get_product(product_id))


@app.delete("/products/<int:product_id>")
def delete_product_by_id(product_id):
    if get_product(product_id) is None:
        return jsonify({"error": "product not found"}), 404

    deleted = delete_product(product_id)
    if not deleted:
        return jsonify({"error": "product not found"}), 404

    return jsonify({"message": "product deleted"})


if __name__ == "__main__":
    # Only runs debug mode locally; PythonAnywhere sets a 'PYTHONANYWHERE_SITE' variable automatically
    is_prod = "PYTHONANYWHERE_SITE" in os.environ
    app.run(debug=not is_prod)
