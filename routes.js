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
  },
  {
    method: 'GET',
    path: '/login',
    handler: function(req, reply) {
      var Firebase = require('firebase');
      var ref = new Firebase('https://blazing-torch-7074.firebaseio.com');
      ref.authWithOAuthPopup("facebook", function(error, authData) {
        if (error) {
          if (error.code === "TRANSPORT_UNAVAILABLE") {
            ref.authWithOAuthRedirect("facebook", function(error) {
                if (error) {
                  console.log(error);
                }
            });
          }
        } else if (authData) {
          console.log('authData',authData);
          // user authenticated with Firebase
        }
      });
    }
  }
];

module.exports = routes;
