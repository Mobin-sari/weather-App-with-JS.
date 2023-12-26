import { showModal, removeModal } from "./util/modal.js";

const BASIC_URL = 
"https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline";
const KEYAPI = "3N34FDF7QLXSHRKZF3UBGTZL7&content";

const DAYS = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

const searchButton = document.querySelector("button");
const searchInput = document.querySelector("input");
const weatherContainer = document.getElementById("weather")
const forecastContainer = document.getElementById("forecast")
const locationIcon = document.getElementById("location")
const modalButton = document.getElementById("modal-button")

const getCurrentWeatherByName = async (city) => {
    const response = await axios.get(`${BASIC_URL}/${city}?unitGroup=metric&key=${KEYAPI}&contentType=json`)
    return response;
};

const renderCurrentWeather = (data) => {
    const weatherJSX = `
        <h1>${data.data.resolvedAddress}</h1>
        <div id="main">
            <span>${data.data.currentConditions.conditions}°</span>
            <p>${data.data.currentConditions.temp}°</p>
        </div>
        <div id="info">
            <p>Humidity: <span>${data.data.currentConditions.humidity}</span></p>
            <p>Wind Speed: <span>${data.data.currentConditions.windspeed}</span></p>
        </div>

    `;
    weatherContainer.innerHTML = weatherJSX;
}

const getWeekDay = (date) => {
    return DAYS[new Date(date * 1000).getDay()];
}

const renderForecastData = (data) => {
    forecastContainer.innerHTML = ""
    data = data.data.days
    console.log(data)
    data.forEach(i => {
        const forecastJsx = `
            <div>
                <h3>${i.temp} °C</h3>
                <h3>${getWeekDay(i.datetimeEpoch)}</h3>
                <p>${i.humidity}</p>
                <span>${i.windspeed}</span>
            </div>
        `;
        forecastContainer.innerHTML += forecastJsx;
    });
}

const searchHandler = async () => {
    const cityName = searchInput.value;
    if (!cityName) {
        showModal("pleas Enter a city name!")
    };

    const currentData = await getCurrentWeatherByName(cityName);
    renderCurrentWeather(currentData);
    renderForecastData(currentData);
}

const positionCallback = (position) => {
    console.log(position)
}

const errorCallback = (error) => {
    console.log(error)
}
const locationHandler = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(positionCallback, errorCallback);
    } else {
        showModal("your browser does not support geolocation")
    }

}

modalButton.addEventListener("click", removeModal);
searchButton.addEventListener("click", searchHandler);
locationIcon.addEventListener("click", locationHandler)