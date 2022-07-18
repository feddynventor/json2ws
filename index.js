const PASSWORD_HEADER = "n7ygyADfQTk6Rx7?vY9CckR!k?YmzVVA"
const DEBOUNCE_TIME = 3000;
const SOCKET_PORT = 8001;
const HTTP_PORT = 8000;

var parsedArgs = {};
process.argv.slice(2).forEach((arg,i)=>{
	if (i%2==0) parsedArgs[arg.replace('-','')]=null;
	else parsedArgs[process.argv[i+1].replace('-','')]=arg
})
//##########
const ws = require("nodejs-websocket")
var server = ws.createServer( function () {
	if (!lastObject) return;
	if (Math.floor(new Date()/1000)-lastObject.creation<lastObject.ttl){
		server.connections.forEach(async function (conn) {
			conn.sendText(JSON.stringify(lastObject))
		})}
}).listen(parsedArgs.ws?parsedArgs.ws:SOCKET_PORT)

const express = require('express');
const app = express();
app.use(express.json());
app.all("*", (req,res, next) => {
	if(Object.keys(parsedArgs).includes("free")){
		next();
		return;
	}
	if(req.headers.authorization==PASSWORD_HEADER)
		next();
	else
		res.sendStatus(403);
})
var lastSent = new Date();
var lastObject = null;
app.post('/*', function (req, res) {
	if (new Date()-lastSent<DEBOUNCE_TIME){
		res.sendStatus(401);
		return;
	}
	lastObject = {
		'topic':req.path,'payload':req.body,
		'ttl':req.body.ttl, 'creation':Math.floor(new Date()/1000)
	};
	server.connections.forEach(async function (conn) {
		conn.sendText(JSON.stringify(lastObject))
	})
	lastSent = new Date();
	if(!Object.keys(parsedArgs).includes("preserve")) lastObject=null
	res.sendStatus(200);
})
app.listen(parsedArgs.http?parsedArgs.http:HTTP_PORT)
