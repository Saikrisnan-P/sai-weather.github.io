var fs = require('fs');
var path = require('path');
var express = require('express');
var app = express();
const bodyParser = require("body-parser");
const WebSocket = require('websocket');
const server = require('http').createServer(app);
const router = express.Router();
/*
app.get('/', function (req, res) {
    let filePath = path.join(__dirname,req.url === "/" ? "index.html" : req.url);   
    let extName = path.extname(filePath); let contentType = 'text/html'; 
    switch (extName) {
        case '.css':  contentType = 'text/css';         break;
        case '.js':   contentType = 'text/javascript';  break;
        case '.json': contentType = 'application/json'; break;
        case '.png':  contentType = 'image/png';        break;
        case '.jpg':  contentType = 'image/jpg';        break;
        case '.svg':  contentType = 'image/svg+xml';    break;
    }
    console.log(filePath); filePath = filePath.replace(/%20/g, " ");
    fs.readFile(filePath , (err, content) => {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/html'}); console.log(err.errno);
            console.log(`Error occured : ${err}`); return res.end("404 Not Found");
        }
        else{
            res.writeHead(200, {'Content-Type': contentType}); res.end(content);
        }
    })
})
app.listen(5000);
const wss = new WebSocket.server({server:server});
*/

//reads the data json file for required city
let dataPath = path.join(__dirname, '/assets/files/data.json');
var data = require(dataPath);

app.use(express.static('public'));
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname,"/public/index.html"));
})
app.listen(5500,() => {
    console.log('Server runnning on port 5500');
});


app.get('/all-timezone-cities', (req, res) => {
    res.json(Object.values(data));
})



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/Cities/:city', function(req, res) {
      //console.log('Req params');
      //console.log(req.params.city);
      let cityName = req.params.city.toLowerCase();;

      //console.log(data[cityName].nextFiveHrs);

    res.json(data[cityName]);
});

app.post('/hourly-forecast', function(req, res) {
    console.log('Req params');
    let cityName =  req.body.city.toLowerCase();
    //console.log(data[cityName].nextFiveHrs);

  res.json(data[cityName].nextFiveHrs);
});

//console.log(Object.values(cityData));
//console.log(cityData.nome.toLowerCase());
app.post('/messages', (req, res, next) => {
    const message = {
      id:123,
      text: 'The id number is 123',
    };
    console.log(message);
    res.json(message);
});

app.get('/messages2/:city', function(req, res) {
    const message2 = {
        id:456,
        text: 'The id number is 456',
      };
      let cityName = req.params.city.toLowerCase();

    res.json(message2);
});
