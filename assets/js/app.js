const SEARCH_HISTORY_LENGTH = 5;

$(document).ready(function () {
    var apiKey = '375e44737d8ac3dc37cb3e05e3af1d8c'; // Replace 'YOUR_API_KEY' with your actual API key
    var currentWeatherUrl = 'https://api.openweathermap.org/data/2.5/weather';
    var forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';

    // Function to get current weather data using Fetch API
    async function getCurrentWeather(city) {
        try {
            const response = await fetch(`${currentWeatherUrl}?q=${city}&appid=${apiKey}&units=imperial`);
            if (!response.ok) {
                alert('Failed to fetch weather for ' + city);
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
        const weatherDescription = data.weather[0].main;
        const emoji = getEmojiForDescription(weatherDescription);
        
        const weatherInfo = emoji + ' ' +
        'Current Weather in ' + data.name + ': ' + 
        data.weather[0].description + ', ' +
        'Temperature: ' + data.main.temp + '°F, ' +
        'Humidity: ' + data.main.humidity + '%, ' +
        'Wind Speed: ' + data.wind.speed + 'm/s, ';
        $('#current-weather').text(weatherInfo);
    }

    // Function to display forecast data for 12:00 PM each day
    function displayForecast(data) {
        const forecastList = data.list;

        // Filter the forecast data to include only entries for 12:00 PM
        const filteredForecast = forecastList.filter(function (forecast) {
            return new Date(forecast.dt_txt).getHours() === 12;
        });

        var forecastHtml = '<ul>';
        filteredForecast.forEach(function (forecast) {
            var forecastDate = new Date(forecast.dt * 1000);
            forecastHtml += '<li>' + 
            getEmojiForDescription(forecast.weather[0].main) + ' ' +
            forecastDate.toDateString() + ': ' + 
            forecast.weather[0].description + ', ' +
            'Temperature: ' + forecast.main.temp + '°F, ' +
            'Humidity: ' + forecast.main.humidity + '%, ' +
            'Wind Speed: ' + forecast.wind.speed + 'm/s, ' +
            '</li>';
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

        let previousCities = JSON.parse(localStorage.getItem('cities'));

        if (previousCities == null) {
            previousCities = [];
        }

        if (!previousCities.includes(city)) {
            if (previousCities.length == SEARCH_HISTORY_LENGTH) {
                previousCities.pop();
            }
            previousCities.unshift(city);
            localStorage.setItem('cities', JSON.stringify(previousCities));
            updateSearchHistory();
        }
    });

    $('#previous-entries').on('click', 'a', function() {
        $('#cityInput').val($(this).text());
        $('#city-form').submit();
    })

    function updateSearchHistory() {
        let previousCities = JSON.parse(localStorage.getItem('cities'));

        if (previousCities == null) {
            previousCities = [];
        }

        $('#previous-entries').empty();

        previousCities.forEach((city) => {
            $('#previous-entries').append(`<li><a class=\"previous-entry\">${city}</a></li>`)
        })
    }

    // Default city
    var defaultCity = 'New York';
    getCurrentWeather(defaultCity); // Get current weather for default city
    getForecast(defaultCity); // Get forecast for default city

    updateSearchHistory();
});

function getEmojiForDescription(weatherDescription) {
    switch (weatherDescription) {
        case 'Clear':
            emoji = '🌞';
            break;
        case 'Clouds':
            emoji = '☁️';
            break;
        case 'Rain':
            emoji = '🌧️';
            break;
        case 'Drizzle':
            emoji = '🌧️';
            break;
        case 'Thunderstorm':
            emoji = '⛈️';
            break;
        case 'Snow':
            emoji = '☃️';
            break;
        case 'Mist':
            emoji = '🌫️';
            break;
        case 'Haze':
            emoji = '😶‍🌫️';
            break;
        default:
            emoji = '🔷';
    }
    return emoji;
}

