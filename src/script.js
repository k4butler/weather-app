function getTime(timestamp) {
  let allMonths = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  let allDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let now = new Date(timestamp * 1000);
  let month = allMonths[now.getMonth()];
  let weekday = allDays[now.getDay()];
  let theDate = now.getDate();
  let hour = now.getHours();

  let year = now.getFullYear();
  let minutes = now.getMinutes();

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  if (hour < 12) {
    minutes = `${minutes} AM`;
    if (hour == 0) {
      hour = 12;
    }
  } else {
    minutes = `${minutes} PM`;
    if (hour != 12) {
      hour = hour - 12;
    }
  }

  let currentDayTime = document.querySelector("#current-day-time");
  let updateTime = document.querySelector("#timestamp");
  currentDayTime.innerHTML = `Conditions as of ${hour}:${minutes} ${weekday}:`;
  updateTime.innerHTML = `Last upate: ${hour}:${minutes} ${month} ${theDate}, ${year}`;
  console.log(`${weekday} ${hour}:${minutes}`);
}

function search(city) {
  //Now get Wx Data by City Name
  let ApiEndpoint = `https://api.openweathermap.org/data/2.5/weather?`;
  let wxKey = `28ae6024d5ca8fdbf0e5b7d7fe38ed95`;
  let units = `imperial`;
  let ApiUrlCity = `${ApiEndpoint}q=${city}&appid=${wxKey}&units=${units}`;
  //console.log(ApiUrlCity);
  axios.get(ApiUrlCity).then(retrieveWx);
}

function cityName(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  search(city);
}

//User entered City Name
let searchForm = document.querySelector(".city-search-form");
searchForm.addEventListener("submit", cityName);
//console.log(searchForm);

function showPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  // console.log(position.coords.latitude);
  let ApiEndpoint = `https://api.openweathermap.org/data/2.5/weather?`;
  let wxKey = `28ae6024d5ca8fdbf0e5b7d7fe38ed95`;
  let units = `imperial`;
  let ApiUrlGeo = `${ApiEndpoint}&lat=${latitude}&lon=${longitude}&appid=${wxKey}&units=${units}`;

  console.log(ApiUrlGeo);

  axios.get(ApiUrlGeo).then(retrieveWx);
  // axios.get(ApiUrlGeo).then(retrieveWxFcst);
}

let tempF = null;
let tempC = null;
let feelsLikeTempF = null;
let feelsLikeTempC = null;

function retrieveWx(wxData) {
  console.log(wxData);
  tempF = Math.round(wxData.data.main.temp);
  tempC = Math.round(((wxData.data.main.temp - 32) * 5) / 9);
  feelsLikeTempF = Math.round(wxData.data.main.feels_like);
  feelsLikeTempC = Math.round(((wxData.data.main.feels_like - 32) * 5) / 9);
  let RH = wxData.data.main.humidity;
  let wxDescription = wxData.data.weather[0].description;
  let windSpeed = Math.round(wxData.data.wind.speed);
  let wxIcon = wxData.data.weather[0].icon;

  document.querySelector(".city-description").innerHTML = `${wxDescription} in`;
  document.querySelector("#city-name").innerHTML = wxData.data.name;
  document.querySelector("#current-temp").innerHTML = tempF;
  document.querySelector("#feels-like").innerHTML = feelsLikeTempF;
  document.querySelector("#humidity").innerHTML = `${RH}%`;
  document.querySelector("#windspeed").innerHTML = `${windSpeed} mph`;
  document
    .querySelector("#wx-icon")
    .setAttribute("src", `http://openweathermap.org/img/wn/${wxIcon}.png`);
  document.querySelector("#wx-icon").setAttribute("alt", `${wxDescription}`);

  getTime(wxData.data.dt);

  getForecast(wxData.data.coord);
}

