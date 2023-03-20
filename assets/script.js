// Define variables for elements in the DOM
const searchInput = document.querySelector('#search-input');
const searchBtn = document.querySelector('#search-btn');
const cityList = document.querySelector('.city-list');
const cityInfo = document.querySelector('.city-info');
const forecast = document.querySelector('.forecast');

console.log("Elements in the DOM:", searchInput, searchBtn, cityList, cityInfo, forecast);

// Retrieve the search history from local storage or initialize it as an empty array
let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];


console.log("Initial search history:", searchHistory);

// Function to save the search history to local storage
function saveSearchHistory() {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}

// Function to get weather data for a given city
function getWeatherData(city) {
    console.log("Getting weather data for", city);
  
    // Add code here to fetch weather data from an API based on the given city
    const apiKey = 'c2dd64bed0d192ca82b608eed6c92a15';
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;
  
    console.log("Current weather URL:", currentWeatherUrl);
    console.log("Forecast URL:", forecastUrl);
  
    // Return a promise that resolves with the weather data
    return Promise.all([fetch(currentWeatherUrl), fetch(forecastUrl)])
      .then(responses => Promise.all(responses.map(response => response.json())))
      .then(([currentWeatherData, forecastData]) => ({ current: currentWeatherData, forecast: forecastData }));
  }

// Function to display the current weather for a given city
function displayCurrentWeather(cityData) {
  console.log("Displaying current weather for", cityData.current.name);

  // Add code here to display the current weather for the given city
  // Extract relevant data from the cityData object
  const city = cityData.current.name;
  const date = new Date(cityData.current.dt * 1000).toLocaleDateString();
  const icon = `https://openweathermap.org/img/w/${cityData.current.weather[0].icon}.png`;
  const temp = `${cityData.current.main.temp.toFixed()}°F`;
  const humidity = `${cityData.current.main.humidity}%`;
  const wind = `${cityData.current.wind.speed.toFixed()} mph`;
  const uvIndex = cityData.forecast.current && cityData.forecast.current.uvi ? cityData.forecast.current.uvi : undefined;

  console.log("Current weather data:", cityData);

  // Create HTML to display the current weather for the given city
  let html = `
    <h2>${city} (${date})<img src="${icon}" alt="${cityData.current.weather[0].description}"></h2>
    <p>Temperature: ${temp}</p>
    <p>Humidity: ${humidity}</p>
    <p>Wind Speed: ${wind}</p>
  `;

  // Check if the UV index is available
  if (typeof uvIndex !== 'undefined') {
    // Add the UV index to the HTML
    html += `<p>UV Index: <span class="uv-index ${getUvIndexClass(uvIndex)}">${uvIndex}</span></p>`;
  }

  // Set the HTML for the city info element to the created HTML
  cityInfo.innerHTML = html;
}

// Function to display the forecast for a given city
function displayForecast(forecastData) {
    console.log("Displaying forecast data:", forecastData);
  
    // Clear the forecast section
    forecast.innerHTML = '';
  
    // Loop through the forecast data and create HTML for each 3-hour period
    for (let i = 0; i < forecastData.list.length; i += 8) {
      // Extract relevant data from the forecast data object
      const forecastDate = new Date(
        forecastData.list[i].dt * 1000
      ).toLocaleDateString();
      const forecastTime = new Date(
        forecastData.list[i].dt * 1000
      ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const forecastIcon = `https://openweathermap.org/img/w/${forecastData.list[i].weather[0].icon}.png`;
      const forecastTemp = `${forecastData.list[i].main.temp.toFixed()}°F`;
      const forecastHumidity = `${forecastData.list[i].main.humidity}%`;
  
      // Create HTML for the forecast data for the current 3-hour period
      const forecastHtml = `
        <div class="forecast-item">
          <p class="forecast-date">${forecastDate}</p>
          <p class="forecast-time">${forecastTime}</p>
          <img src="${forecastIcon}" alt="${forecastData.list[i].weather[0].description}" class="forecast-icon">
          <p class="forecast-temp">${forecastTemp}</p>
          <p class="forecast-humidity">${forecastHumidity}</p>
        </div>
      `;
  
      // Add the HTML for the current 3-hour period to the forecast section
      forecast.innerHTML += forecastHtml;
    }
  }
  

// Add an event listener to the search button
searchBtn.addEventListener('click', function() {
    // Get the value of the search input
    const searchValue = searchInput.value.trim();

    // If the search value is not empty
    if (searchValue !== '') {
        // Add the search value to the search history
        searchHistory.push(searchValue);
        console.log("Updated search history:", searchHistory);

        // Create an li element for the searched city and add it to the city list
        const cityListItem = document.createElement('li');
        cityListItem.textContent = searchValue;
        cityList.appendChild(cityListItem);

        // Clear the search input
        searchInput.value = '';

        // Call the getWeatherData function to fetch weather data for the searched city
        getWeatherData(searchValue)
        .then(cityData => {
            // Call the displayCurrentWeather function to display the current weather for the searched city
            displayCurrentWeather(cityData);

            // Call the displayForecast function to display the forecast for the searched city
            displayForecast(cityData.forecast);
        })
        .catch(error => {
            console.log("Error fetching weather data:", error);
        });
    }
});