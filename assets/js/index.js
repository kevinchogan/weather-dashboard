var apiKey = "d3a388cc2e0c9271a4d6036eef79b90b";
var searchButton = $("#city-name-btn");

function updateCurrent(currentData) {
  var curDate = moment().format("M/D/YYYY");
  var curTemp = Math.round(currentData.main.temp);
  var curWind = Math.round(currentData.wind.speed);
  var curHumidity = currentData.main.humidity;
  var cityName = currentData.name;
  var iconUrl = "https://openweathermap.org/img/wn/";
  var icon = currentData.weather[0].icon;

  console.log(currentData);

  curCityEl = $("#current-city-name");
  curCityEl.text(`${cityName} (${curDate})`);

  imageEl = $("<img>");
  iconUrl += `${icon}@2x.png`;
  imageEl.attr("src", iconUrl);

  curCityEl.append(imageEl);
  $("#current-temp").text(`Temp: ${curTemp}°`);
  $("#current-wind").text(`Wind: ${curWind} mph`);
  $("#current-humidity").text(`Humidity: ${curHumidity}%`);
}

function ifLess(oldVal, newVal) {
  oldVal = Math.round(oldVal);
  newVal = Math.round(newVal);
  if (!oldVal) {
    return newVal;
  } else if (newVal < oldVal) {
    return newVal;
  } else {
    return oldVal;
  }
}

function ifMore(oldVal, newVal) {
  oldVal = Math.round(oldVal);
  newVal = Math.round(newVal);
  if (!oldVal) {
    return newVal;
  } else if (newVal > oldVal) {
    return newVal;
  } else {
    return oldVal;
  }
}

function updateForecast(forecastData) {
  console.log(forecastData);
  var curDate = moment().format("M/D/YY");
  var slotId = 0;
  var lowTemp = "";
  var highTemp = "";
  var lowWind = "";
  var highWind = "";
  var lowHumidity = "";
  var highHumidity = "";
  var icon = "";
  var curTime;

  for (let i = 0; i < forecastData.list.length; i++) {
    if (
      moment(forecastData.list[i].dt, "X").format("M/D/YY") !== curDate ||
      i === forecastData.list.length - 1
    ) {
      if (slotId > 0) {
        $("#h5Slot" + slotId).text(`${curDate}`);
        $("#p1Slot" + slotId).text(`Temp: ${lowTemp}° to ${highTemp}°`);
        $("#p2Slot" + slotId).text(`Wind: ${lowWind} mph to ${highWind} mph`);
        $("#p3Slot" + slotId).text(
          `Humidity: ${lowHumidity}% to ${highHumidity}%`
        );
        if (!!icon) {
          $("#imgSlot" + slotId).attr(
            "src",
            `https://openweathermap.org/img/wn/${icon}.png`
          );
        }
      }
      lowTemp = forecastData.list[i].main.temp;
      highTemp = forecastData.list[i].main.temp;
      lowWind = forecastData.list[i].wind.speed;
      highWind = forecastData.list[i].wind.speed;
      lowHumidity = forecastData.list[i].main.humidity;
      highHumidity = forecastData.list[i].main.humidity;
      icon = forecastData.list[i].weather[0].icon;

      curDate = moment(forecastData.list[i].dt, "X").format("M/D/YY");
      slotId++;
      if (slotId >= 6) {
        return;
      }
    } else {
      lowTemp = ifLess(lowTemp, forecastData.list[i].main.temp);
      highTemp = ifMore(highTemp, forecastData.list[i].main.temp);
      lowWind = ifLess(lowWind, forecastData.list[i].wind.speed);
      highWind = ifMore(highWind, forecastData.list[i].wind.speed);
      lowHumidity = ifLess(lowHumidity, forecastData.list[i].main.humidity);
      highHumidity = ifMore(highHumidity, forecastData.list[i].main.humidity);
      curTime = moment(forecastData.list[i].dt, "X").format("ha");
      if (
        curTime === "4am" ||
        curTime === "7am" ||
        curTime === "10am" ||
        curTime === "1pm"
      ) {
        icon = forecastData.list[i].weather[0].icon;
      }
      console.log(
        `curDate: ${curDate}  i: ${i}  curTime: ${curTime} icon: ${icon}`
      );
    }
  }
}

function getForecastApi(currentData) {
  updateCurrent(currentData);
  var long = currentData.coord.lon;
  var lat = currentData.coord.lat;
  var forecastApi = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&units=imperial&appid=${apiKey}`;
  fetch(forecastApi)
    .then(function (response) {
      if (response.status === 404) {
        $("#forecast-dialog").dialog();
      }
      return response.json();
    })
    .then(updateForecast);
}

function getApi() {
  var cityName = $("#city-name").val();
  if (!cityName) {
    cityName = "Redwood City";
  }

  var cityProperty = cityName.replace(" ", "+");
  var currentApi = `http://api.openweathermap.org/data/2.5/weather?q=${cityProperty}&units=imperial&appid=${apiKey}`;

  fetch(currentApi)
    .then(function (response) {
      if (response.status === 404) {
        $("#city-dialog").dialog();
      }
      return response.json();
    })
    .then(getForecastApi);
}

setAutoComplete();
getApi();
searchButton.on("click", getApi);
