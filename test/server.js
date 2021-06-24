const express = require("express");
const app = express();
const port = 3000;

let statusCode, statusMessage;
let responseBody = {
    "error" : ""
};
let devices = '283B96002128';
let v2_commands = 'ls2';

app.all('/*', (req, res) => {
    const url = req.url.split("/");
    var command = url[4].split('&')[0];
/*     console.log( url[1] === 'v2.0' && command !== v2_commands)
    console.log("New Request :" + req.url + " : " + req.method);
    console.log(url) */
    //res.setHeader('Content-Type', "plain/text");

    if(req.method != 'GET') {
        statusCode = 405;
        statusMessage = "Method Not Allowed";
        responseBody["error"] = "Wrong HTTP Method";
        sendRequest(res);
    }
    if(url[1] !== 'v1.0' && url[1] !== 'v2.0') {
        statusCode = 400;
        statusMessage = "Bad Request";
        responseBody["error"] = "Wrong API Version";
        sendRequest(res);
    }
    if(url[2] !== 'device'){
        statusCode = 404;
        statusMessage = "Not Found";
        responseBody["error"] = "Wrong URI";
        sendRequest(res);
    }
    if(url[1] == 'v1.0' && url[4].match(raw/g)) {
        statusCode = 400;
        statusMessage = "Bad Request";
        responseBody["error"] = "Wrong v1 route";
        sendRequest(res);
    }
    if(devices !== url[3]) {
        console.log("hi")
        statusCode = 403;
        statusMessage = "Forbidden";
        responseBody["error"] = "Wrong Device";
        sendRequest(res);
    }
    else {
        statusCode = 200;
        statusMessage = "OK";
        responseBody["error"] = "noerror";
        sendRequest(res);
    }
    if(url[1] === 'v2.0' && command !== v2_commands) {
        // to include 'Wrong v2 route'
        statusCode = 501;
        statusMessage = "Not Implemented";
        responseBody["error"] = "Unsupported V2.x command";
        sendRequest(res);
    }
    else {
        statusCode = 200;
        statusMessage = "OK";
        responseBody["error"] = "noerror";
        sendRequest(res);
    }
});

function sendRequest(res) {
    if(responseBody["error"] !== 'noerror')
        responseBody = ' ';
    res.writeHead(statusCode, statusMessage).send(`${responseBody}`).end();
}

app.listen(port, () => {
    console.log(`Listening @ http://localhost:${port}`);
});