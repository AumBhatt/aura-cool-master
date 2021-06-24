const express =  require('express');
const app = express();
const port = 3000;

app.all('*', function(req, res) {
    console.log('Request : ' + req.url);
    const url = req.url.split('/');
    console.log(url)
    res.setHeader('Content-Type', 'plain/text');
    let resp = getResponse(req.method, url);
    res.statusCode = resp.statusCode;
    res.statusMessage = resp.statusMessage;
    if(resp.errorMessage["error"] !== 'noerror')
        res.send(JSON.stringify(resp.errorMessage));
    res.end();
});

function getResponse(method, url) {
    let response = class {
        constructor(statusCode, statusMessage, errorMessage) {
            this.statusCode = statusCode;
            this.statusMessage = statusMessage;
            this.errorMessage = {
                "error" : errorMessage
            }
        }
    };

    let commands = ['ls2'];
    let devices = ['283B96002128']
// [ '', 'v2.0', 'device', '283B96002128', 'ls2&L1_100' ]
    switch(true) {
        case (method !== 'GET') :
            return new response(405, 'Method Not Allowed', 'Wrong HTTP Method');

        case (url[1] !== 'v1.0' && url[1] != 'v2.0'):
            return new response(400, 'Bad Request', 'Wrong API Version');
        
        case (url[1] === 'v1.0' && url[4].search("raw?command") === -1):
            return new response(400, 'Bad Request', 'Wrong v1 route');

/*         case (url[1] === 'v2.0' && url[4].search("") === -1):
            return new response(400, 'Bad Request', 'Wrong v1 route'); */

        case (url[1] === 'v2.0' && commands.findIndex(el => el === url[4].split('&')[0]) === -1):
            return new response(501, 'Not Implemented', 'Unsupported V2.x command');
        
        case (url[2] !== 'device'):
            return new response(404, 'Not Found', 'Wrong URI');
        
        case (devices.findIndex(el => el === url[3]) === -1):
            return new response(403, 'Forbidden', 'Wrong Device');
        
        default:
            return new response(200, 'OK', 'noerror');
    }

}

app.listen(port, function() {
    console.log("Listening @ 3000");
});