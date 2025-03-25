# 🌤 Oshawa Insights – Weather & News Dashboard

This project is a real-time weather and news dashboard for Oshawa, powered by OpenWeatherMap API and NewsAPI. It fetches the current weather data and the latest news articles about Oshawa and displays them in a sleek, responsive dashboard.

## 📑Table of Contents
1. [Project Overview](#project-overview)
2. [Technologies Used](#technologies-used)
3. [Project Structure](#project-structure)
4. [Setup & Installation](#setup--installation)
5. [Backend Development](#backend-development)
6. [Frontend Development](#frontend-development)
7. [Docker Compose & Deployment](#docker-compose--deployment)
8. [Running the Application](#running-the-application)
9. [Contributing](#contributing)

## 📌Project Overview

This project aims to provide real-time insights into Oshawa's weather and news. The backend fetches data from OpenWeatherMap and NewsAPI, while the frontend displays the data in a user-friendly, responsive layout.

## 🛠️Technologies Used

- **Backend**: Python, Flask, Requests, python-dotenv
- **Frontend**: HTML, CSS, JavaScript
- **APIs**: OpenWeatherMap API, NewsAPI
- **Docker**: For containerizing the application
- **Docker Compose**: To manage multi-container deployment

## 📁 Project Structure

```plaintext
oshawa-insights-dashboard/
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   ├── .env
│   ├── Dockerfile
├── frontend/
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   ├── Dockerfile
├── docker-compose.yml
├── README.md
```

## Project Structure

- **backend/**: Contains the Flask API that fetches weather and news data.
- **frontend/**: Contains the HTML, CSS, and JavaScript for the dashboard.
- **docker-compose.yml**: Configuration for Docker Compose to run both backend and frontend services.
- **README.md**: This file.

## 🚀 Setup & Installation

### Prerequisites

1. **Docker**: Make sure Docker and Docker Compose are installed on your machine.
   - [Install Docker](https://docs.docker.com/get-docker/)
   - [Install Docker Compose](https://docs.docker.com/compose/install/)

2. **API Keys**:
   - Register for an API key on [OpenWeatherMap](https://openweathermap.org/api).
   - Register for an API key on [NewsAPI](https://newsapi.org/).

3. **Python 3.9**: Required for the backend development.


## Setup Instructions

### 🔽 1. Clone the Repository
```bash
    git clone https://github.com/yourusername/oshawa-insights-dashboard.git
    cd oshawa-insights-dashboard
```

### 📂Create the `.env` File

Create a `.env` file in the `backend/` directory and add your API keys:

```plaintext
WEATHER_API_KEY=your_openweathermap_api_key
NEWS_API_KEY=your_newsapi_api_key
```

### ⚙️ Install Backend Dependencies

1. Navigate to the `backend/` folder and set up a Python virtual environment:

   ```bash
        python -m venv venv
        source venv/bin/activate  # For macOS/Linux
        venv\Scripts\activate   # For Windows
    ```
### ⚙️ Install the Required Packages

Run the following command to install the necessary Python packages:

```bash
    pip install flask requests python-dotenv
```

### Generate the `requirements.txt` File

To create a `requirements.txt` file with all the installed dependencies, run the following command:

```bash
    pip freeze > requirements.txt
```

### 🐳 Dockerize the Application

#### 🖥️ Backend Dockerfile

Create a `Dockerfile` in the `backend/` directory with the following content:

```dockerfile
    FROM python:3.9
    WORKDIR /app
    COPY requirements.txt .
    RUN pip install -r requirements.txt
    COPY . .
    CMD ["python", "app.py"]
```
#### 🎨 Frontend Dockerfile

Create a `Dockerfile` in the `frontend/` directory with the following content:

```dockerfile
    FROM nginx:alpine
    COPY ./frontend/ /usr/share/nginx/html
```
## 🖥️ Backend Development

### Step 1: Set Up Flask API

Inside the `backend/` folder, create a file named `app.py` to set up the Flask API that fetches weather and news data.

```python
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
```

## 🎨 Frontend Development

### Step 1: Create the Frontend Files

Create the following files in the `frontend/` directory:

1. **`index.html`**: The HTML structure of the dashboard.
2. **`styles.css`**: Styles for the dashboard.
3. **`script.js`**: JavaScript that fetches data from the backend and updates the dashboard.

#### `script.js`

Add the following JavaScript code to `script.js`:

```javascript
    document.addEventListener("DOMContentLoaded", function () {
        DisplayWeather();
        DisplayNews();
    });

    async function DisplayWeather() {
        const apiKey = "24f8178a77ac811fcb4d5f4ee1be4dbc";
        const city = "Oshawa";
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Failed to fetch the weather data");
            }

            const data = await response.json();
            document.getElementById("weather-data").innerHTML = `
                <h3>Weather in ${data.name}</h3>
                <p><strong>Temperature:</strong> ${data.main.temp}°C</p>
                <p><strong>Condition:</strong> ${data.weather[0].description}</p>
            `;
        } catch (error) {
            document.getElementById("weather-data").innerHTML = "<p>Unable to fetch weather data.</p>";
        }
    }

    async function DisplayNews() {
        const apiKey = "c07827fcac194d188c20c65975c2202d";
        const city = "Oshawa";
        const apiUrl = `https://newsapi.org/v2/everything?q=${city}&apiKey=${apiKey}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            const newsContainer = document.getElementById("news-list");
            newsContainer.innerHTML = "";

            if (data.articles.length === 0) {
                newsContainer.innerHTML = "<p>No recent news available for Oshawa.</p>";
                return;
            }

            data.articles.slice(0, 5).forEach((article) => {
                const articleElement = document.createElement("div");
                articleElement.classList.add("news-card");
                articleElement.innerHTML = `
                    <h4><a href="${article.url}" target="_blank">${article.title}</a></h4>
                    <p>${article.description || "No description available."}</p>
                    <small>Published: ${new Date(article.publishedAt).toLocaleDateString()}</small>
                `;
                newsContainer.appendChild(articleElement);
            });
        } catch (error) {
            document.getElementById("news-list").innerHTML = "<p>Unable to load news at this time.</p>";
        }
    }
```
## 🐳 Docker Compose & Deployment

### Step 1: Create `docker-compose.yml`

Create a `docker-compose.yml` file in the root directory of your project with the following content:

```yaml
    version: "3.8"
    services:
    backend:
        build: ./backend
        ports:
        - "5000:5000"
        env_file:
        - ./backend/.env

    frontend:
        build: ./frontend
        ports:
        - "8080:80"
        depends_on:
        - backend
```

### ▶️ Step 2: Run the Application

1. Start the services by running the following command in the root directory of your project:

   ```bash
        docker-compose up --build
    ```

2. ### Access the Application

Once the services are running, you can access the application components at the following URLs:

- **Backend API**:  
  Open your browser or use a tool like `curl` to access the backend API at:  http://localhost:5000/api/data

  
- **Frontend Dashboard**:  
Open your browser to view the frontend dashboard at:  http://localhost:8080/
"# INFT2201-Assignment2" 
