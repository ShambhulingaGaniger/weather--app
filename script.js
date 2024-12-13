const API_KEY_WEATHER = 'f4a97f23b8c470e871cc918f035df5d5';  // Replace with your OpenWeatherMap API Key
const API_KEY_AQI = '386e892531777226441e537dea624d6803394f63'; // Replace with your AQI API Key

async function getWeather() {
    const city = document.getElementById("cityInput").value;
    if (city === "") {
        alert("Please enter a city name.");
        return;
    }

    try {
        // Fetch coordinates (latitude and longitude) from OpenWeatherMap API based on city name
        const coordinatesResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY_WEATHER}`);
        const coordinatesData = coordinatesResponse.data;

        if (coordinatesData.cod === "404") {
            alert("City not found!");
            return;
        }

        const lat = coordinatesData.coord.lat;
        const lon = coordinatesData.coord.lon;

        console.log(`Latitude: ${lat}, Longitude: ${lon}`);  // Log latitude and longitude for debugging

        // Fetch weather data using the obtained latitude and longitude
        const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY_WEATHER}&units=metric`);
        const weatherData = weatherResponse.data;

        const temperature = weatherData.main.temp;
        const humidity = weatherData.main.humidity;

        // Update weather details on the page
        document.getElementById("temperature").textContent = `Temperature: ${temperature}°C`;
        document.getElementById("humidity").textContent = `Humidity: ${humidity}%`;

        // Fetch air quality data from WAQI API using latitude and longitude
        const aqiResponse = await axios.get(`https://api.waqi.info/feed/geo:${lat};${lon}/?token=${API_KEY_AQI}`);
        const aqiData = aqiResponse.data;

        if (aqiData.status !== "ok") {
            alert("Unable to fetch air quality data.");
            return;
        }

        const aqi = aqiData.data.aqi;
        const carbon = aqiData.data.iaqi.co ? aqiData.data.iaqi.co.v : "N/A";
        const nitrogen = aqiData.data.iaqi.no2 ? aqiData.data.iaqi.no2.v : "N/A";

        // Update air quality details on the page
        document.getElementById("aqi").textContent = `AQI: ${aqi}`;
        document.getElementById("carbon").textContent = `Carbon Monoxide (CO): ${carbon}`;
        document.getElementById("nitrogen").textContent = `Nitrogen Dioxide (NO2): ${nitrogen}`;

    } catch (error) {
        console.error("Error:", error);  // Log the error for debugging
        alert("An error occurred while fetching data.");
    }
}
