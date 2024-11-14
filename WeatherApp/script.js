const forecastEndpoint = "https://api.openweathermap.org/data/2.5/forecast?";
const weatherEndpoint = "https://api.openweathermap.org/data/2.5/weather?";
const geoEndpoing = "http://api.openweathermap.org/geo/1.0/direct?";
const apiKey = "48776cbf671c3bc8f01274dbb3bb6d4f";

let availableKeywords = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Phoenix",
  "Philadelphia",
  "San Antonio",
  "San Diego",
  "Dallas",
  "San Jose",
  "Austin",
  "Jacksonville",
  "Fort Worth",
  "Columbus",
  "San Francisco",
  "Charlotte",
  "Indianapolis",
  "Seattle",
  "Denver",
  "Washington",
  "Boston",
  "El Paso",
  "Nashville",
  "Detroit",
  "Oklahoma City",
  "Portland",
  "Las Vegas",
  "Memphis",
  "Louisville",
  "Baltimore",
  "Milwaukee",
  "Albuquerque",
  "Tucson",
  "Fresno",
  "Sacramento",
  "Kansas City",
  "Long Beach",
  "Mesa",
  "Atlanta",
  "Colorado Springs",
  "Raleigh",
  "Miami",
  "Omaha",
  "Oakland",
  "Minneapolis",
  "Tulsa",
  "Bakersfield",
  "Wichita",
  "Cleveland",
  "Tampa",
  "New Orleans",
  "Honolulu",
  "Anaheim",
  "St. Louis",
  "Riverside",
  "Corpus Christi",
  "Lexington",
  "Henderson",
  "Stockton",
  "Saint Paul",
  "Cincinnati",
  "Pittsburgh",
  "Greensboro",
  "Anchorage",
  "Plano",
  "Lincoln",
  "Fort Wayne",
  "Jersey City",
  "Chula Vista",
  "Buffalo",
  "Madison",
  "Laredo",
  "Gilbert",
  "Norfolk",
  "Chandler",
  "Glendale",
  "Baton Rouge",
  "Hialeah",
  "Garland",
  "Reno",
  "Chesapeake",
  "Irving",
  "Scottsdale",
  "North Las Vegas",
  "Fremont",
  "Boise",
  "Richmond",
  "San Bernardino",
  "Birmingham",
  "Spokane",
  "Boulder",
  "Des Moines",
  "Montgomery",
  "Amarillo",
  "Akron",
  "Shreveport",
  "Tacoma",
  "Evansville",
  "Grand Rapids",
  "Augusta",
  "Mobile",
  "Huntsville",
  "Macon",
  "Hickory",
  "Elgin",
];
let latestResult = [];

const inputBox = document.getElementById("input-box");
const resultBox = document.getElementById("result-box");
const searchButton = document.getElementById("search-button");
const gridContainer = document.getElementById("grid-container");

inputBox.onkeyup = function () {
  let result = [];
  let input = inputBox.value.trim().toLowerCase();

  if (input.length) {
    result = availableKeywords.filter((keyword) => {
      return keyword.toLowerCase().includes(input);
    });
  }

  latestResult = result;
  display(result);

  if (!result.length) {
    resultBox.innerHTML = "";
  }
};

function display(result) {
  const content = result.map((list) => {
    return "<li onclick=selectInput(this)>" + list + "</li>";
  });

  resultBox.innerHTML = "<ul>" + content.join("") + "</ul>";
}

function selectInput(list) {
  inputBox.value = list.textContent;
  resultBox.innerHTML = "";
}

inputBox.addEventListener("focus", function () {
  if (latestResult.length) {
    display(latestResult);
  }
});

inputBox.addEventListener("blur", function () {
  setTimeout(function () {
    resultBox.innerHTML = "";
  }, 200);
});

if (window.location.pathname.includes("weather.html")) {
  searchButton.addEventListener("click", () => {
    const query = inputBox.value.trim();
    if (query) {
      fetchCurrentWeather(query);
    }
  });
}

if (window.location.pathname.includes("forecast.html")) {
  searchButton.addEventListener("click", () => {
    const query = inputBox.value.trim();
    if (query) {
      fetchForecast(query);
    }
  });
}

