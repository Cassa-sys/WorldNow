// Fetch weather using a city name
async function fetchWeather(city) {
  console.log("Fetching weather for city:", city);
  try {
    const response = await fetch(`/.netlify/functions/weather-api?city=${city}`);
    if (!response.ok) {
      throw new Error("Failed to fetch weather");
    }

    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    console.error("Error fetching weather:", error);
    alert("Something went wrong while fetching the weather.");
  }
}

// Optional: Fetch weather using coordinates
async function fetchWeatherByCoords(lat, lon) {
  console.log("Fetching weather for coords:", lat, lon);
  try {
    const response = await fetch(`/.netlify/functions/weather-api?lat=${lat}&lon=${lon}`);
    if (!response.ok) {
      throw new Error("Failed to fetch weather");
    }

    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    console.error("Error fetching weather by coords:", error);
    alert("Something went wrong while fetching the weather.");
  }
}

// Detect user location and fetch weather
function detectLocationAndFetchWeather() {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      fetchWeatherByCoords(lat, lon);
    },
    (error) => {
      console.error("Geolocation error:", error);
      alert("Unable to get your location. Please allow location access.");
    }
  );
}

// Display weather data in the DOM
function displayWeather(data) {
  const weatherContainer = document.getElementById("weatherContainer");
  weatherContainer.innerHTML = ''; // Clear previous content

  const location = document.createElement('h2');
  location.textContent = `Weather in ${data.location.name}, ${data.location.region}`;

  const localTime = document.createElement('p');
  localTime.textContent = `Local Time: ${data.location.localtime}`;

  const icon = document.createElement('img');
  icon.src = `https:${data.current.condition.icon}`;
  icon.alt = data.current.condition.text;

  const condition = document.createElement('p');
  condition.textContent = `Condition: ${data.current.condition.text}`;

  const temp = document.createElement('p');
  temp.textContent = `Temperature: ${data.current.temp_c}°C (${data.current.temp_f}°F)`;

  const feelsLike = document.createElement('p');
  feelsLike.textContent = `Feels Like: ${data.current.feelslike_c}°C (${data.current.feelslike_f}°F)`;

  const humidity = document.createElement('p');
  humidity.textContent = `Humidity: ${data.current.humidity}%`;

  const wind = document.createElement('p');
  wind.textContent = `Wind: ${data.current.wind_kph} km/h from ${data.current.wind_dir}`;

  weatherContainer.appendChild(location);
  weatherContainer.appendChild(localTime);
  weatherContainer.appendChild(icon);
  weatherContainer.appendChild(condition);
  weatherContainer.appendChild(temp);
  weatherContainer.appendChild(feelsLike);
  weatherContainer.appendChild(humidity);
  weatherContainer.appendChild(wind);
}
