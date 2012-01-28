var http = require('http')
, url = require('url')
, server;

var jade = require('jade')
, jadeOptions = {};

server = http.createServer(function(req,res) {
  //server code
  var path = url.parse(req.url).pathname;
  switch(path) {
    case '/':
    jade.renderFile('page.jade', jadeOptions, function(err,html) {
      if (err != undefined) {
        console.log(err);
      }
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(html);
      res.end();
    })
    break;
    default: send404(res);
  }
})

var send404 = function(res){
  res.writeHead(404);
  res.write('404\n');
  res.end();
};

server.listen(8080);

var nowjs = require("now");
var everyone = nowjs.initialize(server);

everyone.now.distributeMessage = function(message){
  everyone.now.receiveMessage(this.now.name, message);
};