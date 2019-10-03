var http = require('http');
var url=require('url');
var fs=require('fs');
var querystring = require('querystring');

function startServer(route,handle){
    var onRequest = function(request,response){
        var pathname = url.parse(request.url).pathname;
        
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
                var params = url.parse(request.url,true).query;

                route(handle,pathname,response,params);
            }
            
        });
       
    
    }
    var server = http.createServer(onRequest);
    
    server.listen(3000);
    console.log('Server has created!');




}
module.exports.startServer = startServer;
