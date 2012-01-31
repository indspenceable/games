var http = require('http')
, fs = require('fs')
, url = require('url')
, jade = require('jade')
, jadeOptions = {}
, gameServer = require('./gameserver');

server = http.createServer(function(req,res) {
  //server code
  var path = url.parse(req.url).pathname;
  switch(path) {
    case '/':
    jade.renderFile('page.jade', jadeOptions, function(err,html) {
      if (err != undefined) {
        console.log(err);
      } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(html);
        res.end();
      }
    })
    break;
    case '/game.js':
      fs.readFile('./game.js', function(error, content) {
        if (error) {
          res.writeHead(500);
          res.end();
        } else {
          res.writeHead(200, { 'Content-Type': 'text/javascript' });
          res.end(content, 'utf-8');
        }
      });
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
gameServer.start(server);