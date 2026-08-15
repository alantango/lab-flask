from flask import Flask
import datetime as dt

app = Flask(__name__)

@app.route("/")
def hello_world():
    time = dt.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    return "<p>Hello form pythonAnywhere, time is now " + time + ".</p>"

## below only needed if you want to run the app directly:
##   python -m flask --app app run --debug
# if __name__ == "__main__":
#     app.run(debug=True)
