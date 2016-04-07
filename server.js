var Hapi = require('hapi');

var server = new Hapi.Server();

server.connection({
  port: process.env.PORT || "8000",
});

server.route(require('./routes.js'));

server.register(require('inert'), function(err){
    if (err) {
        console.error('Failed to load plugin:', err);
    }
});

server.start(function(err){
  if (err) {
    throw new Error(err);
  }
  console.log(server.info.uri);
});
