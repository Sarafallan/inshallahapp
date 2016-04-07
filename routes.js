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
    method: 'GET',
    path: '/firebase',
    handler: function(req, reply){
      var Firebase = require('firebase');
      var myRootRef = new Firebase('https://blazing-torch-7074.firebaseio.com');
      myRootRef.set({one: {two: 'three'}, two: 'two'});
      reply('thanks');
    }
  }
];

module.exports = routes;
