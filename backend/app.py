from flask import Flask, jsonify
import requests
import os
from dotenv import load_dotenv

load_dotenv()  # Load API keys from .env file

app = Flask(__name__)

WEATHER_API_KEY = os.getenv("WEATHER_API_KEY")
NEWS_API_KEY = os.getenv("NEWS_API_KEY")

def get_weather():
    url = f"https://api.openweathermap.org/data/2.5/weather?q=Oshawa&appid={WEATHER_API_KEY}&units=metric"
    response = requests.get(url)
    return response.json()

def get_news():
    url = f"https://newsapi.org/v2/everything?q=Oshawa&apiKey={NEWS_API_KEY}"
    response = requests.get(url)
    return response.json()

@app.route("/api/data")
def get_data():
    return jsonify({
        "weather": get_weather(),
        "news": get_news()
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
