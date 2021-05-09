var resultTextEl = document.querySelector('#result-text');
var resultContentEl = document.querySelector('#result-content');
var searchFormEl = document.querySelector('#search-form');
var searchHistoryEl = document.querySelector('.history');
var cityList = [{
  name: "",
  lat: "",
  lon: ""
}];

function getLocalStorage(){
  // We want to get the cities from the local storage, if there are any
  // This also populates the data object
  cityList = JSON.parse(localStorage.getItem("cityList"));
  if (cityList.length !== 0) {
      // cityEl holds all of the divs with the class of "description"
      var historyEl = document.querySelector('.history');
      var cityEl = [];
      // Add the data to the list
      for (var i = 0; i < cityList.length; i++) {
          // The children of these particular divs need to be clickable elements
          cityEl[i] = document.createElement('button');
          cityEl[i].classList.add('btn', 'btn-info', 'btn-block', 'bg-secondary');
          cityEl[i].setAttribute('data-name',cityList[i].name);
          cityEl[i].setAttribute('data-lat',cityList[i].lat);
          cityEl[i].setAttribute('data-lon',cityList[i].lon);
          cityEl[i].textContent = cityList[i].name;
          historyEl.append(cityEl[i]);
          
      }
  }
}

// Save the data after the list is updated
function handleSaveData(city) {
  var found = false;

  if (cityList.length ===1 & cityList[0].name === ""){
    // CityList just has the empty placeholder, replace with city
    cityList = [city];
  } else {
    // cityList has real cities in it, check if the current city is one of them
    for (var i = 0; i < cityList.length; i++){
      if (cityList[i].name === city.name){
        found = true;
      }
    }
    // If the current city was not found in the history list, add it to the array and sort the array
    if (!found) {
      cityList.push(city);
      cityList.sort((a,b) => (a.name > b.name) ? 1 : -1);
    }
  }

  // Store the list
  localStorage.setItem("cityList", JSON.stringify(cityList));

}

