/* Primary file for the API*/

/*dependencies*/
var http = require('http') ;
var https = require('https') ;
var url = require('url') ;
var StringDecoder = require('string_decoder').StringDecoder ;
var config = require('./lib/config') ;
var fs = require('fs') ;
var _data = require('./lib/data') ;
var handlers = require('./lib/handlers')
var helpers = require('./lib/helpers') ;


//instantiating the http server
var httpServer = http.createServer(function(req,res){
    unifiedServer(req,res) ;
}) ;
httpServer.listen(config.httpPort,function(){
    console.log("the server is listening to port:"+config.httpPort) ;
}) ;

//instantiating the https server
var httpsServerOptions = {
    'key':fs.readFileSync('./https/key.pem'),
    'cert':fs.readFileSync('./https/cert.pem')
} ;
var httpsServer = https.createServer(httpsServerOptions,function(req,res){
    unifiedServer(req,res) ;
}) ;
httpsServer.listen(config.httpsPort,function(){
    console.log("the server is listening to port:"+config.httpsPort) ;
}) ;


//all the server logic for both http and https
var unifiedServer = function(req,res){
    var parsedURL = url.parse(req.url,true) ;
    var path = parsedURL.pathname ;
    var trimmedPath = path.replace(/^\/+|\/+$/g,'') ;
    var queryStringObject = parsedURL.query ;
    var method = req.method.toLowerCase() ;
    var headers = req.headers  ;

    var decoder = new StringDecoder('utf-8') ;
    var buffer = '' ;
    //if payload is present then this event is called
    req.on('data',function (data) {
        buffer+= decoder.write(data) ;
    }) ;
    //its always called
    req.on('end',function(){
        buffer+=decoder.end() ;

        var chosenHandler = typeof(router[trimmedPath]) != 'undefined' ?router[trimmedPath]:handlers.notFound ;
        //construct the data object to send to the handler
        var data ={
            'trimmedPath':trimmedPath,
            'queryStringObject':queryStringObject,
            'method':method,
            'headers':headers,
            'payload':helpers.parseJsonToObject(buffer)
        } ;

        chosenHandler(data,function(statusCode,payload){
            statusCode = typeof(statusCode) == 'number'? statusCode: 200 ;
            payload = typeof(payload) =='object'? payload: {} ;
            var payloadString = JSON.stringify(payload) ;
            res.setHeader('Content-type','application/json') ;
            res.writeHead(statusCode) ;
            res.end(payloadString) ;
        }) ;

        //console.log("Request was recieved with this payload "+ buffer) ;
    })   ;
} ;


//defining routers
var router = {
    'ping':handlers.ping,
    'users':handlers.users,
    'tokens':handlers.tokens,
    'checks' : handlers.checks
} 
