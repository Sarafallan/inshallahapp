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
    path: '/main',
    handler: function(req, reply){
      reply.file(__dirname + '/index.html');
    }
  },
  {
    method: 'GET',
    path: '/search',
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
    path: '/returnSearch',
    handler: handlers.returnSearch
  },
  {
    method: 'POST',
    path: '/location',
    handler: handlers.getLocation
  },
  {
    method: 'POST',
    path: '/sendMessage',
    handler: handlers.sendMessage
  },
  {
    method: 'POST',
    path: '/getProfileDetails',
    handler: handlers.getProfileDetails
  },
  {
    method: 'POST',
    path: '/addStar',
    handler: handlers.addStar
  }
];

module.exports = routes;