function printTodayResults(city, resultObj) {
  // We have a <div class='result-content'> with two children
  // We have a <div class='current'> for the current days weather
  // We have a ,div class='five-day'> for the five day forecast
  // set up `<div>` to hold result content
  var currentEl = document.querySelector('.current');
  while (currentEl.firstChild) {
    currentEl.removeChild(currentEl.firstChild);
  }

  currentEl.classList.add('card', 'w-100', 'bg-light', 'text-dark', 'mb-3', 'p-3');

  // Create the current weather header
  var currentHeader = document.createElement('div');
  currentHeader.classList.add('card-header', 'bg-light', 'text-dark', 'p-3');

  var date = moment.unix(resultObj.current.dt + resultObj.timezone_offset).format(" (M/D/YYYY) ");
  var mediaContent = document.createElement('div');
  mediaContent.classList.add('media');
  mediaBody = document.createElement('div');
  mediaBody.classList.add('media-body');
  var titleHeader = document.createElement('h2');
  titleHeader.textContent = city.name + date;
  mediaBody.append(titleHeader);
  
  var titleIcon = document.createElement('img');
  titleIcon.classList.add('img-thumbnail', 'mr-3');
  titleIcon.src = "http://openweathermap.org/img/wn/"+resultObj.current.weather[0].icon+"@2x.png";

  mediaContent.append(mediaBody, titleIcon);
  currentHeader.append(mediaContent);

  currentEl.append(currentHeader);

  // Create the current weather card content
  var resultBody = document.createElement('ul');
  resultBody.classList.add('list-group','list-group-flush', 'list-unstyled');
  var tempList = document.createElement('li');
  tempList.classList.add('list-group-item)', 'p-1');
  tempList.textContent = "Temp: " + resultObj.current.temp + " °F";
  var windList = document.createElement('li');
  windList.classList.add('list-group-flush', 'p-1');
  windList.textContent = "Wind: " + resultObj.current.wind_speed + " MPH";
  var humidList = document.createElement('li');
  humidList.classList.add('list-group-flush', 'p-1');
  humidList.textContent = "Humidity: " + resultObj.current.humidity + " %";
  var uvList = document.createElement('li');
  uvList.classList.add('list-group-flush', 'p-1');
  var uvi = resultObj.current.uvi;
  var uviClass = uvRating(uvi);
  uvBlock = document.createElement('span');
  uvBlock.classList.add(uviClass);
  uvBlock.textContent = uvi;
  uvList.textContent = "UV Index: ";
  uvList.append(uvBlock);

  resultBody.append(tempList, windList, humidList, uvList);
  
  currentEl.append(resultBody);

  // Publish the five day forecast
  var fivedayEl = document.querySelector('.five-day');
  while (fivedayEl.firstChild) {
    fivedayEl.removeChild(fivedayEl.firstChild);
  }

  fivedayEl.classList.add('card', 'w-100', 'bg-light', 'text-dark', 'mb-3', 'p-3');

  // Create the heading for the five day forecast block
  var fivedayHeader = document.createElement('div');
  fivedayHeader.classList.add('card-header', 'bg-light', 'text-dark', 'p-3');
  var fivedayHeading = document.createElement('h4');
  fivedayHeading.textContent = "5-Day Forecast:";
  fivedayHeader.append(fivedayHeading);

  // Create the container for the five forecast cards
  var fiveGroupEl = document.createElement('div');
  fiveGroupEl.classList.add('row');

  for (var i = 1; i <= 5; i++){
    // Create and populate each card
    var fiveCard = document.createElement('div');
    fiveCard.classList.add( 'card', 'w-20', 'bg-dark', 'text-light', 'p-3', 'm-3')  
    // Create the date header
    var date = moment.unix(resultObj.daily[i].dt + resultObj.timezone_offset).format("M/D/YYYY");
    cardHeader = document.createElement('div');
    cardHeader.classList.add('card-header', 'bg-dark', 'text-light', 'p-1', 'm-1');
    cardHeader.textContent = date;
    fiveCard.append(cardHeader);

    // Create the card content
    var fivedayBody = document.createElement('ul');
    fivedayBody.classList.add('list-group','list-group-flush', 'list-unstyled');
    var imgList = document.createElement('li');
    imgList.classList.add('list-group-item', 'p-1', 'bg-dark');
    var imgThumb = document.createElement('img');
    imgThumb.classList.add('img-thumbnail', 'mr-3');
    imgThumb.src = "http://openweathermap.org/img/wn/"+resultObj.daily[i].weather[0].icon+"@2x.png";  
    imgList.append(imgThumb);
    var tempList = document.createElement('li');
    tempList.classList.add('list-group-item)', 'p-1');
    tempList.textContent = "Temp: " + resultObj.daily[i].temp.day + " °F";
    var windList = document.createElement('li');
    windList.classList.add('list-group-flush', 'p-1');
    windList.textContent = "Wind: " + resultObj.daily[i].wind_speed + " MPH";
    var humidList = document.createElement('li');
    humidList.classList.add('list-group-flush', 'p-1');
    humidList.textContent = "Humidity: " + resultObj.daily[i].humidity + " %";
    var uvList = document.createElement('li');
    uvList.classList.add('list-group-flush', 'p-1');
    var uvi = resultObj.daily[i].uvi;
    var uviClass = uvRating(uvi);
    uvBlock = document.createElement('span');
    uvBlock.classList.add(uviClass);
    uvBlock.textContent = uvi;
    uvList.textContent = "UV Index: ";
    uvList.append(uvBlock);
  
    fivedayBody.append(imgList, tempList, windList, humidList, uvList);
   
    //add the five forecast cards to the fiveGroupEl container
    fiveCard.append(fivedayBody);

    fiveGroupEl.append(fiveCard);
    
  }

  // Add the fiveGroupContainer to the five day forecast container
  fivedayEl.append(fivedayHeader, fiveGroupEl);


}

