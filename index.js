const ws = require("nodejs-websocket")
const express = require("express")

const PASSWORD_HEADER = "n7ygyADfQTk6Rx7?vY9CckR!k?YmzVVA"
const DEBOUNCE_TIME = 3000;

const app = express()
app.use(express.json());
app.all("*", (req,res, next) => {
	if((req.headers.authorization==PASSWORD_HEADER)){
		next();
	}else{
		res.sendStatus(403);
	}
})
var lastSent = new Date();
app.post('/*', function (req, res) {
	if (new Date()-lastSent<DEBOUNCE_TIME){
		res.sendStatus(401);
		return;
	}
	server.connections.forEach(async function (conn) {
		conn.sendText(JSON.stringify({
			'topic':req.path,'payload':req.body
		}))
	})
	lastSent = new Date();
	res.sendStatus(200);
})
app.listen(8002)

var server = ws.createServer(function (conn) {
	conn.on("text", function (str) {
		console.log("Received "+str)
	})
	conn.on("close", function (code, reason) {
		console.log("Connection closed")
	})
}).listen(8001)
