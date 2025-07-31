const apiKey = '' // weather api key must be added

document.getElementById('cityInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        document.getElementById('searchBtn').click();
    }
});
document.getElementById('searchBtn').addEventListener('click', () => {
    const city = document.getElementById('cityInput').value.trim();
    if(city === ''){
        alert("Please enter a city name");
        return;
    }

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(response => {
        if(!response.ok) {
            throw new Error("City not found!"); 
        }

        return response.json();
    })
    .then(data => {
        console.log(data);
        showWeather(data);
    })
    .catch(error => {
        document.getElementById('weatherResult').innerHTML = `<p>${error.message}</p>`;
    });
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
    .then(response => {
        if(!response.ok) {
            throw new Error("Forecast not found!")
        }
        return response.json();
    })
    .then(data => {
        showForecast(data);
    })
    .catch(error => {
        const forecastDiv = document.getElementById('forecastResult');
        forecastDiv.innerHTML = `<p>${error.message}</p>`;
    })
});

function showWeather(data){
    const resultDiv = document.getElementById('weatherResult');
    const temperature = Math.round(data.main.temp * 10)/10;
    const weather = data.weather[0].main;
    const description = data.weather[0].description;
    const clouds = data.clouds.all;
    const icon = data.weather[0].icon;
    const city = data.name;

    resultDiv.innerHTML = `
    <h2>${city}</h2>
    <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${weather}" />
    <p>Weather: ${weather}</p>
    <p>Description: ${description}</p>
    <p>Clouds: ${clouds}%</p>
    <p>${temperature}°C</p>
  `;

  const body = document.body;
let backgroundImage = '';

switch (weather.toLowerCase()) {
  case 'clear':
    backgroundImage = 'images/clear.jpg';
    break;
  case 'clouds':
    backgroundImage = 'images/cloudy.jpg';
    break;
  case 'rain':
    backgroundImage = 'images/rainy.jpg';
    break;
  case 'snow':
    backgroundImage = 'images/snowy.jpg';
    break;
  case 'thunderstorm':
    backgroundImage = 'images/thunderstorm.jpg';
    break;
  case 'mist':
  case 'fog':
    backgroundImage = 'images/foggy.jpg';
    break;
  default:
    backgroundImage = 'images/default.jpg';
}

body.style.backgroundImage = `url('${backgroundImage}')`;
}

function showForecast(data){
    const forecastDiv = document.getElementById('forecastResult');
    forecastDiv.innerHTML = '<h3>5-Day-Forecast</h3>';
    const dailyForecasts = data.list.filter(item => item.dt_txt.includes("12:00:00"));
    dailyForecasts.forEach(item => {
        const date = item.dt_txt.split(' ')[0];
        const temp = Math.round(item.main.temp * 10)/ 10;
        const description = item.weather[0].description;
        const icon = item.weather[0].icon;

        const forecastCard = `
            <div class="forecast-card">
                <h4>${date}</h4>
                <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" />
                <p>${temp}°C</p>
                <p>${description}</p>
            </div>
        `;
        forecastDiv.innerHTML += forecastCard;
    }); 
}
