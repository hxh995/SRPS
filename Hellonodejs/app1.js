var http = require('http');




function onRequest(request,response){
    response.writeHead(200,{'Content-Type':'text/plain'});

    response.write("Hello from out application");
    response.end();

    

}

var server = http.createServer(onRequest).listen(6550);