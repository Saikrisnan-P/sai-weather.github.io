import { loadData, httpCall } from "./httpsfunctions.js"; //Promise for http
//Whole file as an IIFE
(async function() {             
  let cityip = document.getElementById("city");
  let cityName = "kolkata";
  let monthStrings = {
    1: "JAN",
    2: "FEB",
    3: "MAR",
    4: "APR",
    5: "MAY",
    6: "JUN",
    7: "JUL",
    8: "AUG",
    9: "SEP",
    10: "OCT",
    11: "NOV",
    12: "DEC",
  };

  let selectedCityJsonData;
  var nextHours;
  let timeZone = 'Asia/Kolkata'; 

  //Vars declaration above

  class City {
    constructor(individualData) {
      this.cityName = individualData.cityName;
      this.dateAndTime = individualData.dateAndTime;
      this.timeZone = individualData.timeZone;
      this.temperature = individualData.temperature;
      this.humidity = individualData.humidity;
    }
    getContinentName() {
      return this.timeZone.split("/")[0];
    }
    getDate() {
      let temporaryDate = this.dateAndTime.split(",")[0].split("/");
      return (
        temporaryDate[1] +
        "-" +
        monthStrings[temporaryDate[0]] +
        "-" +
        temporaryDate[2]
      );
    }
    getTime() {
      return this.dateAndTime.split(", ")[1];
    }
    getCelcius(){
      return parseInt(this.temperature) +" C";
    }
    getFarenheit() {
      let cel = parseInt(this.temperature);
      let far = Math.round(cel * (9 / 5) + 32);
      return far + " F";
    }
  }

  //main City base class
  class CityCards extends City {
    constructor(individualData) {
      super(individualData);
      this.precipitation = individualData.precipitation;
      this.nextFiveHours = individualData.nextFiveHrs;
    }
    //constucts html literals for top city cards
    getCardsHTML() {
      return `<div class="tCity"> 
                        <div class="flex1Items">                  
                            <div class="citname">${this.cityName}</div>
                            <div class="cittime">${this.getTime()}</div>
                            <div class="citdate">${this.getDate()}</div>
                            <div class="cithum"><img src="assets/Weather Icons/humidityIcon.svg" alt="weather"><span class="hpValue">${
                              this.humidity
                            }</span></div>
                            <div class="citwind"><img src="assets/Weather Icons/precipitationIcon.svg" alt="weather"><span class="hpValue">${
                              this.precipitation
                            }</span></div>
                        </div>
                        <div class="flex2Items">
                            <img id="citweat" src="assets/Weather Icons/${weatherIcon}.svg" alt="weather">
                            <div class="deg">${this.temperature}</div>
                        </div>
                    </div> `;
    }

    //constucts html literals for continent wise grid cards
    getGridHTML() {
      return `<div class="gBox">
            <div class="gridConti">${this.getContinentName()}</div>
            <div class="gridTemp">${this.temperature}</div>
            <div class="gridCity">${this.cityName + "," + this.getTime()}</div>
            <div class="gridHumi"><img src="assets/Weather Icons/humidityIcon.svg" alt="weather">${
              this.humidity
            }</div>
          </div>
          `;
    }

    //Returns city Icon path for top city cards background
    getBG() {
      return `url('assets/Icons for cities/' + ${this.cityName.toLowerCase()} + '.svg')`;
    }
  }
  
  //These two are global vars as they are used in selectedCity
  let currHour; //function and also setDateTime function
  let meridien; 
  //whenever city name is changed
  function selectedCityFunction(cityName) {
    let cityIcon = document.querySelector(".cityIcon");

    if (cityName === "") {
      cityIcon.src ="assets/General Images & Icons/warning.svg";
    } else {
      cityIcon.src ="assets/Icons for cities/" + cityName.toLowerCase() + ".svg";
      timeZone = selectedCityJsonData.timeZone;
      setDateTime();

      document.querySelector(".c").innerHTML = selectedCityJsonData.getCelcius();
      document.querySelector(".f").innerHTML = selectedCityJsonData.getFarenheit();

      document.querySelector(".humidity").innerHTML =
        parseInt(selectedCityJsonData.humidity) +
        '<span style="color:#777;">%</span>';
      document.querySelector(".precipitation").innerHTML =
        parseInt(selectedCityJsonData.precipitation) +
        '<span style="color:#777;">%</span>';
      
      updateForecast(meridien, currHour);
  }
  }
  
  //Dom manipulates the hourly forecast section
  var updateForecast = function(meridien, currHour){
    let nextTemp = document.querySelectorAll("#htemp");
    let nextImg = document.querySelectorAll("#image");
    let seriesHour = document.querySelectorAll("#period");
    let hourlyTemp = document.querySelectorAll("#htemp");

    //hourly update below
    hourlyTemp[0].innerHTML = parseInt(selectedCityJsonData.getCelcius());
    for (let i = 1; i < 6; i++) {
      hourlyTemp[i].innerHTML = parseInt(nextHours[i - 1]);
    }
    for (let i = 0; i < 6; i++) {
      if ((parseInt(currHour) + i == 12) && i!=0) {
        meridien = meridien === "AM" ? "PM" : "AM";
      }
      if (parseInt(currHour) + i > 12) {
        currHour = 1 - i;  //Beyond 12 curr hour currHour is mad(-i+1) so 1,2 ..
      }
      if (nextTemp[i].innerHTML <= 18) {
        nextImg[i].src = "assets/Weather Icons/rainyIcon.svg";
      } else if (nextTemp[i].innerHTML > 18 && nextTemp[i].innerHTML <= 22) {
        nextImg[i].src = "assets/Weather Icons/cloudyIcon.svg";
      } else if (nextTemp[i].innerHTML < 22 && nextTemp[i].innerHTML <= 29) {
        nextImg[i].src = "assets/Weather Icons/windyIcon.svg";
      } else {
        nextImg[i].src = "assets/Weather Icons/sunnyIcon.svg";
      }
      if (i !== 0) {
        seriesHour[i].innerHTML = parseInt(currHour) + i + " " + meridien;
      }
    }
  }

  //DOM mainpulates the date and time
  var setDateTime = function(){  
    let time = document.getElementById("time"),
    timeSec = document.getElementById("timeSec"),
    preDate = document.querySelector(".preDate"),
    amPm = document.querySelector(".am");

    let dynamicTime = new Date().toLocaleString("en-US", {timeZone: `${timeZone}`}); //whole date and time
    let date = dynamicTime.split(", ")[0].split("/");
    let interimtime= dynamicTime.split(", ")[1].split(":");
    preDate.innerHTML = date[1] + "-" + monthStrings[date[0]] + "-" + date[2]; //Updates date
    time.innerHTML = interimtime[0] + ":" + interimtime[1] + ":";
    timeSec.innerHTML = interimtime[2].split(" ")[0];
    currHour = interimtime[0];
    meridien = interimtime[2].split(" ")[1];
    if(meridien=="AM"){
      amPm.src="assets/General Images & Icons/amState.svg";
    }
    else {
      amPm.src="assets/General Images & Icons/pmState.svg";
    }
  }

  let setPeriodicDateTime = setInterval(function () {
    setDateTime();
  },1000);

  let cityObject;

  //function consisting of hhtprequests for the first section
  try{
    cityObject = await httpCall(cityName);
      console.log(cityObject);
      console.log(Object.keys(cityObject));
      selectedCityJsonData = new CityCards(cityObject.currentCity);
      nextHours = cityObject.hourlyForecast;
      selectedCityFunction(cityName);
  }
  catch(e){
    console.log(`Following error occured: ${e}`);
  }

  //On clicking on the city list box the value gets deleted
  cityip.addEventListener("click",function () {
    this.value="";
  });
  //whenever selected city is changed needed function is called
  cityip.addEventListener("input",function() {
    cityChangeListener(this.value);
  });

  let cityChangeListener = async function(cityName){
    if(cityName!=""){
      try{
        cityObject = await httpCall(cityName);
          console.log(cityObject);
          selectedCityJsonData = new CityCards(cityObject.currentCity);
          nextHours = cityObject.hourlyForecast;
          selectedCityFunction(cityName);
      }
      catch(e){
        console.log(`Following error occured: ${e}`);
      }
    }
  }
  
  let periodicHttpCall = setInterval(async function () {
    try{
      cityObject = await httpCall("Kolkata");
        console.log(cityObject);
        selectedCityJsonData = new CityCards(cityObject.currentCity);
        nextHours = cityObject.hourlyForecast;
        selectedCityFunction();
       //For first time loading current data
    }
    catch(e){
      console.log(`Following error occured: ${e}`);
    }
  }, 3600000);

  /*              Second Section               */
  let mySun = document.getElementById("sun");
  let mySnow = document.getElementById("snow");
  let myRain = document.getElementById("rain");
  let leftButton = document.querySelector("#leftArrow");
  let rightButton = document.querySelector("#rightArrow");
  let weatherIcon = "sunnyIcon"; //weather Icon for user preferred cards
  let spinnNumber = document.querySelector("#top_ip");
  let TopCities = document.querySelector(".topcities");
  let presentData = [];
  let tCity ;
  let userPrefCities = [];
  let continentCities = [];

  userPrefCities.sort(function (a, b) {
    return parseInt(a.temperature) - parseInt(b.temperature);
  });

  function sunnyCondition(ele) {
    return (
      parseInt(ele.temperature) >= 29 &&
      parseInt(ele.humidity) < 50 &&
      parseInt(ele.precipitation) >= 50
    );
  }
  function snowyCondition(ele) {
    return (
      parseInt(ele.temperature) >= 20 &&
      parseInt(ele.temperature) <= 28 &&
      parseInt(ele.humidity) >= 50 &&
      parseInt(ele.precipitation) <= 50
    );
  }
  function rainyCondition(ele) {
    return parseInt(ele.temperature) < 20 && parseInt(ele.humidity) >= 50;
  }
  mySun.style.borderBottom = "thick solid blue";

  var userPrefSectionObj = {
    //function for selecting the onclicked icon filtering out cities based on condition
    doWeatherJob : function(weather, CurrWeatherIcon, condition) {
      mySun.style.borderBottom = "none";
      mySnow.style.borderBottom = "none";
      myRain.style.borderBottom = "none";
      weatherIcon = weather;
      CurrWeatherIcon.style.borderBottom = "thick solid blue";
      presentData = userPrefCities.filter(condition);
      addCards();
    },
    //scroll function where scroll implementation are held
    sideScroll: function (element, direction, speed, distance, step) {
      scrollAmount = 0;
      let slideTimer = setInterval(function () {
        if (direction == "left") {
          element.scrollLeft -= step;
          element.scrollBehaviour = "smooth";
        } else {
          element.scrollLeft += step;
        }
        scrollAmount += step;
        if (scrollAmount >= distance) {
          window.clearInterval(slideTimer);
        }
      }, speed);
    },
    //function to hide and display the scroll buttons
    toggleButtons: function () {
      if (TopCities.clientWidth >= TopCities.scrollWidth) {
        leftButton.style.display = "none";
        rightButton.style.display = "none";
      } else {
        leftButton.style.display = "block";
        rightButton.style.display = "block";
      }
    },
  };

  mySun.addEventListener("click", function () {
    userPrefSectionObj.doWeatherJob("sunnyIcon", mySun, sunnyCondition);
  });

  mySnow.addEventListener("click", function () {
    userPrefSectionObj.doWeatherJob("snowflakeIcon", mySnow, snowyCondition);
  });

  myRain.addEventListener("click", function () {
    userPrefSectionObj.doWeatherJob("rainyIcon", myRain, rainyCondition);
  });  

  //Adds user prefered top city cards
  function addCards() {
    let minVal = 3;
    minVal = presentData.length < spinnNumber.value ? presentData.length
        : spinnNumber.value;

    TopCities.innerHTML = "";
    for (let k = 0; k < minVal; k++) {
      TopCities.innerHTML += presentData[k].getCardsHTML();
    }
    let currentCity = document.querySelectorAll(".tcity");
    for (let h = 0; h < minVal; h++) {
      currentCity[h].style.backgroundImage =
        "url('assets/Icons for cities/" +
        presentData[h].cityName.toLowerCase() +
        ".svg')";
    }
    userPrefSectionObj.toggleButtons();
    //Dynamic change of selected city on clicking on particular card
    tCity = document.querySelectorAll(".tCity");
    for(let i=0;i<tCity.length;i++)
    {
      let citName = tCity[i].querySelector(".citname");
      tCity[i].addEventListener('click',function(){
        cityChangeListener(citName.innerHTML);
        cityip.value=citName.innerHTML;
      });
    }
  }

  spinnNumber.addEventListener("input", function () {
    addCards();
  });

  let scrollAmount = 0;

  rightButton.onclick = function () {
    userPrefSectionObj.sideScroll(TopCities, "right", 20, 200, 10);
  };
  leftButton.onclick = function () {
    userPrefSectionObj.sideScroll(TopCities, "left", 20, 150, 10);
  };

  
  /*      ------------Third section-----------       */
  let gridContainer = document.querySelector(".gridBoxes");

  //grid cards addition function
  function addGridCitites() {
    gridContainer.innerHTML = " ";
    for (let j = 0; j < 12; j++) {
      gridContainer.innerHTML += continentCities[j].getGridHTML();
    }
  }

  //Loads the main json object file consisting of all the cities data for user pref area 
  //and continent cities
  try
  {    
    userPrefCities = [];
    continentCities = [];
    var response = await loadData();
    for (let idata in response) {
      userPrefCities.push(new CityCards(response[idata]));
      continentCities.push(new CityCards(response[idata]));
    }
    userPrefSectionObj.doWeatherJob("sunnyIcon", mySun, sunnyCondition);
    addGridCitites();
  }
  catch(e){
    console.log(`Error occured ${e}`);
  } 

  //Loads the whole city json objects once in every four hours
  let periodicLoadData = setInterval(async function () {
    try
    {    
      userPrefCities = [];
      continentCities = [];
      response = await loadData();
      console.log(response);
      for (let idata in response) {
        userPrefCities.push(new CityCards(response[idata]));
        continentCities.push(new CityCards(response[idata]));
      }
      userPrefSectionObj.doWeatherJob("sunnyIcon", mySun, sunnyCondition);
      addGridCitites();
    }
    catch(e){
      console.log(`Error occured ${e}`);
    }
  }, 14400000); 

  let tempArrow = document.querySelector(".tempArrow");
  let contArrow = document.querySelector(".contArrow");
  let tempToggle = document.querySelector(".temperatureToggle");
  let contToggle = document.querySelector(".continentToggle");

  //sorting based on continent name
  contToggle.addEventListener("click", function () {
    continentCities.reverse();

    if (contArrow.src.split('/').slice(-1) =="arrowDown.svg") {
      continentCities.sort(function (a, b) {
        if (a.timeZone.split("/")[0] < b.timeZone.split("/")[0]) return 1;
        else return -1;
      });
      contArrow.src =
        "assets/General Images & Icons/arrowUp.svg";
    } else {
      continentCities.sort(function (a, b) {
        if (a.timeZone.split("/")[0] > b.timeZone.split("/")[0]) return 1;
        else return -1;
      });

      contArrow.src =
        "assets/General Images & Icons/arrowDown.svg";
    }
    addGridCitites();
  });

  //sorting based on temperature inside continent name order
  tempToggle.addEventListener("click", function () {
    if (tempArrow.src.split('/').slice(-1) =="arrowUp.svg") {
      continentCities.sort(function (a, b) {
        if (a.timeZone.split("/")[0] == b.timeZone.split("/")[0]) {
          if (parseInt(a.temperature) > parseInt(b.temperature)) return -1;
          else return 0;
        } else return 0;
      });
      tempArrow.src =
        "assets/General Images & Icons/arrowDown.svg";
    } else {
      continentCities.sort(function (a, b) {
        if (a.timeZone.split("/")[0] == b.timeZone.split("/")[0]) {
          if (parseInt(a.temperature) < parseInt(b.temperature)) return -1;
          else return 0;
        } else return 0;
      });
      tempArrow.src =
        "assets/General Images & Icons/arrowUp.svg";
    }
    addGridCitites();
  });

}) ()