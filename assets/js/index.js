const DEFAULT_CITY = "Redwood City"
var apiKey = "d3a388cc2e0c9271a4d6036eef79b90b";
var searchButton = $("#city-name-btn");
var searchHistory;

function updateCurrent(currentData) {
  var curDate = moment().format("M/D/YYYY");
  var curTemp = Math.round(currentData.main.temp);
  var curWind = Math.round(currentData.wind.speed);
  var curHumidity = currentData.main.humidity;
  var cityName = currentData.name;
  var iconUrl = "https://openweathermap.org/img/wn/";
  var icon = currentData.weather[0].icon;

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
        $("#p2Slot" + slotId).text(`Wind: ${lowWind} to ${highWind} mph`);
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
      if (!response.ok) {
        $("#forecast-dialog").dialog();
      }
      return response.json();
    })
    .then(updateForecast);
}

function makeCityButtons() {
  var buttonEl;
  var searchHistoryBtnsEl = $("#search-history-buttons");
  searchHistoryBtnsEl.empty();

  for (let i = 0; i < searchHistory.length; i++) {
    buttonEl = $("<button>");
    buttonEl.attr("href", "#");
    buttonEl.attr("class", "btn btn-secondary btn-block");
    buttonEl.attr("id", "btn" + i + 1);
    buttonEl.attr("data-city", searchHistory[i]);
    buttonEl.text(searchHistory[i]);
    searchHistoryBtnsEl.append(buttonEl);
    buttonEl.on("click", handleBtns);
  }
}

function addToCitySearch(cityName) {
  if (!searchHistory.includes(cityName)) {
    searchHistory.unshift(cityName);
    if (searchHistory.length > 5) {
      searchHistory.pop();
    }
    makeCityButtons();
    localStorage.setItem("searchHistory",JSON.stringify(searchHistory));
  }
}

function getCurrentApi(cityName, addToSearch) {
  var cityProperty;
  var currentApi;

  if (!cityName) {
    cityName = DEFAULT_CITY;
  }

  cityProperty = cityName.replace(" ", "+");
  currentApi = `http://api.openweathermap.org/data/2.5/weather?q=${cityProperty}&units=imperial&appid=${apiKey}`;

  fetch(currentApi)
    .then(function (response) {
      if (!response.ok) {
        $("#city-dialog").dialog();
      } else {
        if (addToSearch) {
          addToCitySearch(cityName);
        }
      }
      return response.json();
    })
    .then(getForecastApi);
}

function handleSearch() {
  var cityName = $("#city-name").val();
  getCurrentApi(cityName, true);
}

function handleBtns(event) {
  var element = $(event.target);
  var cityName = element.attr("data-city");
  getCurrentApi(cityName, false);
}

function init() {
  var cityName;

  setAutoComplete();
  searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
  if (!searchHistory) {
    cityName = DEFAULT_CITY;
    searchHistory = [];
  } else {
    cityName = searchHistory[0];
  }
  makeCityButtons();
  getCurrentApi(cityName, false);
}

init();
searchButton.on("click", handleSearch);
