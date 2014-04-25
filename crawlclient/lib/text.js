// text.js
var tools = require("./index");

var rawobject = {"user": "serverUser", "password": "123456"},
	extraobject = {"gender": "man", "host": "localhost", "password": "asdfghjhk"};


tools.mergeobject(rawobject, extraobject);
console.dir(rawobject);

tools.mergeobject(rawobject, ["shybee"]);