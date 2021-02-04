

// find current city input 
function citySearch(cityName) {

    // const APIkey = "d6d3d794b0487c24c945d325d4b77b38";
    

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=d6d3d794b0487c24c945d325d4b77b38&units=imperial";
    var queryForecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName +"&appid=d6d3d794b0487c24c945d325d4b77b38&units=imperial";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        console.log(queryURL);

// need to empty info that was dumped in here
        $("#currentForecastDiv").empty();



// generate html dynamically here and dump into the html page
if (searchHistory.indexOf(cityName)=== -1){
    searchHistory.push(cityName);
    localStorage.setItem("cityName", JSON.stringify(searchHistory))
    pageLoad (cityName)
}
        var cityNameDiv = $("<h3>").text(response.name);
        var currentDate = new Date ().toLocaleDateString();
        cityNameDiv.append(currentDate);
        var tempDiv = $("<p>").text("Temperature: " + response.main.temp.toFixed(0));
        var humidityDiv = $("<p>").text("Humidity: " + response.main.humidity + "%");
        var windSpeedDiv = $("<p>").text("Wind Speed: " + response.wind.speed + "mph");
        var currentWeather = response.weather[0].main;


        var currentSymbol = $('<img>').attr("src", "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png");
        console.log(currentSymbol);

        
// attach or append to render

        var mainDiv = $("<div>");
        mainDiv.append(currentSymbol);
        mainDiv.append(currentDate, currentWeather, tempDiv, humidityDiv, windSpeedDiv);

        $("#currentForecastDiv").html(mainDiv);

// UV Index api goes here

var lat = response.coord.lat;
var lon = response.coord.lon;
const APIkey = "d6d3d794b0487c24c945d325d4b77b38";
var queryUVIndexURL = `http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${APIkey}`;

        $.ajax({
            url: queryUVIndexURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            $("#uvIndexDisplay").empty();
            var UVIndex = response.value;
            //create HTML for new div
            var UVIndexDiv = $("<div id= 'UV'>").text("UV Index: " + response.value);
      
            $("#uvIndexDisplay").html(UVIndexDiv);
    
        });
    });

// Must do ajax for five day forecast divs

    $.ajax({
        url: queryForecastURL,
        method: "GET"
    }).then(function(response) {
        console.log(response);
        var forecastResults = response.list;

// empty the five day info that was dumped in

        $("#fiveDayForecastDiv").empty();
// create html dynamically for the week forecast and insert into html page

for (var i = 0; i < forecastResults.length; i ++){
var forecastDiv = $("<div id= 'forecastCards' class='card shadow-lg text-white bg-primary mx-auto md-10 p-2' style='width: 8.5rem; height: 15rem;'>");

// store data
if (forecastResults[i].dt_txt.indexOf("12:00:00")!== -1) {


var forecastTemp = forecastResults[i].main.temp.toFixed(0);
var forecastHumidity = forecastResults[i].main.humidity;
var forecastWindSpeed = forecastResults[i].wind.speed;


// need to put in p tags for the text for date, temp, humidity, and wind speed like $("<h6 class='card-title'>").text("Temp: " + temp);
var forecastSymbol = $('<img>').attr("src", "http://openweathermap.org/img/w/" + forecastResults[i].weather[0].icon + ".png");
var ptagTemp = $("<p class='card-text'>").text("Temp: " + forecastTemp);
var ptagHumidity = $("<p class='card-text'>").text("Humidity: " + forecastHumidity + "%");
var ptagWindSpeed = $("<p class='card-text'>").text("Wind-Speed: " + forecastWindSpeed + "mph");


// NEED TO APPEND THE WEEK FORECAST TO THE HTML PAGE. USE .append()

forecastDiv.append(forecastSymbol);
forecastDiv.append(ptagTemp);
forecastDiv.append(ptagHumidity);
forecastDiv.append(ptagWindSpeed);
$("#fiveDayForecastDiv").append(forecastDiv);
}
    }
});

}


// event on click for search


$("#selectCity").on("click", function(event) {
    // Preventing the button from trying to submit the form......
    event.preventDefault();
    // Storing the city name........
    var cityInput = $("#cityInputDiv").val().trim();

    //save search term to local storage.....
    var textInput = $(this).siblings("input").val();
    // var arrayStorage = [];
    // arrayStorage.push(textInput);
    // localStorage.setItem('cityName', JSON.stringify(arrayStorage));
  
    citySearch(cityInput);
   
});

// Make buttons for history search
function pageLoad (lastCity) {
    
    var searchCityDiv = $("<button class='btn border text-muted mt-1 shadow-sm bg-white rounded' style='width: 12rem;'>").text(lastCity);
    var searchCity = $("<div>").attr("id", "searchCity");
    searchCity.append(searchCityDiv)
    $("#cityHistorySearchDiv").prepend(searchCity);
}
var searchHistory = JSON.parse(localStorage.getItem("cityName")) || [];
for (var i = 0; i < searchHistory.length; i ++){
    pageLoad (searchHistory[i])
}
$("#searchCity").on('click', '.btn', function(event) {
// event.preventDefault();
    console.log($(this).text());
    citySearch($(this).text());

});