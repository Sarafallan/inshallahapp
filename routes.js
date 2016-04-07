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
  }
];

module.exports = routes;
