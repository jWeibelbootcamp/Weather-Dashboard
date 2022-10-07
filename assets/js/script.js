var apiKey = "27628dc2d5b017cf1761f1dbe7dffc83";
var cityArray = JSON.parse(localStorage.getItem('cityArray')) || [];

// search that takes user input and calls currentWeather().
function citySearch(event) {
    event.preventDefault();
    var city = document.getElementById("user-input").value;
    if (city.value === '') {
        alert('Please enter a city name.'); //this alert isn't working
        // } else if () { way to handle a misspelling?
    } else {
        console.log(city);
        currentWeather(city);
    }
}

// search button
var button = document.getElementById('search-button');
button.addEventListener('click', citySearch);

// current weather API call - calls 5-day forecast at the end
function currentWeather(city) {
    var requestURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=imperial";
    console.log(requestURL);
    fetch(requestURL)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            console.log(data);
            $('#today-weather').empty();
            // assigning API information and creating elements to display
            var cityName = data.name;
            if (cityArray.indexOf(cityName) === -1) {
                cityArray.push(cityName);
                localStorage.setItem('cityArray', JSON.stringify(cityArray));
            }

            var card = $("<div>").addClass("card");
            var cardHeader = $("<div>").addClass("card-header");
            var cardBody = $("<div>").addClass("card-body");
            var cardTitle = $("<h2>").addClass("card-title").text(cityName);
            var imgEl = $("<img>").attr("src", `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);

            var descriptionEl = $('<h5>').addClass('card-text').text("Current Weather: " + data.weather[0].description);
            var tempEl = $('<h5>').addClass('card-text').text("Temperature: " + Math.round(data.main.temp) + String.fromCharCode(176));
            var humidityEl = $('<h5>').addClass('card-text').text("Humidity: " + data.main.humidity + "%");

            $("#today-weather").append(card.append(cardHeader.append(cardTitle.append(imgEl), cardBody.append(descriptionEl, tempEl, humidityEl))));

            var lat = data.coord.lat;
            var lon = data.coord.lon;
            getForecast(lat, lon);
        })
}

// 5-day forecast
function getForecast(lat, lon) {
    var queryURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
    fetch(queryURL).then(function (response) {
        return response.json()
    }).then(function (data) {

        var highArray = data.list.filter(weatherObject => weatherObject.dt_txt.split(" ")[1] === "12:00:00");
        var lowArray = data.list.filter(weatherObject => weatherObject.dt_txt.split(" ")[1] === "00:00:00");
        $('#5-day-forecast').empty();
        for (var i = 0; i < highArray.length; i++) {
            console.log(highArray[i]);
            var card = $("<div>").addClass("card flex-child");
            var cardHeader = $("<div>").addClass("card-header");
            var cardBody = $("<div>").addClass("card-body");
            var date = new Date(highArray[i].dt * 1000).toDateString().split(' ')[0];
            var cardTitle = $("<h2>").addClass("card-title").text(date);
            $('#5-day-forecast').append(card.append(cardBody.append(cardHeader.append(cardTitle))));
        }
    })
}

for (var i = 0; i < cityArray.length; i++) {
    var li = $('<li>').addClass('list-group-item').attr('data-city', cityArray[i]).text(cityArray[i]).click(function () { currentWeather(this.getAttribute('data-city')) });
    $('#search-history').append(li);
}


// https://openweathermap.org/api/one-call-api
// https://coding-boot-camp.github.io/full-stack/apis/how-to-use-api-keys
// ADVICE COLUMN = for this openweathermap api, you will access TWO SEPARATE
// API CALLS to get this one. (there are two separate urls from the
// openweathermap website)

// ### I need to do the following:
// 1) I need to accept a user input that is a city name and it returns the
// CURRENT DAY'S WEATHER, UV INDEX, WINDS (MPH), HUMIDITY, AND AN IMAGE that
// displays the current weather. (cloudy = cloudy image) (as it's own card,
// and it's the biggest)

// 2) After returning the CURRENT DAY'S WEATHER, I need to POPULATE on the
// page a 5 Day forecast starting from the next day. The information
// returning will be the same information. HOWEVER, will be stored in
// smaller blocks.

// 3) I need to find a way to PERSIST the previous cities that were
// searched.
// - And when you click on one of the buttons of the previous city, their
// weather data will re-populate the page.

// apparently i need to use coordinates:
// https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}


// 3) The openweathermap FUNCTION will be only be called IF a city name is
// given AND the user clicks the search button.
// - HOW do I access or reference the **value** /name of the city the user
// inputs?
// - HOW can I only call the function when the search button is **clicked**?
// - HOW / WHAT should I do to REFERENCE the data that returns? (do I put
// this in a variable? do I return this at the end of the function?) ADVICE
// COLUMN = **KEEP IN MIND what GLOBAL VS LOCAL scoped variables do**

// 4) Once I call that data from the openweathermap website, I need to PARSE
// through the data/object returning and pull out just the values I need for
// today's forecast.
// - I need to POPULATE to the CURRENT DAY page the Temperature, the wind,
// the humidity, the UV index, the name of the city, the current date, and
// the image that displays the weather.
// - For the single day call, I BELIEVE it should be an object
// HOW do I grab values from the returning object,
// **create** and element,
// **add text** to that element, and **append** to the page?

// 5) So currently I have the TODAY forecast, however I do not have the next
// 5-day forecast. What should I do?
// - Does the SPECIFIC openweathermap api return the 5 day forecast OR does
// it return the current day forecast?
// - If it does NOT return the 5 day forecast, I need to read the
// documentation.
// - IF the 5 day forecast call gives me back the data, I am GOING TO GUESS
// it will be **an ARRAY of OBJECTS**
// - What did I learn that allows me to **ITERATE** through an array and
// **create**, **add text**, and **append** elements to the page?
// - And then, I need to populate these cadrs to the 5-day forecast div that
// I made.

// 6) I need to find a way to have the user's previous searches PERSIST on
// the page.
// - Is there a way to store MULTIPLE user searches in a single reference?
// (hint: it might start with the letter A)
// - I need to find a way to have this data **PERSIST**. Maybe some kind of
// **STORAGE**?
// - If we have this data in the **STORAGE**, maybe we can **SET** the
// **ITEMS** as a KEY-VALUE, and then **GET** the
// **ITEMS** when the page
// loads.
// - Since the previous searches need to immediately populate on the screen,
// I need to GET these items when the page loads.
// - IF I can store these values, I need to find a way to **TARGET** the
// specific city that I click on to MAKE the API call again. (ADVICE COLUMN
// = Did we learn anything that allows an HTML element to STORE VALUES?)