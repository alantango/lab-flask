from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

## below only needed if you want to run the app directly:
##   python -m flask --app app run --debug
# if __name__ == "__main__":
#     app.run(debug=True)
