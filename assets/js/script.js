var apiKey = '27628dc2d5b017cf1761f1dbe7dffc83';
var cityArray = JSON.parse(localStorage.getItem('cityArray')) || [];

// search that takes user input and calls currentWeather().
function citySearch(event) {
    event.preventDefault();
    var city = document.getElementById('user-input').value;
        console.log(city);
        currentWeather(city);
}

// search button and click event / enter key
var button = document.getElementById('search-button');
var input = document.getElementById('user-input');
input.addEventListener('keypress', function(e) {
    if (e.which === 13) {
        event.preventDefault();
        button.click();
    }
});

button.addEventListener('click', citySearch);

// current weather API call - calls 5-day forecast at the end
function currentWeather(city) {
    var requestURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey + '&units=imperial';
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

            var card = $('<div>').addClass('card');
            var cardHeader = $('<div>').addClass('card-header');
            var cardBody = $('<div>').addClass("card-body");
            var cardTitle = $('<h2>').addClass('card-title').text(cityName);
            var imgEl = $('<img>').attr('src', 'http://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png');
            var descriptionEl = $('<h5>').addClass('card-text').text('Current Conditions: ' + data.weather[0].description);
            var tempEl = $('<h5>').addClass('card-text').text('Temperature: ' + Math.round(data.main.temp) + '˚F');
            var humidityEl = $('<h5>').addClass('card-text').text('Humidity: ' + data.main.humidity + '%');

            $('#today-weather').append(card.append(cardHeader.append(cardTitle.append(imgEl), cardBody.append(descriptionEl, tempEl, humidityEl))));

            var lat = data.coord.lat;
            var lon = data.coord.lon;
            getForecast(lat, lon);
        })
}

// 5-day forecast
function getForecast(lat, lon) {
    var requestURL = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey + '&units=imperial';
    fetch(requestURL).then(function (response) {
        return response.json();
    }).then(function (data) {

        var highArray = data.list.filter(weatherObject => weatherObject.dt_txt.split(" ")[1] === '12:00:00');
        var lowArray = data.list.filter(weatherObject => weatherObject.dt_txt.split(" ")[1] === '00:00:00');
        $('#5-day-forecast').empty();
        for (var i = 0; i < highArray.length; i++) {
            console.log(highArray[i]);
            var date = new Date(highArray[i].dt * 1000).toDateString().split(' ')[0];
            var cardTitle = $('<h2>').addClass('card-title').text(date);
            var card = $('<div>').addClass('card flex-child');
            var cardHeader = $('<div>').addClass('card-header');
            var cardBody = $('<div>').addClass('card-body');
            // var imgEl = $('<img>').attr('src', 'http://openweathermap.org/img/wn/' + data.weather[0].icon + '@.png');
            // var descriptionEl = $('<h5>').addClass('card-text').text('Cond: ' + data.weather[0].description);
            // var tempEl = $('<h5>').addClass('card-text').text('Temp: ' + Math.round(data.main.temp) + '˚F');
            // var humidityEl = $('<h5>').addClass('card-text').text('Hum: ' + data.main.humidity + '%');

            $('#5-day-forecast').append(card.append(cardBody.append(cardHeader.append(cardTitle))));
        }
    })
}

// search history
for (var i = 0; i < cityArray.length; i++) {
    var li = $('<li>').addClass('list-group-item').attr('data-city', cityArray[i]).text(cityArray[i]).click(function () { currentWeather(this.getAttribute('data-city')) });
    $('#search-history').append(li);
}