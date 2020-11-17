$(document).ready(function () {
  var todaysDate = moment().format("dddd, MMMM Do");
  var todaysTime = moment().format("hh:mm A");
  var dateEl = $("<h3>" + todaysDate + "</h3>");
  var timeEl = $("<h4>" + todaysTime + "</h4>");


  for (var i = 0; i < 100; i++){
    var storedCities = "city"+ i;
    var test = localStorage.getItem(storedCities);
    if(test != null){
        $(".history").append('<button class="cityBtn list-group-item">' + test + "</button>");
    }
  }
  $(".cityBtn").on("click",function(){
    var searchThis = $(this).text()  
    getToday(searchThis)
  })
  

  //get the btn click
  $("#searchBtn").click(function () {
    $("#cityList").empty()
      
    //get the text value
    var city = $("#searchValue").val().trim();
    getToday(city);

    // figure out how to do local storage with an array
    // json stringify, json parse, and for loops
    if(city != ""){
        var keyNumber = localStorage.length
        var cities = "city" + keyNumber
        localStorage[cities] = city;
    }
    $("#searchValue").val("");
    for (var i = 0; i < 100; i++){
        var storedCities = "city"+ i;
        var test = localStorage.getItem(storedCities);
        if(test != null){
            $(".history").append('<button class="list-group-item">' + test + "</button>");
        }
    }
    
  });
  

  // get current weather
  function getToday(city) {
    $(".card-deck").empty()  
    $.ajax({
      method: "GET",
      url:
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&appid=ef6947237f0042414bb81d7fc5566767",
    }).then(function (data) {
      console.log(data);
      $("#today").empty();

      var cityName = $("<h2>" + city + "</h2>");
      var cityTemp = data.main.temp;
      cityTemp = Math.trunc(((cityTemp - 273.15) * 9) / 5 + 32);
      var tempPTag = $("<p>Temperature: " + cityTemp + "°F</p>");
      var humidity = data.main.humidity;
      var humiEl = $("<p>Humidity: " + humidity + "%</p>");
      var windSpeed = data.wind.speed;
      var windSpeedEl = $("<p>Wind Speed: " + windSpeed + "MPH</p>");
      var icon = data.weather[0].icon;
      var iconEl = $(
        "<img style='background-color: white;' src='https://openweathermap.org/img/wn/" +
          icon +
          "@2x.png'>"
      );

      var lat = data.coord.lat;
      var lon = data.coord.lon;
      var uvURL =
        "https://api.openweathermap.org/data/2.5/uvi?lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=ef6947237f0042414bb81d7fc5566767";
      $.ajax({
        url: uvURL,
        type: "GET",
      }).then(function (uvAPI) {
        console.log(uvAPI);
        var uvIndex = uvAPI.value;

        if (uvIndex <= 2) {
          var uvEl = $("<p style='color:green;'>UV Index: " + uvIndex + "</p>");
        }
        if (uvIndex > 2 && uvIndex <= 7) {
          var uvEl = $(
            "<p style='color:orange;'>UV Index: " + uvIndex + "</p>"
          );
        }
        if (uvIndex > 7) {
          var uvEl = $("<p style='color:red;'>UV Index: " + uvIndex + "</p>");
        }
        $("#today").append(uvEl);
      });

      $("#today").append(dateEl);
      $("#today").append(timeEl);
      $("#today").append(cityName);
      $("#today").append(iconEl);
      $("#today").append(tempPTag);
      $("#today").append(humiEl);
      $("#today").append(windSpeedEl);

      var forecast =
        "https://api.openweathermap.org/data/2.5/forecast?q=" +
        city +
        "&appid=ef6947237f0042414bb81d7fc5566767";
      $.ajax({
        url: forecast,
        type: "GET",
      }).then(function (forecastApi) {
        console.log(forecastApi);

        var fiveDayForecast = forecastApi.list;
        var weatherForcastData = [];

        for (var i = 0; i < fiveDayForecast.length; i+=8) {
          var singleDay = {
            date: fiveDayForecast[i].dt_txt,
            icon: fiveDayForecast[i].weather[0].icon,
            temp: fiveDayForecast[i].main.temp,
            humidity: fiveDayForecast[i].main.humidity,
          };

          weatherForcastData.push(singleDay);
        }

        // var days = ["Monday", "Tuesday"];
        for (var i = 0; i < weatherForcastData.length; i++) {
          var cardTemplate =
            '<div class="card"> <div class="card-body"> <h5 class="card-title"></h5>' +
            '<p class="card-text">' +
            weatherForcastData[i].date +
            "</p>" +
            "<img class='card-text' style='background-color: gray;' src='https://openweathermap.org/img/wn/"+weatherForcastData[i].icon+"@2x.png'>" +
            '<p class="card-text">Temperature: ' +
            Math.trunc(((weatherForcastData[i].temp - 273.15) * 9) / 5 + 32)  + 
            '°F</p>' +
            '<p class="card-text">Humidity: ' +
            weatherForcastData[i].humidity +
            '%</p>' +
            '</p></div><div class="card-footer"> </div>';
          $(".card-deck").append(cardTemplate);
        }

        console.log(weatherForcastData);
      });
    });
    
  }
});
