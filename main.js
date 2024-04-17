const weatherConditionsFrench = {
    'clear sky': 'Ciel dégagé',
    'few clouds': 'Peu nuageux',
    'scattered clouds': 'Nuageux',
    'broken clouds': 'Nuageux',
    'shower rain': 'Averses',
    'rain': 'Pluie',
    'thunderstorm': 'Orage',
    'snow': 'Neige',
    'mist': 'Brouillard',
    'overcast clouds': 'Très nuageux'
};

document.addEventListener('DOMContentLoaded', function () {
    function createWeatherElement(data) {
        const weatherContainer = document.createElement('div');
        weatherContainer.classList.add('city-weather');

        const cityTitle = document.createElement('h2');
        cityTitle.textContent = data.name;

        const temperatureP = document.createElement('p');
        temperatureP.textContent = `Température : ${data.main.temp}°C (ressentie : ${data.main.feels_like}°C)`;

        const descriptionP = document.createElement('p');
        const descriptionText = data.weather[0].description.toLowerCase();
        descriptionP.textContent = weatherConditionsFrench[descriptionText] || data.weather[0].description;

        const detailsContainer = document.createElement('div');
        detailsContainer.innerHTML = `
            <p>Min: ${data.main.temp_min}°C, Max: ${data.main.temp_max}°C</p>
            <p>Vent : ${data.wind.speed} m/s, direction : ${data.wind.deg}°</p>
            <p>Humidité : ${data.main.humidity}%</p>
            <p>Pression : ${data.main.pressure} hPa</p>
            <p>Visibilité : ${data.visibility / 1000} km</p>
        `;

        weatherContainer.appendChild(cityTitle);
        weatherContainer.appendChild(temperatureP);
        weatherContainer.appendChild(descriptionP);
        weatherContainer.appendChild(detailsContainer);

        return weatherContainer;
    }

    async function fetchWeather(city) {
        const apiKey = '1be4254a0d10ee3db39453a87d010519';
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=fr`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            const weatherElement = createWeatherElement(data);
            document.getElementById('weather-container').appendChild(weatherElement);
        } catch (error) {
            console.error(`Erreur lors de la récupération des données météo pour ${city}`, error);
        }
    }

    const fetchWeatherButton = document.getElementById('fetch-weather-btn');
    const cityInput = document.getElementById('city-input');

    fetchWeatherButton.addEventListener('click', function() {
        const city = cityInput.value.trim();
        if (city) {
            fetchWeather(city);
            cityInput.value = ''; 
        } else {
            alert('Veuillez entrer un nom de ville.');
        }
    });

    // const cities = ["Mauron", "Guilligomarc'h", "Rennes", "Cherbourg-en-Cotentin", "Hennebont", "Guidel"];
    // cities.forEach(city => fetchWeather(city));
});
