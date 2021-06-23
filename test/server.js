const express = require("express");
const app = express();
const port = 3000;

let statusCode, statusMessage;
let responseBody = {
    "error" : ""
};
let devices = [ '283B96002128' ];
let v2_commands = [ 'ls2' ];

app.all('/*', (req, res) => {
    const url = req.url.split("/");
    if(req.method !== 'GET') {
        statusCode = 405;
        statusMessage = "Method Not Allowed";
        responseBody["error"] = "Wrong HTTP Method";
    }
    else if(url[1] !== 'v1.0' && url[1] !== 'v2.0') {
        statusCode = 400;
        statusMessage = "Bad Request";
        responseBody["error"] = "Wrong API Version";
    }
    else if(url[2] !== 'device'){
        statusCode = 404;
        statusMessage = "Not Found";
        responseBody["error"] = "Wrong URI";
    }
    else if(url[1] == 'v1.0' && url[5].match(raw/g)) {
        statusCode = 400;
        statusMessage = "Bad Request";
        responseBody["error"] = "Wrong v1 route";
    }
    else if(url[1] == 'v2.0') {
        // to include 'Wrong v2 route'
        var command = url[4].split('&')[0];
        if(!v2_commands.find(el => el === command)) {
            statusCode = 501;
            statusMessage = "Not Implemented";
            responseBody["error"] = "Unsupported V2.x command";
        }
        else {
            statusCode = 200;
            statusMessage = "OK";
            responseBody = "noerror";
        }
    }
    else if(!devices.includes(url[3])) {
        statusCode = 403;
        statusMessage = "Forbidden";
        responseBody["error"] = "Wrong Device";
    }
    else {
        statusCode = 200;
        statusMessage = "OK";
        responseBody = "noerror";
    }
    console.log("New Request")
    res.status(statusCode);
    res.setHeader('content-type', 'application/json');
    res.statusMessage = statusMessage;
    if(responseBody["error"] === "noerror") {
        res.json(responseBody);
    }
});

app.listen(port, () => {
    console.log(`Listening @ http://localhost:${port}`);
});