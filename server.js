const Hapi = require('hapi');
const Inert = require('inert');


var server = new Hapi.Server({
  connections: {
    routes: {
      files: {relativeTo: __dirname + '/public'}
    }
  }
});

server.connection({
  port: process.env.PORT || '8000'
});

server.route(require('./app/routes.js'));

server.register(Inert, function(err){
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
