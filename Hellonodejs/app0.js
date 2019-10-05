var server = require('./server');
var router = require('./router');
var handler = require('./handler');
var config = require('./config');

var handle = {};

handle['/']=handler.home;
handle['/ping']=handler.home;
handle[config.error_log]=handler.error_log;
handle[config.access_log]=handler.access_log;

handle['/home']=handler.home;
handle['/review']=handler.review;
handle['/api/v1/records']=handler.api_records;

handle['/static']=handler.static;


server.startServer(router.route,handle);
