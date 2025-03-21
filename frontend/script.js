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
        console.log("[DEBUG] Weather data:", data);

        document.getElementById("weather-data").innerHTML = `
            <h3>Weather in ${data.name}</h3>
            <p><strong>Temperature:</strong> ${data.main.temp}°C</p>
            <p><strong>Condition:</strong> ${data.weather[0].description}</p>
        `;

    } catch (error) {
        console.error("[ERROR] Failed to fetch weather data:", error);
        document.getElementById("weather-data").innerHTML = "<p>Unable to fetch weather data.</p>";
    }
}

async function DisplayNews() {
    console.log("[INFO] Fetching news articles for Oshawa...");

    const apiKey = "c07827fcac194d188c20c65975c2202d";
    const city = "Oshawa";
    const apiUrl = `https://newsapi.org/v2/everything?q=${city}&apiKey=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("[DEBUG] Fetched news data:", data);

        const newsContainer = document.getElementById("news-list");
        newsContainer.innerHTML = ""; // Clear existing news

        if (data.articles.length === 0) {
            newsContainer.innerHTML = "<p>No recent news available for Oshawa.</p>";
            return;
        }

        // Display up to 5 news articles in dashboard format
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
        console.error("[ERROR] Failed to fetch news data:", error);
        document.getElementById("news-list").innerHTML = "<p>Unable to load news at this time.</p>";
    }
}
