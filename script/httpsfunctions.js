let baseUrl= "https://soliton.glitch.me";
//Loads the main json object file consisting of all the cities data
export let loadData = function()
{ 
     return new Promise((resolve, reject) =>
    {
        try{
            let wholeDatarequestSeconduest = new XMLHttpRequest();
            wholeDatarequestSeconduest.open('GET',`${baseUrl}/all-timezone-cities`);
            wholeDatarequestSeconduest.responseType="json";
            wholeDatarequestSeconduest.send();

            wholeDatarequestSeconduest.onload = function() 
            {
                resolve(wholeDatarequestSeconduest.response);
            }
            wholeDatarequestSeconduest.onerror = function()
            {
                reject("Error occured!");
            }
        }
        catch(e){
            console.log(`Following error occured + ${e}`);
            reject("Error occured!");
        }
    })
}

let cityObject = {};
let singleCityDateTime = function(cityName){
    return new Promise((resolve,reject) => {   
        let cityrequestSeconduest = new XMLHttpRequest(); //Particular city date and time for sending in post method
        cityrequestSeconduest.open('GET',`${baseUrl}?city=${cityName}`);
        cityrequestSeconduest.responseType="json";
        cityrequestSeconduest.send();
        cityrequestSeconduest.onload = function() {
            let singleCityJsonData = cityrequestSeconduest.response;
            singleCityJsonData.hours = 5;
            if(singleCityJsonData.error){
                reject("error has occured,enter valid city name");
            }
            else{
                resolve(singleCityJsonData);
            }
        }
    });
}
export let httpCall = function(cityName){
    return new Promise((resolve, reject) => {
        try{
            loadData().then((resolve) => {
                let currentCityJsonData = resolve;// get the string from the response //data is itself obtained as object
                for(let id=0;id<currentCityJsonData.length;id++)
                {
                    if(cityName.toLowerCase() === currentCityJsonData[id].cityName.toLowerCase()){
                        cityObject.currentCity = currentCityJsonData[id];
                    }
                }
            }); 

            let hourlyrequestSecondues = new XMLHttpRequest(); //Hourly temperature data of particular city
            singleCityDateTime(cityName).then((resolvedData) => {                
                hourlyrequestSecondues.responseType="json";
                hourlyrequestSecondues.open('POST',`${baseUrl}/hourly-forecast`);
                hourlyrequestSecondues.setRequestHeader("Content-Type", "application/json");
                hourlyrequestSecondues.send(JSON.stringify(resolvedData));
                
                hourlyrequestSecondues.onload = function() {
                    cityObject.hourlyForecast = hourlyrequestSecondues.response.temperature;
                    resolve(cityObject);
                } 
            });                         
        }
        catch(e)
        {
            console.log(`Following error : ${e}`);
            reject(`Following error : ${e}`);
        }
    });
}