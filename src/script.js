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
let year = now.getFullYear();
let minutes = now.getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`;
}
let currentDayTime = document.querySelector("#current-day-time");
let updateTime = document.querySelector("#timestamp");
currentDayTime.innerHTML = `${weekday} ${hour}:${minutes}`;
updateTime.innerHTML = `${hour}:${minutes} ${month} ${theDate}, ${year}`;

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

function retrieveWx(wxData) {
  console.log(wxData);
  tempF = Math.round(wxData.data.main.temp);
  tempC = Math.round(((wxData.data.main.temp - 32) * 5) / 9);
  let RH = wxData.data.main.humidity;
  let tempIndex = Math.round(wxData.data.main.feels_like);
  let wxDescription = wxData.data.weather[0].description;
  let windSpeed = Math.round(wxData.data.wind.speed);
  let windGust = Math.round(wxData.data.wind.gust);
  let wxIcon = wxData.data.weather[0].icon;
  console.log(
    `temp is ${tempF}°F, RHis ${RH}%, feels like ${tempIndex}°F, conditions is ${wxDescription}, wind speed is ${windSpeed} mph`
  );

  document.querySelector(".city-description").innerHTML = `${wxDescription} in`;
  document.querySelector("#city-name").innerHTML = wxData.data.name;
  document.querySelector("#current-temp").innerHTML = tempF;
  document.querySelector("#humidity").innerHTML = `${RH}%`;
  document.querySelector("#windspeed").innerHTML = `${windSpeed} mph`;
  document
    .querySelector("#wx-icon")
    .setAttribute("src", `http://openweathermap.org/img/wn/${wxIcon}.png`);
  document.querySelector("#wx-icon").setAttribute("alt", `${wxDescription}`);
}

function toDegreesC(event) {
  event.preventDefault();
  let displaytemp = document.querySelector("#current-temp");
  displaytemp.innerHTML = `${tempC}`;
  unitC.classList.add("active-units");
  if (unitF.classList.contains("active-units")) {
    unitF.classList.remove("active-units");
  }
}

function toDegreesF(event) {
  event.preventDefault();
  let displaytemp = document.querySelector("#current-temp");
  displaytemp.innerHTML = `${tempF}`;

  if (unitF.classList.contains("active-units")) {
    null;
  } else {
    unitF.classList.add("active-units");
  }
  if (unitC.classList.contains("active-units")) {
    unitC.classList.remove("active-units");
  }
}

let degreesFtoC = document.querySelector(".degreesC");
degreesFtoC.addEventListener("click", toDegreesC);

let degreesCtoF = document.querySelector(".degreesF");
degreesCtoF.addEventListener("click", toDegreesF);

let unitC = document.querySelector(".degreesC");
let unitF = document.querySelector(".degreesF");

// function retrieveWxFcst(wxDataFcst) {
//   console.log(wxDataFcst);
//   let temp = Math.round(Fcst.data.main.temp);
//   let wxIcon = Fcst.data.weather[0].icon;

//   document.querySelector(".city-condition").innerHTML = `${wxDescription} in`;
//   document.querySelector("#city-name").innerHTML = Fcst.data.name;
//   document
//     .querySelector("#wx-icon-day2")
//     .setAttribute("src", `http://openweathermap.org/img/wn/${wxIcon-day2}.png`);
//   //document.querySelector("#windgust").innerHTML = windGust;
//   //document.querySelector("#precipitaion").innerHTML = "NA";
// }

function getPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}
let buttonLocation = document.querySelector("#button-location");
buttonLocation.addEventListener("click", getPosition);

//on load, search for a defualt city
search("New York");
