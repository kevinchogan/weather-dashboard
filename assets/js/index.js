

var requestUrl = "http://api.openweathermap.org/data/2.5/weather?q=Redwood+City&appid=d3a388cc2e0c9271a4d6036eef79b90b";

fetch(requestUrl)
.then(function (response) {
  return response.json();
})
.then(function (data) {
  console.log(data);
});
