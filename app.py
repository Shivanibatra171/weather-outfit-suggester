from flask import Flask, jsonify, request
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

API_KEY = "2964fd9b9dbb65ea0af87ee613452886"

def get_outfit(temp, condition):
    condition = condition.lower()
    if "rain" in condition:
        return "☔ Carry an umbrella and wear a jacket!"
    elif "haze" in condition or "smoke" in condition:
        return "😷 Wear a mask, air quality is poor"
    elif temp > 35:
        return "😎 Wear light clothes and grab sunglasses"
    elif temp > 25:
        return "👕 Normal clothes are fine today"
    elif temp > 15:
        return "🧥 Take a light jacket with you"
    else:
        return "🧣 Bundle up — sweater and scarf recommended!"

@app.route('/weather')
def get_weather():
    city = request.args.get('city')
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"
    response = requests.get(url)
    data = response.json()
    temp = data['main']['temp']
    condition = data['weather'][0]['main']
    data['outfit_suggestion'] = get_outfit(temp, condition)
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)