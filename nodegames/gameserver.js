exports.start = function(server) {
  var io = require('socket.io').listen(server);

  io.sockets.on('connection', function(socket) {
    socket.on('status', function(data) {
      
    });
  });
}