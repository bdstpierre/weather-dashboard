var resultTextEl = document.querySelector('#result-text');
var resultContentEl = document.querySelector('#result-content');
var searchFormEl = document.querySelector('#search-form');
var cityList = [];

function getLocalStorage(){
  // We want to get the cities from the local storage, if there are any
  // This also populates the data object
  cityList = JSON.parse(localStorage.getItem("cityList"));
  if (cityList !== null) {
      // cityEl holds all of the divs with the class of "description"
      var cityEl = document.querySelector('.history');
      // Add the data to the list
      for (var i = 0; i < cityList.length; i++) {
          // The children of these particular divs need to be clickable elements
          cityEl[i].children[0].value = cityList[i]; 
      }
  }
}


function getParams() {
  // Get the search params out of the URL (i.e. `?q=london&format=photo`) and convert it to an array (i.e. ['?q=london', 'format=photo'])
  var searchParamsArr = document.location.search.split('&');

  // Get the query and format values
  var query = searchParamsArr[0].split('=').pop();
  var format = searchParamsArr[1].split('=').pop();

  searchApi(query, format);
}

function printTodayResults(resultObj) {
  console.log(resultObj);

  // set up `<div>` to hold result content
  var resultCard = document.createElement('div');
  resultCard.classList.add('card', 'bg-light', 'text-dark', 'mb-3', 'p-3');

  
  var resultHeader = document.createElement('div');
  resultHeader.classList.add('card-header', 'bg-light', 'text-dark', 'p-3');

  var date = moment.unix(resultObj.dt + resultObj.timezone).format(" (M/D/YYYY) ");
  var mediaContent = document.createElement('div');
  mediaContent.classList.add('media');
  mediaBody = document.createElement('div');
  mediaBody.classList.add('media-body');
  var titleHeader = document.createElement('h2');
  titleHeader.textContent = resultObj.name + date;
  mediaBody.append(titleHeader);
  
  var titleIcon = document.createElement('img');
  titleIcon.classList.add('float-right', 'img-thumbnail', 'mr-3');
  titleIcon.src = "http://openweathermap.org/img/wn/"+resultObj.weather[0].icon+"@2x.png";
  mediaContent.append(mediaBody, titleIcon);
  resultHeader.append(mediaContent);

  resultCard.append(resultHeader);

  var resultBody = document.createElement('ul');
  resultBody.classList.add('list-group','list-group-flush', 'list-unstyled');
  var tempList = document.createElement('li');
  tempList.classList.add('list-group-item)', 'p-1');
  tempList.textContent = "Temp: " + resultObj.main.temp + " °F"
  var windList = document.createElement('li');
  windList.classList.add('list-group-flush', 'p-1');
  windList.textContent = "Wind: " + resultObj.wind.speed + " MPH";
  var humidList = document.createElement('li');
  humidList.classList.add('list-group-flush', 'p-1');
  humidList.textContent = "Humidity: " + resultObj.main.humidity + " %";
  var uvList = document.createElement('li');
  uvList.classList.add('list-group-flush', 'p-1');
  uvList.textContent = "UV Index: " + 6;
  resultBody.append(tempList, windList, humidList, uvList);
  
  resultCard.append(resultBody);

  resultContentEl.append(resultCard);
}

function searchApi(query) {
  // API Documentation:
  // api.openweathermap.org/data/2.5/weather?q={city name}&appid=ae645017a7275733894562a7a4d6f737
  // api.openweathermap.org/data/2.5/forecast/daily?q={city name}&cnt=5&appid=ae645017a7275733894562a7a4d6f737
  var locQueryUrl = 'https://api.openweathermap.org/data/2.5/weather';
  var locDailyQueryUrl = 'https://api.openweathermap.org/data/2.5/forecast/daily';
  var apiKey = '&units=imperial&appid=ae645017a7275733894562a7a4d6f737';

  locQueryUrl = locQueryUrl + '?q=' + query + apiKey;

  console.log(locQueryUrl);

  fetch(locQueryUrl)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }

      return response.json();
    })
    .then(function (locRes) {
      // write query to page so user knows what they are viewing
      //resultContentEl.textContent = locRes.name;

      console.log(locRes);
      console.log(locRes.name.length);

      if (!locRes.name.length) {
        console.log('No results found!');
        resultContentEl.innerHTML = '<h3>No results found, search again!</h3>';
      } else {
        resultContentEl.textContent = '';
        printTodayResults(locRes);
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

searchFormEl.addEventListener('submit', handleSearchFormSubmit);

// getParams();
