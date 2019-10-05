const util = require("util");



/** 打印日志 */
module.exports = function log(...args) {
 
  const time = new Date().toLocaleString();
  return time+util.format(...args)+'\n';
  
};