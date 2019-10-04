var http = require('http');
var url=require('url');
var fs=require('fs');
var querystring = require('querystring');
var config = require("./config");
const path = require('path');


function startServer(route,handle){
    var onRequest = function(request,response){
        var pathname = url.parse(request.url).pathname;
        var query= url.parse(request.url).query;
        console.log('Request received '+ pathname);
        var data ='';
        request.on("error",function(err){
            console.error(err);
        }).on('data',function(chunk){
            data += chunk;

        }).on('end',function(){
            if(request.method==="POST"){
                route(handle,pathname,response,querystring.parse(data));
            }else{
                var query = url.parse(request.url,true).query;

                route(handle,pathname,response,query);
            }
            
        });
       
    
    }
    var server = http.createServer(onRequest);
    
    server.listen(3000);
    console.log('Server has created!');




}
module.exports.startServer = startServer;
