var net = require('net');
var SyslogParser = require("./parser/SyslogParser");

var server = net.createServer(function (socket) {
	console.log("connection...");
	socket.on('data', function(data) {
		try {
			console.log(SyslogParser.parse(data.toString()));
		} catch (ex) {
			console.log("ERR")//console.log(ex);
		}
		
	});
});
server.listen(8083);
