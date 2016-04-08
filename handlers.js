var Firebase = require('firebase');

module.exports = {

  login : function(req, reply) {
    var userDetails = JSON.parse(req.payload);
    var user = new Firebase('https://blazing-torch-7074.firebaseio.com/users/' + userDetails.uid);
    user.once("value", function(snapshot) {
      if (snapshot.exists() && snapshot.val().phone) {
        reply({userSetupComplete: true});
      } else {
        if (!snapshot.exists()) {
          createUser(userDetails, function(){
            reply({userSetupComplete: false});
          });
        } else {
          console.log('You have a number');
          reply({userSetupComplete: false});
        }
      }
    });
  },
}

function createUser(user, callback) {
  var users = new Firebase('https://blazing-torch-7074.firebaseio.com/users/');
  var newUser = {};
  newUser[user.uid] = {first_name: user.facebook.cachedUserProfile.first_name};
  users.update(newUser);
  callback();
}
