$(document).ready(function () {
    var apiKey = '375e44737d8ac3dc37cb3e05e3af1d8c'; // Replace 'YOUR_API_KEY' with your actual API key
    var currentWeatherUrl = 'https://api.openweathermap.org/data/2.5/weather';
    var forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';

    // Function to get current weather data using Fetch API
    async function getCurrentWeather(city) {
        try {
            const response = await fetch(`${currentWeatherUrl}?q=${city}&appid=${apiKey}&units=imperial`);
            if (!response.ok) {
                throw new Error('Failed to fetch current weather data');
            }
            const data = await response.json();
            displayCurrentWeather(data);
        } catch (error) {
            console.error('Error:', error.message);
        }
    }

    // Function to get forecast data using Fetch API
    async function getForecast(city) {
        try {
            const response = await fetch(`${forecastUrl}?q=${city}&appid=${apiKey}&units=imperial`);
            if (!response.ok) {
                throw new Error('Failed to fetch forecast data');
            }
            const data = await response.json();
            displayForecast(data);
        } catch (error) {
            console.error('Error:', error.message);
        }
    }

    // Function to display current weather data with emojis
    function displayCurrentWeather(data) {
        var weatherDescription = data.weather[0].main;
        var emoji = '';

        // Choose emoji based on weather description
        switch (weatherDescription) {
            case 'Clear':
                emoji = '🌞'; // Sun emoji
                break;
            case 'Clouds':
                emoji = '☁️'; // Cloud emoji
                break;
            case 'Rain':
                emoji = '🌧️'; // Umbrella with rain emoji
                break;
            case 'Drizzle':
                emoji = '🌧️'; // Umbrella with rain emoji
                break;
            case 'Thunderstorm':
                emoji = '⛈️'; // Thunderstorm emoji
                break;
            case 'Snow':
                emoji = '☃️'; // Snowman emoji
                break;
            case 'Mist':
                emoji = '🌫️'; // Fog emoji
                break;
            case 'Haze':
                emoji = '😶‍🌫️'; // Haze emoji
                break;
            default:
                emoji = '🔷'; // Default emoji (Blue diamond)
        }

        var weatherInfo = emoji + ' Current Weather in ' + data.name + ': ' + data.weather[0].description + ', Temperature: ' + data.main.temp + '°F';
        $('#current-weather').text(weatherInfo);
    }

    // Function to display forecast data for 12:00 PM each day
    function displayForecast(data) {
        var forecastList = data.list;

        // Filter the forecast data to include only entries for 12:00 PM
        var filteredForecast = forecastList.filter(function (forecast) {
            return new Date(forecast.dt_txt).getHours() === 12;
        });

        var forecastHtml = '<ul>';
        filteredForecast.forEach(function (forecast) {
            var forecastDate = new Date(forecast.dt * 1000);
            forecastHtml += '<li>' + forecastDate.toDateString() + ': ' + forecast.weather[0].description + ', Temperature: ' + forecast.main.temp + '°F</li>';
        });
        forecastHtml += '</ul>';
        $('#forecast').html(forecastHtml);
    }


    // Handle form submission
    $('#city-form').submit(function (event) {
        event.preventDefault(); // Prevent default form submission
        var city = $('#cityInput').val(); // Get the value from the input field
        getCurrentWeather(city); // Get current weather for the entered city
        getForecast(city); // Get forecast for the entered city
    });

    // Default city
    var defaultCity = 'New York';
    getCurrentWeather(defaultCity); // Get current weather for default city
    getForecast(defaultCity); // Get forecast for default city
});
