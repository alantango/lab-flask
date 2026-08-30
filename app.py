from flask import Flask
import datetime as dt
import os

app = Flask(__name__)

@app.route("/")
def hello_world():
    time = dt.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    return "<p>Hello form pythonAnywhere, time is now " + time + ".</p>"

if __name__ == "__main__":
    # Only runs debug mode locally; PythonAnywhere sets a 'PYTHONANYWHERE_SITE' variable automatically
    is_prod = "PYTHONANYWHERE_SITE" in os.environ
    app.run(debug=not is_prod)
