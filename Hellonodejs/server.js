var http = require('http');
var url=require('url');
var fs=require('fs');
var querystring = require('querystring');
var config = require("./config");
const path = require('path');


function startServer(route,handle){
    var onRequest = function(request,response){
        var pathname = url.parse(request.url).pathname;
        
        console.log('Request received '+ pathname);
        route(handle,pathname,request,response);
        

    
    };
       
    
    
    var server = http.createServer(onRequest).listen(config.listen);
    
    
    console.log(`Server started on port 3000`);

}



module.exports.startServer = startServer;
