var net = require('net');
var SyslogParser = require("./parser/SyslogParser");
var MongoClient = require('mongodb').MongoClient;
var useMongo = false;

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

server.listen(8083);
