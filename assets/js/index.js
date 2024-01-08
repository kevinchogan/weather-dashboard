var apiKey = 'd3a388cc2e0c9271a4d6036eef79b90b';
var searchButton = $("#city-name-btn");

function setAutoComplete() {
    $( function() {
        var availableTags = [
            "Abidjan",
            "Addis Ababa",
            "Ahmadabad",
            "Al Basrah",
            "Al Jizah",
            "Albuquerque",
            "Alexandria",
            "Anaheim",
            "Anchorage",
            "Ankara",
            "Arlington",
            "Atlanta",
            "Aurora",
            "Austin",
            "Baghdad",
            "Bakersfield",
            "Baltimore",
            "Bangalore",
            "Bangkok",
            "Baton Rouge",
            "Belmont",
            "Belo Horizonte",
            "Boston",
            "Brooklyn",
            "Buffalo",
            "Busan",
            "Cairo",
            "Cali",
            "Cape Town",
            "Caracas",
            "Casablanca",
            "Chandler",
            "Changchun",
            "Charlotte",
            "Chengdu",
            "Chennai",
            "Chesapeake",
            "Chicago",
            "Chittagong",
            "Chongqing",
            "Chula Vista",
            "Cincinnati",
            "City of London",
            "Cleveland",
            "Colorado Springs",
            "Columbus",
            "Corpus Christi",
            "Daegu",
            "Dakar",
            "Dallas",
            "Dar es Salaam",
            "Delhi",
            "Denver",
            "Detroit",
            "Dhaka",
            "Durban",
            "Durham",
            "El Paso",
            "Faisalabad",
            "Fort Wayne",
            "Fort Worth",
            "Fortaleza",
            "Fresno",
            "Garland",
            "Glendale",
            "Grand Dakar",
            "Greensboro",
            "Guangzhou",
            "Harbin",
            "Henderson",
            "Hialeah",
            "Hong Kong",
            "Honolulu",
            "Houston",
            "Hyderabad",
            "Ibadan",
            "Incheon",
            "Indianapolis",
            "Istanbul",
            "Izmir",
            "Jacksonville",
            "Jaipur",
            "Jakarta",
            "Jeddah",
            "Jersey City",
            "Kabul",
            "Kaifeng",
            "Kano",
            "Kanpur",
            "Kansas City",
            "Karachi",
            "Kiev",
            "Kinshasa",
            "Kolkata",
            "Lagos",
            "Lahore",
            "Lanzhou",
            "Laredo",
            "Las Vegas",
            "Lexington-Fayette",
            "Lexington",
            "Lima",
            "Lincoln",
            "Long Beach",
            "Los Angeles",
            "Louisville",
            "Luanda",
            "Lubbock",
            "Lucknow",
            "Madison",
            "Manhattan",
            "Maracaibo",
            "Mashhad",
            "Memphis",
            "Mesa",
            "Miami",
            "Milwaukee",
            "Minneapolis",
            "Mogadishu",
            "Montreal",
            "Morgan Hill",
            "Nagpur",
            "Nairobi",
            "Nanchong",
            "Nanjing",
            "Nashville",
            "Navi Mumbai",
            "New Orleans",
            "New South Memphis",
            "New York",
            "Newark",
            "Norfolk",
            "Oakland",
            "Oklahoma City",
            "Omaha",
            "Orlando",
            "Osaka-shi",
            "Paradise",
            "Philadelphia",
            "Phoenix",
            "Pittsburgh",
            "Plano",
            "Portland",
            "Puyang",
            "Pyongyang",
            "Raigarh Fort",
            "Raleigh",
            "Rangoon",
            "Redwood City",
            "Reno",
            "Rio de Janeiro",
            "Riverside",
            "Sacramento",
            "Saint Louis",
            "Saint Paul",
            "Saint Petersburg",
            "Saint Petersburg",
            "Salvador",
            "San Antonio",
            "San Carlos",
            "San Diego",
            "San Francisco",
            "San Jose",
            "Santa Ana",
            "Santiago",
            "Santo Domingo",
            "Sao Paulo",
            "Scottsdale",
            "Seattle",
            "Seoul",
            "Shanghai",
            "Shenyang",
            "Shenzhen",
            "Shiyan",
            "Singapore",
            "South Boston",
            "Stockton",
            "Surabaya",
            "Surat",
            "Taian",
            "Taipei",
            "Taiyuan",
            "Tampa",
            "Tehran",
            "Tianjin",
            "Tōkyō-to",
            "Tokyo",
            "Toledo",
            "Toronto",
            "Tucson",
            "Tulsa",
            "Virginia Beach",
            "Washington",
            "West Raleigh",
            "Wichita",
            "Winston-Salem",
            "Wuhan",
            "Xian",
            "Yokohama-shi",
            "Yueyang",
            "Yunfu",
            "Zhongshan",
            "Zhumadian",            
        ];
        $('#city-name').autocomplete({
          source: availableTags
        });
      } );
}


function updateCurrent(currentData) {
    var curDate = moment().format('M/D/YYYY');
    var curTemp = Math.round(currentData.main.temp);
    var curWind = Math.round(currentData.wind.speed);
    var curHumidity = currentData.main.humidity;
    var cityName = currentData.name;
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
    var highWind = ""
    var lowHumidity = "";
    var highHumidity = "";
    var icon = "";

    for (let i = 0; i < forecastData.list.length; i++) {
        if (moment(forecastData.list[i].dt, "X").format("M/D/YY") !== curDate || i === (forecastData.list.length - 1)) {
            if (slotId > 0) {
                $("#h5Slot" + slotId).text(`${curDate}`);
                $("#p1Slot" + slotId).text(`Temp: ${lowTemp}° to ${highTemp}°`);
                $("#p2Slot" + slotId).text(`Wind: ${lowWind} mph to ${highWind} mph`);
                $("#p3Slot" + slotId).text(`Humidity: ${lowHumidity}% to ${highHumidity}%`);
                if (!!icon) {
                    $("#imgSlot" + slotId).attr("src",`https://openweathermap.org/img/wn/${icon}.png`)
                }
            }
            lowTemp = "";
            highTemp = "";
            lowWind = "";
            highWind = ""
            lowHumidity = "";
            highHumidity = "";
            icon="";

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
            if (moment(forecastData.list[i].dt, "X").format("ha") === "1pm") {
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
      return response.json();
    })
    .then(updateForecast);
}

function getApi() {
    console.log($("#city-name").val());
  var cityName = $("#city-name").val();
  var cityProperty = cityName.replace(' ', '+');
  var currentApi = `http://api.openweathermap.org/data/2.5/weather?q=${cityProperty}&units=imperial&appid=${apiKey}`;

  fetch(currentApi)
    .then(function (response) {
      return response.json();
    })
    .then(getForecastApi);
}

setAutoComplete();
searchButton.on('click',getApi);