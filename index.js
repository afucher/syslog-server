var net = require('net');
var SyslogParser = require("./parser/SyslogParser");

var server = net.createServer(function (socket) {
  socket.write('Echo server\r\n');
  socket.pipe(socket);
	console.log("chegou aqui");
	
	socket.on('data', function(data) {
		try {
			console.log(SyslogParser.parse(data.toString()));
		} catch (ex) {
			console.log("ERR")//console.log(ex);
		}
		
	});
});

server.listen(8083);