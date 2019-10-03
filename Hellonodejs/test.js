function kk(str){
    const s = str.split(":");

    return {hostname:s[0],port:s[1]||"80"};

}
var servers=kk(str);
