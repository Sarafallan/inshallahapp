var handlers = require('./handlers.js');

var routes = [
  {
    method: 'GET',
    path: '/',
    handler: function(req, reply){
      reply.file(__dirname + '/login.html');
    },
  },
  {
    method: 'GET',
    path: '/{path*}',
    handler: function(req, reply){
      reply.file(__dirname + '/' + req.params.path);
    },
  },
  {
    method: 'POST',
    path: '/login',
    handler: handlers.login
  },
  {
    method: 'GET',
    path: '/setup',
    handler: function(req, reply){
      reply.file(__dirname + '/index.html');
    }
  },
  {
    method: 'POST',
    path: '/saveProfile',
    handler: handlers.saveProfile
  },
  {
    method: 'POST',
    path: '/location',
    handler: handlers.getLocation
  }
];

module.exports = routes;
