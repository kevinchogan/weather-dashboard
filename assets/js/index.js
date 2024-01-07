var apiKey = "d3a388cc2e0c9271a4d6036eef79b90b";
var cityName = "Redwood+City";

function updateCurrent(data) {
    console.log(data);
}

function updateForecast(data) {
    console.log(data);
}

function getForecastApi(data) {
  updateCurrent(data);
  var long = data.coord.lon;
  var lat = data.coord.lat;
  var forecastApi = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${apiKey}`;
  fetch(forecastApi)
    .then(function (response) {
      return response.json();
    })
    .then(updateForecast);
}

function getApi() {
  var currentApi = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;

  fetch(currentApi)
    .then(function (response) {
      return response.json();
    })
    .then(getForecastApi);
}

getApi();
