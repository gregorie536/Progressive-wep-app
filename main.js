document.addEventListener('DOMContentLoaded', function () {
    const quill = new Quill('#editor', {
        theme: 'snow'
    });

    const chooseFileButton = document.querySelector('#choosefile');
    const saveFileButton = document.querySelector('#savefile');

    async function getFile() {
        const [fileHandle] = await window.showOpenFilePicker({
            multiple: false,
            types: [{
                description: 'Text files',
                accept: {
                    'text/*': ['.txt', '.html'],
                },
            }],
        });

        const file = await fileHandle.getFile();
        const writeFile = await fileHandle.createWritable();
        return file;
    }

    let handle = {};

    chooseFileButton.addEventListener('click', async () => {
        handle = await getFile();
        quill.setText(await handle.text());
        console.log(handle);
    });

    saveFileButton.addEventListener('click', async () => {
        const content = quill.getText();
        await handle.writableStream.write(content);
        await handle.writableStream.close();
        quill.setText('');
    });
});
/////////////////////////////////////////////////////////////////
//////////////////////// Météo //////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////

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
    'overcast clouds': 'Nuageux'
};

document.addEventListener('DOMContentLoaded', function () {
    function createWeatherElement(city, temperature, description) {
        const weatherContainer = document.createElement('div');
        weatherContainer.classList.add('city-weather');

        const cityTitle = document.createElement('h2');
        cityTitle.textContent = city;

        const temperatureP = document.createElement('p');
        temperatureP.textContent = `Température : ${temperature}°C`;

        const descriptionP = document.createElement('p');
        const descriptionInFrench = weatherConditionsFrench[description.toLowerCase()] || description;
        descriptionP.textContent = descriptionInFrench;

        weatherContainer.appendChild(cityTitle);
        weatherContainer.appendChild(temperatureP);
        weatherContainer.appendChild(descriptionP);

        return weatherContainer;
    }

    async function fetchWeather(city) {
        const apiKey = '1be4254a0d10ee3db39453a87d010519';
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            const weatherElement = createWeatherElement(
                city,
                data.main.temp,
                weatherConditionsFrench[data.weather[0].description.toLowerCase()] || data.weather[0].description
            );
            document.body.appendChild(weatherElement);
        } catch (error) {
            console.error(`Erreur lors de la récupération des données météo pour ${city}`, error);
        }
    }

    fetchWeather("Mauron");
    fetchWeather("Guilligomarc'h");
    fetchWeather("Rennes");
    fetchWeather("Cherbourg-en-Cotentin");
    fetchWeather("Hennebont");
    fetchWeather("Guidel");
});