function getForecast(coordinates) {
  console.log(coordinates);

  let ApiEndpoint = `https://api.openweathermap.org/data/2.5/onecall?`;
  let wxKey = `28ae6024d5ca8fdbf0e5b7d7fe38ed95`;
  let units = `imperial`;
  let latitude = coordinates.lat;
  let longitude = coordinates.lon;
  let exclude = `hourly,minutely,alerts`;

  let ApiUrlForecast = `${ApiEndpoint}&lat=${latitude}&lon=${longitude}&exclude=${exclude}&appid=${wxKey}&units=${units}`;
  console.log(ApiUrlForecast);
  axios.get(ApiUrlForecast).then(displayForecast);
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  console.log(response.data.daily);
  forecastData = response.data.daily;

  let forecastHTML = "";
  forecastHTML = forecastHTML + `<div class="row">`;

  forecastData.forEach(function (forecastDay, index) {
    if (index < 6) {
      let theDay = formatDay(forecastDay.dt);
      if (index < 1) {
        theDay = "Today";
      }
      forecastHTML =
        forecastHTML +
        `<div class="daily-forecast col-2">
              <ul>
                <li>
                ${theDay}
                </li>
                <li class="daily-icon"><img src="http://openweathermap.org/img/wn/${
                  forecastDay.weather[0].icon
                }@2x.png" alt="" width="40" /></li>
                <li>
                  <span class="hi-temp">${Math.round(
                    forecastDay.temp.max
                  )}°</span>
                  <span class="low-temp"> / ${Math.round(
                    forecastDay.temp.min
                  )}°</span>
                </li>
              </ul>
            </div>`;
    }
  });

  forecastHTML = forecastHTML + ` </div>`;
  document.querySelector("#forecast").innerHTML = forecastHTML;
}

function convertTemp(event) {
  event.preventDefault();
  let displayTemp = document.querySelector("#current-temp");
  let displayFeelsLikeTemp = document.querySelector("#feels-like");
  let forecastHiTemps = document.querySelectorAll("span.hi-temp");
  let forecastLowTemps = document.querySelectorAll("span.low-temp");
  console.log(
    `Testing if i still have access to day 1 MaxT: ${forecastData[0].temp.max}`
  );

  //degreesFtoC
  if (unitF.classList.contains("active-units")) {
    //working
    displayTemp.innerHTML = `${tempC}`;
    displayFeelsLikeTemp.innerHTML = `${feelsLikeTempC}`;
    //not displaying
    console.log(`Testing again to day 1 MaxT: ${forecastData[0].temp.max}`);
    forecastData.forEach(function (forecastTemp, index) {
      
      if (index < 6){
      forecastHiTemps[index].innerHTML = `${Math.round(
        ((forecastTemp.temp.max - 32) * 5) / 9
      )}°`;
      forecastLowTemps[index].innerHTML = ` | ${Math.round(
        ((forecastTemp.temp.min - 32) * 5) / 9
      )}°`;
      }
    });
    
    unitF.classList.remove("active-units");
    unitF.classList.add("inactive-units");
    unitC.classList.add("active-units");
    unitC.classList.remove("inactive-units");
  } else {
    //degreesCtoF
    displayTemp.innerHTML = `${tempF}`;
    displayFeelsLikeTemp.innerHTML = `${feelsLikeTempF}`;

    //not displaying
    forecastData.forEach(function (forecastTemp, index) {
        if (index < 6){
      forecastHiTemps[index].innerHTML = `${Math.round(
        forecastTemp.temp.max
      )}°`;
      forecastLowTemps[index].innerHTML = ` | ${Math.round(
        forecastTemp.temp.min
      )}°`;
        }
    });

    unitC.classList.remove("active-units");
    unitC.classList.add("inactive-units");
    unitF.classList.add("active-units");
    unitF.classList.remove("inactive-units");
  }
}

let degreesFtoC = document.querySelector(".degreesC");
degreesFtoC.addEventListener("click", convertTemp);

let degreesCtoF = document.querySelector(".degreesF");
degreesCtoF.addEventListener("click", convertTemp);

let unitC = document.querySelector(".degreesC");
let unitF = document.querySelector(".degreesF");

let forecastData = [];

function getPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}
let buttonLocation = document.querySelector("#button-location");
buttonLocation.addEventListener("click", getPosition);

//on load, search for a defualt city
search("New York");
