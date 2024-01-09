const DEFAULT_CITY = "Redwood City";
var apiKey = "d3a388cc2e0c9271a4d6036eef79b90b";
var searchButton = $("#city-name-btn");
var searchHistory;

/* === updateCurrent ===
Updates the html with the current weather data
=== updateCurrent ===*/
function updateCurrent(currentData) {
  var curDate = moment().format("ddd M/D/YYYY");
  var curTemp = Math.round(currentData.main.temp);
  var curWind = Math.round(currentData.wind.speed);
  var curHumidity = currentData.main.humidity;
  var cityName = currentData.name;
  var iconUrl = "https://openweathermap.org/img/wn/";
  var icon = currentData.weather[0].icon;

  // updates current weather header
  curCityEl = $("#current-city-name");
  curCityEl.text(`${cityName} (${curDate})`);

  // sets up element for weather icon
  imageEl = $("<img>");
  iconUrl += `${icon}@2x.png`;
  imageEl.attr("src", iconUrl);

  // Uses the icon code to generate a bg gradient
  setBgGradient(icon);

  // Adds image icon
  curCityEl.append(imageEl);
  // updates text with weather vitals
  $("#current-temp").text(`Temp: ${curTemp}°`);
  $("#current-wind").text(`Wind: ${curWind} mph`);
  $("#current-humidity").text(`Humidity: ${curHumidity}%`);
}

/* === setBgGradient ===
Uses open weather icon codes to generate a background gradient for the HTML body
Sets "5-day forecast" header to white if bg is dark
=== setBgGradient ===*/
function setBgGradient(icon) {
  bodyEl = $("body");
  headerEl = $("h3");

  switch (icon) {
    case "01d": //clear sky - day
      bodyEl.css("background-image", "linear-gradient(blue, lightblue)");
      break;
    case "01n": //clear sky - night
      bodyEl.css("background-image", "linear-gradient(midnightblue, indigo)");
      headerEl.addClass("text-white");
      break;
    case "02d": //few clouds - day
      bodyEl.css("background-image", "linear-gradient(royalblue, lightgrey)");
      break;
    case "02n": //few clouds - night
      bodyEl.css("background-image", "linear-gradient(midnightblue, darkgrey)");
      headerEl.addClass("text-white");
      break;
    case "03d": //scattered clouds - day
    case "50d": //mist - day
      bodyEl.css("background-image", "linear-gradient(darkgrey, lightblue)");
      break;
    case "03n": //scattered clouds - night
    case "50n": //mist - night
    case "13n": //snow - night
      bodyEl.css("background-image", "linear-gradient(dimgrey, midnightblue)");
      headerEl.addClass("text-white");
      break;
    case "04d": //broken clouds - day
      bodyEl.css("background-image", "linear-gradient(darkgrey, lightgrey)");
      break;
    case "04n": //broken clouds - night
      bodyEl.css("background-image", "linear-gradient(dimgrey, darkgrey)");
      headerEl.addClass("text-white");
      break;
    case "09d": //shower rain - day
    case "10d": //rain - day
    case "11d": //thunderstorm - day
      bodyEl.css("background-image", "linear-gradient(dimgrey, darkgrey)");
      break;
    case "09n": //shower rain - night
    case "10n": //rain - night
    case "11n": //thunderstorm - night
      bodyEl.css("background-image", "linear-gradient(dimgrey, black)");
      headerEl.addClass("text-white");
      break;
    case "13d": //snow - day
      bodyEl.css("background-image", "linear-gradient(lightgrey, white)");
      break;
    default:
      bodyEl.css("background-image", "linear-gradient(blue, lightblue)");
  }
}

/* === ifLess ===
Compares two values and returns the lowest
=== ifLess ===*/
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

/* === ifMore ===
Compares two values and returns the highest
=== ifMore ===*/
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

