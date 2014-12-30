var net = require('net');
var SyslogParser = require("./parser/SyslogParser");
var MongoClient = require('mongodb').MongoClient;
var useMongo = false;
var bodyParser = require('body-parser');
var express = require('express')
var app = express()

//Configura Express
app.use(express.static(__dirname +'/public'));
app.engine('html', require('ejs').renderFile);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.render('index.html');
})

app.post('/logs', function(req, res) {
	if(useMongo){
		var coll = MongoDB.collection('logs');
		var query = createQuery(req.body);
		var cursor;
		
		//console.log("query");
		//console.log(query);
		cursor = coll.find(query).sort([['datetime',-1]]).limit(10);
		//console.log(req.body);
		cursor.toArray(function(err, items){
			var retorno = {};
			retorno["Result"] = "OK";
			retorno["Records"] = items;
			res.contentType('json');
			res.end(JSON.stringify(retorno));
		});
	}
});

function createQuery(body){
var query = {};
	if( body.sdid ){
		query["message.sdid"] = body.sdid;
	}

	if( body.transactionId ){
		var aux = {};
		query["$or"] = [];
		aux["message.sdparams.param"] = "transactionId"
		aux["message.sdparams.value"] = body.transactionId
		query["$or"].push(aux);
		//query["message.sdparams.param"] = "transactionId"
		//query["message.sdparams.value"] = body.transactionId
		//query["message.sdparams.transactionID"] = body.transactionID;
		//{"message.sdparams" : {"param":"step", "value":"DDL"}}
	}
	
	if( body.group ){
		var aux = {};
		query["$or"] = [];
		aux["message.sdparams.param"] = "group";
		aux["message.sdparams.value"] = body.group;
		query["$or"].push(aux);
//		query["message.sdparams.group"] = body.group;
	}
	
	
	if( body.category ){
		var aux = {};
		query["$or"] = [];
		aux["message.sdparams.param"] = "category";
		aux["message.sdparams.value"] = body.category;
		query["$or"].push(aux);
//		query["message.sdparams.group"] = body.group;
	}
	
	return query;
}

//MongoDB connection
var url = 'mongodb://localhost:27017/syslog';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
	
	useMongo = true;
  MongoDB = db;
	
});

var server = net.createServer(function (socket) {
	var data = "";
	console.log("connection...");
	socket.on('error', function() { console.log("error"); });
	socket.on('data', function(chunk) {
		data += chunk;
		try {
			//console.log(chunk.toString());
			var info = SyslogParser.parse(chunk.toString());
			console.log(chunk.toString().slice(-1));
			//console.log(info.message);
			if(useMongo){
				var coll = MongoDB.collection('logs');
				coll.insert(info, function(err, result) {

				});
			}
		} catch (ex) {
			console.log("ERR");
			console.log(ex);
			console.log(chunk.toString().slice(-1));
			console.log(chunk.toString());
		}
		
	});
	
	socket.on("end", function(){
		console.log("--------------Terminou---------------");
		console.log(data);
		console.log("--------------Terminou---------------");
		data = "";
	});
});

server.listen(8083, function(){
	var server = app.listen(3000, function () {

		var host = server.address().address
		var port = server.address().port

		console.log('Example app listening at http://%s:%s', host, port)

	});
});