function uvRating(uvi){
    // Determine severity of UV Index
    switch (Math.round(uvi)){
      case 0:
      case 1:
      case 2:
        uviClass = 'uvi-low';
        break;
      case 3:
      case 4:
      case 5:
        uviClass = 'uvi-moderate';
        break;
      case 6:
      case 7:
        uviClass = 'uvi-high';
        break;
      case 8:
      case 9:
      case 10:
        uviCLass = 'uvi-veryHigh';
        break;
      default: 
        uviClass = 'uvi-extreme';
    }
    return uviClass;
}

function searchApi(query) {
  // This function takes the city name as the input and 
  // calls the openweathermap API to get today's data
  // API Documentation:
  // api.openweathermap.org/data/2.5/weather?q={city name}&appid=ae645017a7275733894562a7a4d6f737

  // Start to building the URL shown above
  var locQueryUrl = 'https://api.openweathermap.org/data/2.5/weather';

  // This is Barry's appid, please don' share it
  var apiKey = '&units=imperial&appid=ae645017a7275733894562a7a4d6f737';

  // defining an object named city to hold the city name and location
  // This info is necessary if you want to have multiday forecast
  var city = {
    name: "",
    lat: "",
    lon: ""
  };

  // This combines the start of the URL from above with the 
  // city name that the function receives in 'query' and 
  // appends the apiKey (which includes a request for Imperial units)
  locQueryUrl = locQueryUrl + '?q=' + query + apiKey;

  //The fetch function calls the API with the URL that was built above
  fetch(locQueryUrl)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }

      return response.json();
    })
    .then(function (locRes) {
      // The if statement checks to see if a city name has been returned
      // If not, it prints a message to the log and can add a message to a page if you set that up.
      if (!locRes.name.length) {
        console.log('No results found!');
        //resultContentEl.innerHTML = '<h3>No results found, search again!</h3>';
      } else {
        // If a result was returned, the result for lat and long can be
        // to the onecall api to get the current weather and the five day
        // Must use this call to get the UV Index data.
        city.name = locRes.name;
        city.lat = locRes.coord.lat;
        city.lon = locRes.coord.lon;
        handleSaveData(city);
        getWeather(city);

     }
    })
    .catch(function (error) {
      console.error(error);
    });
}

function getWeather(city){
  // api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid=ae645017a7275733894562a7a4d6f737
  var locOnecallQueryUrl = 'https://api.openweathermap.org/data/2.5/onecall?';
  var apiKey = '&units=imperial&appid=ae645017a7275733894562a7a4d6f737';

    // Buiuld the URL for the onecall query, excluding minutely, hourly and alert data (so just currrent and daily)
    locOnecallQueryUrl = locOnecallQueryUrl + 'lat=' + city.lat + '&lon=' + city.lon + '&exclude=minutely,hourly,alerts' + apiKey;

  fetch(locOnecallQueryUrl)
  .then(function (response) {
    if (!response.ok) {
      throw response.json();
    }

    return response.json();
  })
  .then(function (locRes) {

    if (locRes.daily.length == 0) {
      console.log('No results found!');
      resultContentEl.innerHTML = '<h3>No results found, search again!</h3>';
    } else {

      printTodayResults(city, locRes);

   }
  })
  .catch(function (error) {
    console.error(error);
  });

}

function handleSearchFormSubmit(event) {
  event.preventDefault();

  var searchInputVal = document.querySelector('#search-input').value;

  if (!searchInputVal) {
    console.error('You need a search input value!');
    return;
  }

  searchApi(searchInputVal);
}

function handleSearchHistorySubmit(event) {
  event.preventDefault();

  var element = event.target;

  if (element.matches("button")) {
    var city = element.getAttribute("data-name");
  }

  searchApi(city);
}

getLocalStorage();

searchFormEl.addEventListener('submit', handleSearchFormSubmit);
searchHistoryEl.addEventListener('click', handleSearchHistorySubmit);


