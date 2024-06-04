// const logger = require('./logger');
const path = require('path'); //built in path as we didn't give any path
var pathObj = path.parse(__filename);
console.log(pathObj);
const loggerTwo = require('./logger');
// console.log(logger);
// logger.log("hi");
loggerTwo("hye");
console.log(loggerTwo);
function sayHello(name){
  console.log(name);
}
sayHello("Shaista")

//belaw are having global scope, accessible everywhere client browser or node
console.log("name");
// setTimeout();
// clearTimeout();
// setInterval();

//below two are same every global scope object can also be accessed with window. e,g window.setTimeout
// window.console.log("name"); 
console.log("name");

// in node we don't have this window object so we can use global with that like example below

var message = '';
global.console.log(message);
global.console.log(module);