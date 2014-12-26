var net = require('net');
var SyslogParser = require("./parser/SyslogParser");
var MongoClient = require('mongodb').MongoClient;
var useMongo = false;
var express = require('express')
var app = express()

//Configura Express
app.use(express.static(__dirname +'/public'));
app.engine('html', require('ejs').renderFile);

app.get('/', function (req, res) {
  res.render('index.html');
})

app.post('/logs', function(req, res) {
	if(useMongo){
		var coll = MongoDB.collection('logs');
		var cursor = coll.find({}).sort([['datetime',-1]]).limit(10);
		console.log(req.query);
		cursor.toArray(function(err, items){
			var retorno = {};
			retorno["Result"] = "OK";
			retorno["Records"] = items;
			res.contentType('json');
			res.end(JSON.stringify(retorno));
		});
	}
});

//MongoDB connection
var url = 'mongodb://localhost:27017/syslog';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
	
	useMongo = true;
  MongoDB = db;
	
});

var server = net.createServer(function (socket) {
	console.log("connection...");
	socket.on('data', function(data) {
		try {
			var info = SyslogParser.parse(data.toString());
			if(useMongo){
				var coll = MongoDB.collection('logs');
				coll.insert(info, function(err, result) {

				});
			}
		} catch (ex) {
			console.log("ERR")//console.log(ex);
		}
		
	});
});

server.listen(8083, function(){
	var server = app.listen(3000, function () {

		var host = server.address().address
		var port = server.address().port

		console.log('Example app listening at http://%s:%s', host, port)

	});
});
