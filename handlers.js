var Firebase = require('firebase');
var FirebaseTokenGenerator = require('firebase-token-generator');
var tokenGenerator = new FirebaseTokenGenerator(process.env.FIREBASESECRET);

var adminToken = tokenGenerator.createToken(
  { uid: "1"},
  { admin: true}
);

module.exports = {

  returnSearch : function(req, reply){
    var searchQuery = JSON.parse(req.payload);
    var searchResult = searchFunction(searchQuery, function(data){
      reply(JSON.stringify(data));
    });
  },

  saveProfile : function(req, reply){
    var profileObject = JSON.parse(req.payload);
    var profileKey = profileObject['uid'];

    var users = new Firebase('https://blazing-torch-7074.firebaseio.com/users/');
    var userProfile = users.child(profileKey);

    var onComplete = function(error) {
      if (error) {
        console.log('Synchronization failed');
        reply(error);
      } else {
        console.log('Synchronization succeeded');
        reply(200);
      }
    };

    userProfile.update({
     'tel' : profileObject.tel,
     'story': profileObject.story,
     'skillsNeeded': profileObject.skillsNeeded,
     'hasSkills': profileObject.hasSkills,
     'helpNeededLocation': profileObject.helpNeededLocation,
     'shareSkills': profileObject.shareSkills
   }, onComplete);
  },

  login : function(req, reply) {
    var userDetails = JSON.parse(req.payload);
    var token = tokenGenerator.createToken({uid: userDetails.uid});
    var user = new Firebase('https://blazing-torch-7074.firebaseio.com/users/' + userDetails.uid);
    console.log('our token', token);
    user.authWithCustomToken(token, function(error, authData) {
      if (error) {
        console.log(error);
      } else {
        console.log('authData');
      }
    });

    user.once("value", function(snapshot) {
      if (snapshot.exists() && snapshot.val().tel) {
        reply({userSetupComplete: true});
      } else {
        if (!snapshot.exists()) {
          createUser(userDetails, function(){
            reply({userSetupComplete: false});
          });

        } else {
          reply({userSetupComplete: false});
        }
      }
    });
  },
};

function createUser(user, callback) {
  var users = new Firebase('https://blazing-torch-7074.firebaseio.com/users/');
  var newUser = {};
  newUser[user.uid] = {first_name: user.facebook.cachedUserProfile.first_name};
  users.update(newUser);
  callback();
}

function searchFunction(searchObject, callback) {
  var users = new Firebase('https://blazing-torch-7074.firebaseio.com/users/');
  var searchTerms = searchObject;

  users.authWithCustomToken(adminToken, function(error) {
    if (error) {
      console.log(error);
    } else {
      users.on("value", function(snapshot) {
        var data = snapshot.val();
        var answer = searchUsers(data, searchTerms);
        console.log('from search function', answer);
        return callback(answer);

      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });
    }
  });
}

function searchUsers(data, terms) {

  var keysArray = Object.keys(data);
  var searchResults = [];

  if(terms.searchChoice === "takeHelp"){

    keysArray.forEach(function(key){
      var hasSkills = data[key].hasSkills || [];
      if (hasSkills.indexOf(terms.searchTopic) > -1) {
        var result = {};
        result[key] = data[key];
        searchResults.push(result);
      }
    });

  } else if (terms.searchChoice === "giveHelp"){
    keysArray.forEach(function(key){
      var skillsNeeded = data[key].skillsNeeded || [];
      if (skillsNeeded.indexOf(terms.searchTopic) > -1) {
        var result = {};
        result[key] = data[key];
        searchResults.push(result);
      }
    });
  } else {
    console.log('error');
  }
  return searchResults;
}
