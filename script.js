const apiKey = "d81ef936c3aa0811573f8cf080d94331";
let currentUnit = "metric";
let currentCity = "";

function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) {
    document.getElementById("weatherResult").innerHTML = "Please enter a city name.";
    return;
  }
  currentCity = city;
  getWeatherByCity(city);
}

function getWeatherByCity(city) {
  const url = https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${currentUnit};
  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error("City not found");
      return res.json();
    })
    .then(data => displayWeather(data))
    .catch(err => {
      document.getElementById("weatherResult").innerHTML = Error: ${err.message};
    });
}

function getWeatherByCoords(lat, lon) {
  const url = https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${currentUnit};
  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error("Unable to fetch location weather");
      return res.json();
    })
    .then(data => {
      currentCity = data.name;
      displayWeather(data);
    })
    .catch(err => {
      document.getElementById("weatherResult").innerHTML = Error: ${err.message};
    });
}

function displayWeather(data) {
  const icon = data.weather[0].icon;
  const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
  const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();
  const unitSymbol = currentUnit === "metric" ? "°C" : "°F";

  document.getElementById("weatherResult").innerHTML = `
    <h3>${data.name}, ${data.sys.country}</h3>
    <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${data.weather[0].description}">
    <p>🌡 Temp: ${data.main.temp}${unitSymbol}</p>
    <p>🤒 Feels Like: ${data.main.feels_like}${unitSymbol}</p>
    <p>💧 Humidity: ${data.main.humidity}%</p>
    <p>☁ Weather: ${data.weather[0].description}</p>
    <p>💨 Wind: ${data.wind.speed} m/s</p>
    <p>🌅 Sunrise: ${sunrise}</p>
    <p>🌇 Sunset: ${sunset}</p>
  `;
  document.getElementById("cityInput").value = "";
}

function useMyLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        getWeatherByCoords(latitude, longitude);
      },
      () => {
        document.getElementById("weatherResult").innerHTML = "Location access denied.";
      }
    );
  } else {
    document.getElementById("weatherResult").innerHTML = "Geolocation not supported.";
  }
}

function toggleUnit() {
  currentUnit = currentUnit === "metric" ? "imperial" : "metric";
  const unitText = currentUnit === "metric" ? "Switch to °F" : "Switch to °C";
  document.querySelector('button[onclick="toggleUnit()"]').innerText = unitText;
  if (currentCity) getWeatherByCity(currentCity);
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

document.getElementById("cityInput").addEventListener("keyup", function (event) {
  if (event.key === "Enter") getWeather();
});