/* === updateForecast ===
Updates 5 day forecast elements with open weather data.  Multiple instances of data 
for each day is used to collect the highs and lows in three categories (temp, wind, 
and humidity).
=== updateForecast ===*/
function updateForecast(forecastData) {
  var curDate = moment().format("M/D/YY");
  var slotId = 1;
  var lowTemp;
  var highTemp;
  var lowWind;
  var highWind;
  var lowHumidity;
  var highHumidity;
  var icon;
  var curTime;
  var dateLabel;

  for (let i = 0; i < forecastData.list.length; i++) {
    // if the array instance date is new, updates the html text with
    // previous data and resets weather vitals and current date
    if (
      moment(forecastData.list[i].dt, "X").format("M/D/YY") !== curDate ||
      i === forecastData.list.length - 1
    ) {
      // html text is updated with the day's weather data
      dateLabel = moment(curDate, "M/D/YY").format("ddd M/D/YY")
      // headers says 'Today' in the first slot, othewrise shows date
      if (slotId === 1) {
        $("#h5Slot" + slotId).text('Today');
      } else {
        $("#h5Slot" + slotId).text(`${dateLabel}`);
      }
      // update weather data text
      $("#p1Slot" + slotId).text(`Temp: ${lowTemp}° to ${highTemp}°`);
      $("#p2Slot" + slotId).text(`Wind: ${lowWind} to ${highWind} mph`);
      $("#p3Slot" + slotId).text(
        `Humidity: ${lowHumidity}% to ${highHumidity}%`
      );
      // set up icon image element
      if (!!icon) {
        $("#imgSlot" + slotId).attr(
          "src",
          `https://openweathermap.org/img/wn/${icon}.png`
        );
      }
      // resets the weather data for new day's comparisons
      lowTemp = forecastData.list[i].main.temp;
      highTemp = forecastData.list[i].main.temp;
      lowWind = forecastData.list[i].wind.speed;
      highWind = forecastData.list[i].wind.speed;
      lowHumidity = forecastData.list[i].main.humidity;
      highHumidity = forecastData.list[i].main.humidity;
      icon = forecastData.list[i].weather[0].icon;
      // sets the current day to the next day and increments slot ID
      curDate = moment(forecastData.list[i].dt, "X").format("M/D/YY");
      slotId++;
      // exits once slot 5 is complete
      if (slotId >= 6) {
        return;
      }
    } else {
      // compares day's data to derive the highs and lows
      lowTemp = ifLess(lowTemp, forecastData.list[i].main.temp);
      highTemp = ifMore(highTemp, forecastData.list[i].main.temp);
      lowWind = ifLess(lowWind, forecastData.list[i].wind.speed);
      highWind = ifMore(highWind, forecastData.list[i].wind.speed);
      lowHumidity = ifLess(lowHumidity, forecastData.list[i].main.humidity);
      highHumidity = ifMore(highHumidity, forecastData.list[i].main.humidity);
      // uses the latest hour's icon up to 1pm
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

/* === getForecastApi ===
Uses the current day's forecast data to derive the longitude and latitude which is then
used for the API fetch of the 5 day forecast data (since city cannot be used for this API).
=== getForecastApi ===*/
function getForecastApi(currentData) {
  var long = currentData.coord.lon;
  var lat = currentData.coord.lat;
  var forecastApi = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&units=imperial&appid=${apiKey}`;

  // function call to update the current weather conditions
  updateCurrent(currentData);
  // fetches the 5-day forecast, once complete calls function to update html
  fetch(forecastApi)
    .then(function (response) {
      if (!response.ok) {
        $("#forecast-dialog").dialog();
      }
      return response.json();
    })
    .then(updateForecast);
}

/* === makeCityButtons ===
Creates the buttons for recently searched cities, which are retrieved from local storage
=== makeCityButtons ===*/
function makeCityButtons() {
  var buttonEl;
  var searchHistoryBtnsEl = $("#search-history-buttons");

  // removes any existing buttons
  searchHistoryBtnsEl.empty();
  // runs through each city in the search history and creates a button for it
  for (let i = 0; i < searchHistory.length; i++) {
    // sets up the button element
    buttonEl = $("<button>");
    buttonEl.attr("href", "#");
    buttonEl.attr("class", "btn btn-secondary btn-block");
    buttonEl.attr("id", "btn" + i + 1);
    buttonEl.attr("data-city", searchHistory[i]);
    buttonEl.text(searchHistory[i]);
    // appends the button element
    searchHistoryBtnsEl.append(buttonEl);
    // sets up the event handler for the button
    buttonEl.on("click", handleBtns);
  }
}

/* === addToCitySearch ===
If a city is not currently in the recently searched array, it is added.  If the 
array is greater than 5, the last item is removed.
=== addToCitySearch ===*/
function addToCitySearch(cityName) {
  if (!searchHistory.includes(cityName)) {
    searchHistory.unshift(cityName);
    if (searchHistory.length > 5) {
      searchHistory.pop();
    }
    makeCityButtons();
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  }
}

/* === getCurrentApi ===
Fetches the data for a city based on its name.  Adds to the search history if the 
'addToSearch' parameter is TRUE
=== getCurrentApi ===*/
function getCurrentApi(cityName, addToSearch) {
  var cityProperty;
  var currentApi;

  // if the cityName is undefined, use the default
  if (!cityName) {
    cityName = DEFAULT_CITY;
    addToSearch = false;
  }

  // replace spaces to set up for URL
  cityProperty = cityName.replace(" ", "+");
  currentApi = `http://api.openweathermap.org/data/2.5/weather?q=${cityProperty}&units=imperial&appid=${apiKey}`;

  fetch(currentApi)
    .then(function (response) {
      if (!response.ok) {
        $("#city-dialog").dialog();
      } else {
        // if 'addToSearch' is true, add the city to the search history
        if (addToSearch) {
          addToCitySearch(cityName);
        }
      }
      return response.json();
    })
    // once the data arrives, fetch the forecast data
    .then(getForecastApi);
}

/* === handleSearch ===
Handles the search request when the search button is clicked
=== handleSearch ===*/
function handleSearch() {
  var cityName = $("#city-name").val();
  getCurrentApi(cityName, true);
}

/* === handleBtns ===
Handles the recently searched buttons
=== handleBtns ===*/
function handleBtns(event) {
  var element = $(event.target);
  var cityName = element.attr("data-city");
  getCurrentApi(cityName, false);
}

/* === init ===
Sets up the autocomplete array, gets the search history from local storage, makes
the recently searched city buttons, and calls the function to make the first API call
=== init ===*/
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

/* === MAIN ===
Calls the initialization function and sets up the event handler for the search button
=== MAIN ===*/
init();
searchButton.on("click", handleSearch);
