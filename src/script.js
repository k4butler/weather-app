function toDegreesC() {
  let degreesC = 56;
  let displaytemp = document.querySelector("#current-temp");
  displaytemp.innerHTML = `${degreesC}`;
  let unitC = document.querySelector(".degreesC");
  let unitF = document.querySelector(".degreesF");
  unitC.classList.add("main-units");
  if (unitF.classList.contains("main-units")) {
    unitF.classList.remove("main-units");
  }
}

function toDegreesF() {
  let degreesC = 20;
  let degreesF = Math.round((degreesC * 9) / 5 + 32);
  let displaytemp = document.querySelector("#current-temp");
  displaytemp.innerHTML = `${degreesF}`;
  let unitC = document.querySelector(".degreesC");
  let unitF = document.querySelector(".degreesF");

  if (unitF.classList.contains("main-units")) {
    null;
  } else {
    unitF.classList.add("main-units");
  }
  if (unitC.classList.contains("main-units")) {
    unitC.classList.remove("main-units");
  }
}

let degreesFtoC = document.querySelector(".degreesC");
degreesFtoC.addEventListener("click", toDegreesC);

let degreesCtoF = document.querySelector(".degreesF");
degreesCtoF.addEventListener("click", toDegreesF);

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

let now = new Date();
let month = allMonths[now.getMonth()];
let weekday = allDays[now.getDay()];
let theDate = now.getDate();
let hour = now.getHours();
let minutes = now.getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`;
}
let currentDayTime = document.querySelector("#current-day-time");
currentDayTime.innerHTML = `${weekday} ${hour}:${minutes}`;

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
  let h1 = document.querySelector("h1");
  // console.log(h1);
  h1.innerHTML = cityName;

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
}

function retrieveWx(wxData) {
  console.log(wxData);
  let temp = Math.round(wxData.data.main.temp);
  //let tempDew = wxData.data.main.temp;
  let RH = wxData.data.main.humidity;
  let tempIndex = Math.round(wxData.data.main.feels_like);
  let wxCondition = wxData.data.weather[0].main;
  let windSpeed = Math.round(wxData.data.wind.speed);
  let windGust = Math.round(wxData.data.wind.gust);
  console.log(
    `temp is ${temp}°F, RH is ${RH}%, feels like ${tempIndex}°F, conditions is ${wxCondition}, wind speed is ${windSpeed} mph, gusting to ${windGust}`
  );

  document.querySelector(".city-condition").innerHTML = `${wxCondition} in`;
  document.querySelector("#city-name").innerHTML = wxData.data.name;
  document.querySelector("#current-temperature").innerHTML = temp;
  document.querySelector("#dewpoint").innerHTML = "NA";
  document.querySelector("#humidity").innerHTML = `${RH}%`;
  document.querySelector("#windspeed").innerHTML = `${windSpeed} mph`;
  //document.querySelector("#windgust").innerHTML = windGust;
  //document.querySelector("#precipitaion").innerHTML = "NA";
}

function getPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}
let buttonLocation = document.querySelector("#button-location");
buttonLocation.addEventListener("click", getPosition);

//on load, search for a defualt city
search("New York");
