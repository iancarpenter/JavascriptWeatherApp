const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");

// App Data
const weather = {};

weather.temperature = {
    unit: "celsius"
}

const KELVIN = 273;
const key = "<<Enter the openweathermap api key here>>";

// check if browser supports Geolocation
if('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Browser doesn't support geolocation</p>";
}

// set users position
function setPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    getWeather(latitude, longitude);
}

// shown when there is a problem with geolocation service
function showError(error) {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

// Get Weather from API
function getWeather(latitude, longitude) {
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;

    fetch(api) 
       .then(function(response){
           let data = response.json();
           return data
       })
       .then(function(data){
           weather.temperature.value = Math.floor(data.main.temp - KELVIN);
           weather.description = data.weather[0].description;
           weather.iconID = data.weather[0].icon;
           weather.city = data.name;
           weather.country = data.sys.country;
       })
       .then(function(){
           displayWeather();
       });
}

// display weather to the ui
function displayWeather() {
    iconElement.innerHTML = `<img src="icons/${weather.iconID}.png"/>`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`; 
}

// C to F conversion
function celsiusToFahrenheit(temperature) {
    return (temperature * 9/5) + 32;
}

// When the user clicks on the temperature element
tempElement.addEventListener("click", function(){
    if(weather.temperature.value === undefined) {
        return;
    }
    if(weather.temperature.unit == "celsius") {
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);

        tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
        weather.temperature.unit = "fahrenheit";
    } else {
        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        weather.temperature.unit = "celsius"
    }
});