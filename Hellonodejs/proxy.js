const http = require("http");
const assert = require("assert");
const log = require("./log");

module.exports = function reverseProxy(options){
    //由于需要配置config.json 所以未设置数组assert
    //assert(options.servers.length>0,"options.servers 的长度必须大于0");
    console.log(options.servers);


    //解析服务器地址 生成hostname和port
    function test(str){
    const s = str.split(":");

    return {hostname:s[0],port:s[1]||"80"};}

    //解析服务器地址，生成 hostname和port
    const servers = test(options.servers);
    //生成监听error事件函数，出错时候相应500
    function bindError(req,res,id){
        return function(err){
            const msg = String(err.stack || err);
            log("[%s] 发生错误: %s ",id,msg);
            if(!res.headersSent){
                res.writeHead(500,{"content-type":"text/plain"});

            }
            res.end(msg);

        };
    }
    return function proxy(req,res){
        //生成代理请求信息
        const target=servers;
        const info = {
            hostname:servers.hostname,
            port:servers.port,
            method:req.method,
            path:req.url,
            headers:req.headers

        };
        const id = `${req.method} ${req.url} => ${target.hostname}:${target.port}`;
        log("[%s]代理请求",id);


        //发送代理请求
        const req2 = http.request(info,function(res2){
            res2.on("error",bindError(req,res,id));
            log("[%s] 响应 : %s",id,res2.statusCode);
            res.writeHead(res2.statusCode,res2.headers);
            res2.pipe(res);

        });
        req.pipe(req2);
        req2.on("error",bindError(req,res,id));
    };

};


