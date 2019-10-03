const http = require("http");
const assert = require("assert");
const log = require("./log");





module.exports = function reverseProxy(options){
    //由于需要配置config.json 所以未设置数组assert
    assert(options.servers.length>0,"options.servers 的长度必须大于0");

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
        const target=
    }
}