async function createForecastCard(forecast) {
  const gridContainer = document.getElementById("grid-container");

  forecast.list.forEach((forecastItem) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const date = new Date(forecastItem.dt * 1000);
    const title = document.createElement("h2");
    title.textContent = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    card.appendChild(title);

    const condition = document.createElement("p");
    condition.textContent = `Condition: ${forecastItem.weather[0].description}`;
    card.appendChild(condition);

    const tempHighLow = document.createElement("p");
    const tempMinCelsius = (forecastItem.main.temp_min - 273.15).toFixed(1);
    const tempMaxCelsius = (forecastItem.main.temp_max - 273.15).toFixed(1);
    tempHighLow.textContent = `High: ${tempMaxCelsius}°C, Low: ${tempMinCelsius}°C`;
    card.appendChild(tempHighLow);

    const feelsLike = document.createElement("p");
    const feelsLikeCelsius = (forecastItem.main.feels_like - 273.15).toFixed(1);
    feelsLike.textContent = `Feels like: ${feelsLikeCelsius}°C`;
    card.appendChild(feelsLike);

    const humidity = document.createElement("p");
    humidity.textContent = `Humidity: ${forecastItem.main.humidity}%`;
    card.appendChild(humidity);

    const windSpeed = document.createElement("p");
    windSpeed.textContent = `Wind speed: ${forecastItem.wind.speed} m/s`;
    card.appendChild(windSpeed);

    gridContainer.appendChild(card);
  });
}

async function createWeatherCard(weather) {
  const card = document.createElement("div");
  card.classList.add("card");

  const title = document.createElement("h2");
  title.textContent = weather.name;
  card.appendChild(title);

  const condition = document.createElement("p");
  condition.textContent = `Condition: ${weather.weather[0].description}`;
  card.appendChild(condition);

  const temp = document.createElement("p");
  const temperatureCelsius = (weather.main.temp - 273.15).toFixed(1);
  temp.textContent = `Temperature: ${temperatureCelsius}°C`;
  card.appendChild(temp);

  const feelsLike = document.createElement("p");
  const feelsLikeCelsius = (weather.main.feels_like - 273.15).toFixed(1);
  feelsLike.textContent = `Feels like: ${feelsLikeCelsius}°C`;
  card.appendChild(feelsLike);

  const humidity = document.createElement("p");
  humidity.textContent = `Humidity: ${weather.main.humidity}%`;
  card.appendChild(humidity);

  const windSpeed = document.createElement("p");
  windSpeed.textContent = `Wind speed: ${weather.wind.speed} m/s`;
  card.appendChild(windSpeed);

  const gridContainer = document.getElementById("grid-container");
  gridContainer.appendChild(card);
}

async function fetchForecast(cityName) {
  gridContainer.innerHTML = "";

  try {
    const location = await fetchLocation(cityName);

    let lat = location.lat;
    let lon = location.lon;

    const forecastRespone = await fetch(
      `${forecastEndpoint}appid=${apiKey}&lat=${lat}&lon=${lon}`
    );

    if (!forecastRespone.ok) {
      throw new Error(`HTTP error! Status: ${forecastRespone.status}`);
    }

    const data = await forecastRespone.json();

    createForecastCard(data);
  } catch (error) {
    console.error("Error fetching forecast:", error);
    const errorMessage = document.createElement("p");
    errorMessage.textContent =
      "Failed to fetch forecast. Please try again later.";
    gridContainer.appendChild(errorMessage);
  }
}

async function fetchCurrentWeather(cityName) {
  try {
    const location = await fetchLocation(cityName);

    let lat = location.lat;
    let lon = location.lon;

    const weatherResponse = await fetch(
      `${weatherEndpoint}appid=${apiKey}&lat=${lat}&lon=${lon}`
    );

    if (!weatherResponse.ok) {
      throw new Error(`HTTP error! Status: ${weatherResponse.status}`);
    }

    const data = await weatherResponse.json();

    createWeatherCard(data);
  } catch (error) {
    console.error("Error fetching weather:", error);
    const errorMessage = document.createElement("p");
    errorMessage.textContent =
      "Failed to fetch weather. Please try again later.";
    gridContainer.appendChild(errorMessage);
  }
}

async function fetchLocation(cityName) {
  try {
    const geocodingResponse = await fetch(
      `${geoEndpoing}q=${cityName}&appid=${apiKey}`
    );

    if (!geocodingResponse.ok) {
      throw new Error(`HTTP error! Status: ${geocodingResponse.status}`);
    }

    const geocoding = await geocodingResponse.json();
    const geoData = geocoding[0];

    let lat = geoData.lat;
    let lon = geoData.lon;

    return { lat, lon };
  } catch (error) {
    console.error("Error fetching location details:", error);
  }
}
