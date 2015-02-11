var express = require('express');
var WebSocketServer = require('ws').Server;
var http = require('http');

var port = process.env.PORT || 3000;
var app = express();

app.use(express.static(__dirname + '/public/'))

var server = http.createServer(app);
server.listen(port);
console.log('HTTP server listening on port %d', port);

var wss = new WebSocketServer({server: server});
console.log('WSS listening on app server');

wss.broadcastActiveCount = function broadcast() {
  var activeCount = wss.clients.length;
  console.log('broadcasting %d active users count', activeCount);

  wss.clients.forEach(function each(client) {
    client.send(activeCount.toString());
  });
};

wss.on('connection', function (connection) {
  console.log('client connected');
  connection.on('close', function() {
    console.log('client disconnected');
    wss.broadcastActiveCount();
  });

  wss.broadcastActiveCount();
});
