var fs = require('fs');
const http = require('http');
const path = require('path');
const config = require('./config');
const log = require("./log");


//转发到下游地址的方法
function home(request,response){
    //解析服务器地址 生成hostname和port
    function test(str){
        const s = str.split(":");
    
        return {hostname:s[0],port:s[1]||"80"};}
    //解析服务器地址，生成 hostname和port
    const servers = test(config.proxy_pass);
    //生成监听error事件函数，出错时候相应500
    function bindError(req,res,id){
        return function(err){
            const msg = String(err.stack || err);
            
            
            fs.appendFile('error_log.txt',log("[%s] got error: %s&nbsp", id, msg), function (err) {
                if (err) throw err;
                console.log('The "data to append" was appended to file!');});
            if(!res.headersSent){
                res.writeHead(500,{"content-type":"text/plain"});
            }
            res.end(msg);}

        };
        
        const target=servers;
        console.log("********")
        console.log(servers.port);


        const info = {
            hostname:servers.hostname,
            port:servers.port,
            method:request.method,
            path:request.url,
            headers:request.headers};
        const id = `${request.method} ${request.url} => ${target.hostname}:${target.port}`;
        
        fs.appendFile('access_log.txt',log("[%s]Reverse Proxy",id), function (err) {
            if (err) throw err;
            console.log('The "data to append" was appended to file!');});
        //发送代理请求
        const req2 = http.request(info,function(res2){
            res2.on("error",bindError(request,response,id));
            log("[%s] 响应 : %s",id,res2.statusCode);
            response.writeHead(res2.statusCode,res2.headers);
            res2.pipe(response);

        });
        request.pipe(req2);
        req2.on("error",bindError(request,response,id));
    
    }
    

//处理error_log;
function error_log(request,response){
    response.writeHead(200,{'Content-Type':'text/html;charset:utf-8'});
            
    fs.createReadStream(__dirname + '/error_log.txt','utf8').pipe(response);

}
//处理access_log;
function access_log(request,response){
    response.writeHead(200,{'Content-Type':'text/html;charset:utf-8'});
            
    fs.createReadStream(__dirname + '/access_log.txt','utf8').pipe(response);

}
function api_records(response,query){
    response.writeHead(200,{'Content-Type':'application/json'});

    response.end(JSON.stringify(query));
}
//静态文件服务器处理方法
 function static(request,response){
    var compath =path.join(config.root, path.normalize(request.url));
    const id = `${request.method} ${request.url} `;

    function routeHandler(pathName, request, response) {
        fs.stat(pathName, (err, stats) => {
            if (err) {
                response.statusCode = 404
                response.setHeader('content-type', 'text/plain');
                const msg = String(err.stack || err);
                
                fs.appendFile('error_log.txt',log("[%s] got error: %s&nbsp", id, msg), function (err) {
                    if (err) throw err;
                    console.log('The "data to append" was appended to file!');});
                response.end(`${pathName} is not a file`);
                return;
             
            }
            if(stats.isFile()) {
                response.statusCode = 200;
                response.setHeader('content-type', 'text/plain');
                fs.createReadStream(pathName).pipe(response);
                
                fs.appendFile('access_log.txt',log("[%s] response: %s&nbsp", id, response.statusCode), function (err) {
                    if (err) throw err;
                    console.log('The "data to append" was appended to file!');});
            }
            else if(stats.isDirectory()){
                fs.readdir(pathName,(err,files) => {
                    response.statusCode=200;
                    response.setHeader('content-type','text/plain');
                    fs.appendFile('access_log.txt',log("[%s] response: %s&nbsp", id, response.statusCode), function (err) {
                        if (err) throw err;
                        console.log('The "data to append" was appended to file!');});
                    response.end(files.join(','));
                    
                })
            }
        });
    }
    routeHandler(compath, request, response);
    

 }



module.exports={
    home :home,
    error_log:error_log,
    access_log:access_log,
    api_records:api_records,
    static:static
}

