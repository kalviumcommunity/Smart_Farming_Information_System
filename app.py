from flask import Flask, render_template, request, jsonify
from utils.data_loader import load_data
from utils.recommendation import recommend_crops
from utils.analysis import get_trends

app = Flask(__name__)

df, market_df = load_data()


@app.route("/")
def home():
    return render_template("home.html")

@app.route("/login")
def login():
    return render_template("login.html")

@app.route("/signup")
def signup():
    return render_template("signup.html")

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")


@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.json

    temp = float(data["temp"])
    rain = float(data["rain"])
    soil = data["soil"].lower()
    place = data.get("place", "").lower().strip()

    if rain == 0:
        rain = 100

    results = recommend_crops(df, market_df, temp, rain, soil, place)

    trends = {}
    if results:
        trends = get_trends(df, results[0]["crop"])

    return jsonify({
        "recommendation": results[:3],
        "trends": trends
    })


if __name__ == "__main__":
    app.run(debug=True)