var fs = require('fs');
var config = require('./config');


function route(handle,pathname,request,response,query){
    console.log('Routing a request for '+pathname);
    

    if (typeof handle[pathname]==='function'){
        handle[pathname](request,response,query);

    }else if(/static/.test(pathname)){
        handle['/static'](request,response);
        
    }
    else{
            response.writeHead(200,{'Content-Type':'text/html'});
            fs.createReadStream(__dirname + '/404.html','utf8').pipe(response);

    }

}
module.exports.route = route;
