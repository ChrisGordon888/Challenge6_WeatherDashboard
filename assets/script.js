
// Define variables for elements in the DOM
const searchInput = document.querySelector('#search-input');
const searchBtn = document.querySelector('#search-btn');
const cityList = document.querySelector('.city-list');
const cityInfo = document.querySelector('.city-info');
const forecast = document.querySelector('.forecast');

console.log("Elements in the DOM:", searchInput, searchBtn, cityList, cityInfo, forecast);

// Define an array to store the search history
let searchHistory = [];

console.log("Initial search history:", searchHistory);

// Function to get weather data for a given city
function getWeatherData(city) {
  console.log("Getting weather data for", city);

  // Add code here to fetch weather data from an API based on the given city
  const apiKey = '<YOUR_API_KEY_HERE>';
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

  console.log("API URL:", apiUrl);

  // Return a promise that resolves with the weather data
  return fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const lat = data.coord.lat;
      const lon = data.coord.lon;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${apiKey}&units=imperial`;

      console.log("Forecast URL:", forecastUrl);

      return fetch(forecastUrl)
        .then(response => response.json())
        .then(forecastData => ({ current: data, forecast: forecastData }));
    });
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
   const uvIndex = cityData.forecast.current.uvi;

   console.log("Current weather data:", cityData);

   // Create HTML to display the current weather for the given city
  const html = `
  <h2>${city} (${date})<img src="${icon}" alt="${cityData.current.weather[0].description}"></h2>
  <p>Temperature: ${temp}</p>
  <p>Humidity: ${humidity}</p>
  <p>Wind Speed: ${wind}</p>
  <p>UV Index: <span class="uv-index ${getUvIndexClass(uvIndex)}">${uvIndex}</span></p>
`;

// Set the HTML for the city info element to the created HTML
cityInfo.innerHTML = html;
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
        })
        .catch(error => {
          console.log("Error fetching weather data:", error);
        });
    }
  });
