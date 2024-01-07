var apiKey = 'd3a388cc2e0c9271a4d6036eef79b90b';
var cityName = 'Redwood City';
var cityProperty = cityName.replace(' ', '+');

function updateCurrent(currentData) {
    var curDate = moment().format('M/D/YYYY');
    var curTemp = Math.round(currentData.main.temp);
    var curWind = Math.round(currentData.wind.speed);
    var curHumidity = currentData.main.humidity;
    var iconUrl = 'https://openweathermap.org/img/wn/';
    var icon = currentData.weather[0].icon;
    
    console.log(currentData);

    curCityEl = $('#current-city-name');
    curCityEl.text(`${cityName} (${curDate})`);
    
    imageEl = $('<img>');
    iconUrl += `${icon}@2x.png`
    imageEl.attr('src', iconUrl);

    curCityEl.append(imageEl);
    $('#current-temp').text(`Temp: ${curTemp}°`)
    $('#current-wind').text(`Wind: ${curWind} mph`)
    $('#current-humidity').text(`Humidity: ${curHumidity}%`)
}

function updateForecast(forecastData) {
    console.log(forecastData);
}

function getForecastApi(currentData) {
  updateCurrent(currentData);
  var long = currentData.coord.lon;
  var lat = currentData.coord.lat;
  var forecastApi = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&units=imperial&appid=${apiKey}`;
  fetch(forecastApi)
    .then(function (response) {
      return response.json();
    })
    .then(updateForecast);
}

function getApi() {
  var currentApi = `http://api.openweathermap.org/data/2.5/weather?q=${cityProperty}&units=imperial&appid=${apiKey}`;

  fetch(currentApi)
    .then(function (response) {
      return response.json();
    })
    .then(getForecastApi);
}

getApi();
