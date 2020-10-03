let baseUrl= "http://localhost:5500";
//Loads the main json object file consisting of all the cities data
export let loadData = function()
{ 
     return new Promise((resolve, reject) =>
    {
        try{
            let wholeDataRequest = new XMLHttpRequest();
            wholeDataRequest.open('GET',`${baseUrl}/all-timezone-cities`);
            wholeDataRequest.responseType="json";
            wholeDataRequest.send();

            wholeDataRequest.onload = function() 
            {
                resolve(wholeDataRequest.response);
            }
            wholeDataRequest.onerror = function()
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
// let singleCityDateTime = function(cityName){
//     return new Promise((resolve,reject) => {   
//         let cityRequest = new XMLHttpRequest(); //Particular city date and time for sending in post method
//         cityRequest.open('GET',`${baseUrl}?city=${cityName}`);
//         cityRequest.responseType="json";
//         cityRequest.send();
//         cityRequest.onload = function() {
//             let singleCityJsonData = cityRequest.response;
//             singleCityJsonData.hours = 5;
//             if(singleCityJsonData.error){
//                 reject("error has occured,enter valid city name");
//             }
//             else{
//                 resolve(singleCityJsonData);
//             }
//         }
//     });
// }
export let httpCall = function(cityName){
    return new Promise((resolve, reject) => {
        try{
            let SingleCityRequest = new XMLHttpRequest();           //single city's related data
            SingleCityRequest.open('GET',`${baseUrl}/Cities/${cityName}`);
            SingleCityRequest.responseType="json";
            SingleCityRequest.send();

            let hourlyRequest = new XMLHttpRequest(); //Hourly temperature data of particular city
            hourlyRequest.responseType="json";
            hourlyRequest.open('POST',`${baseUrl}/hourly-forecast`);
            hourlyRequest.setRequestHeader("Content-Type", "application/json");
            
            SingleCityRequest.onload = () =>{
                //console.log(SingleCityRequest.response);
                cityObject.currentCity=SingleCityRequest.response;
                console.log(cityObject)
                hourlyRequest.send(JSON.stringify({city:cityName}));
            }            
            
            hourlyRequest.onload = () => {
                cityObject.hourlyForecast =  hourlyRequest.response;
                console.log(hourlyRequest.response);
                resolve(cityObject);                    
            }    
        }
        catch(e)
        {
            console.log(`Following error : ${e}`);
            reject(`Following error : ${e}`);
        }
    });
} 


let msg = new XMLHttpRequest();
msg.responseType = 'json';
msg.open('POST', `${baseUrl}/messages`);
msg.setRequestHeader("Content-type", "application/json");
msg.send(JSON.stringify({hello:'All'}));
msg.onload = () =>{
    //console.log("From POST method");
    //console.log(msg.response);
} 

let msg2 = new XMLHttpRequest();
msg2.responseType = 'json';
msg2.open('GET', 'http://localhost:5500/messages2/Kolkata');
msg2.send();
msg2.onload = () =>{
    //console.log(msg2.response);
}

