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

// async function fetchWeather(city) {
//     const apiKey = '1be4254a0d10ee3db39453a87d010519';
//     const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

//     try {
//         const response = await fetch(url);
//         const data = await response.json();
//         console.log(data);

//         const cityElement = document.getElementById('city');
//         const temperatureElement = document.getElementById('temperature');
//         const descriptionElement = document.getElementById('description');

//         cityElement.textContent = data.name;
//         temperatureElement.textContent = `Température : ${data.main.temp}°C`;
//         descriptionElement.textContent = data.weather[0].description;
//     } catch (error) {
//         console.error("Erreur lors de la récupération des données météo", error);
//     }
// }

// fetchWeather("Paris");




async function fetchWeather(city) {
    const apiKey = '1be4254a0d10ee3db39453a87d010519'; // Assurez-vous de sécuriser votre clé API
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data); // Affiche les données météo dans la console pour le debug

        // Mettez à jour le DOM avec les nouvelles données météo
        document.getElementById('city').textContent = data.name;
        document.getElementById('temperature').textContent = `Température : ${data.main.temp}°C`;
        document.getElementById('description').textContent = data.weather[0].description;
    } catch (error) {
        console.error("Erreur lors de la récupération des données météo", error);
        // Affichez un message d'erreur à l'utilisateur
    }
}

fetchWeather("Paris");