var fs = require('fs');




function home(response){
    
    response.writeHead(200,{'Content-Type':'text/html'});
            
    fs.createReadStream(__dirname + '/index.html','utf8').pipe(response);

}
function review(response){
    response.writeHead(200,{'Content-Type':'text/html'});
            
    fs.createReadStream(__dirname + '/review.html','utf8').pipe(response);

}
function api_records(response,query){
    response.writeHead(200,{'Content-Type':'application/json'});

    response.end(JSON.stringify(query));
}
//静态文件服务器处理方法
 function static(response,query){
    response.writeHead(200,{'Content-Type':'application/json'});
    response.end(JSON.stringify(query));
 }


module.exports={
    home :home,
    review:review,
    api_records:api_records,
    static:static
}

