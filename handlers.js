var request = require('request');
var Firebase = require('firebase');
var FirebaseTokenGenerator = require('firebase-token-generator');
var tokenGenerator = new FirebaseTokenGenerator(process.env.FIREBASESECRET);

var adminToken = tokenGenerator.createToken(
  { uid: "1"},
  { admin: true}
);

module.exports = {

  sendMessage : function(req, reply) {
    var messageInfo = req.payload;
    var details = getMessageDetails(messageInfo.sender, messageInfo.reciever, function(data){
      console.log(data);
      checkContacts(data.sender, data.reciever, function(boolean){
        if (boolean) {
          console.log('contacted already');
          reply({success: false, message: 'You have already contacted this person, you can\'t contact them again but they have your number'});
        } else {
          twilio(data, reply);
        }
      });
    });
  },


  returnSearch : function(req, reply){
    var searchQuery = JSON.parse(req.payload);
    var searchResult = searchFunction(searchQuery, function(data){
      reply(JSON.stringify(data));
    });
  },

  saveProfile : function(req, reply){
    var profileObject = JSON.parse(req.payload).userProfile;
    var profileKey = profileObject['uid'];
    var users = new Firebase('https://blazing-torch-7074.firebaseio.com/users/');
    var userProfile = users.child(profileKey);
    var token = JSON.parse(req.payload).token;

    var onComplete = function(error) {
      if (error) {
        console.log('Synchronization failed');
        reply(error);
      } else {
        console.log('Synchronization succeeded');
        reply(200);
      }
    };

    userProfile.authWithCustomToken(token, function(error, authData) {
      if (error) {
        console.log(error);
      } else {
        userProfile.update({
         'phoneNumber' : profileObject.phoneNumber,
         'phoneCC': profileObject.phoneCC,
         'anythingElse': profileObject.anythingElse,
         'story': profileObject.story,
         'skillsNeeded': profileObject.skillsNeeded,
         'hasSkills': profileObject.hasSkills,
         'helpNeededLocation': profileObject.helpNeededLocation,
         'shareSkills': profileObject.shareSkills,
         'canHelpLocation': profileObject.canHelpLocation
       }, onComplete);
      }
    });
  },

  login : function(req, reply) {
    var userDetails = JSON.parse(req.payload);
    var token = userDetails.token;
    var user = new Firebase('https://blazing-torch-7074.firebaseio.com/users/' + userDetails.uid);
    user.authWithCustomToken(token, function(error, authData) {
      if (error) {
        console.log(error);
      } else {
        console.log('authData');
      }
    });

    user.once("value", function(snapshot) {
      if (snapshot.exists() && snapshot.val().phoneNumber && snapshot.val().phoneCC) {
        reply({userProfile: snapshot.val(), userSetupComplete: true});
      } else {
        if (!snapshot.exists()) {
          createUser(userDetails, function(){
            reply({userProfile: snapshot.val(), userSetupComplete: false});
          });

        } else {
          reply({userProfile: snapshot.val(), userSetupComplete: false});
        }
      }
    });
  },

  getLocation: function(req, reply) {
    var coords = req.payload;
    request( "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + coords.latitude + "," + coords.longitude + "&result_type=country|locality&key=" + process.env.GOOGLEMAPSAPI, function(error, response, body) {
      var data = JSON.parse(body);
      if (data.status === 'OK') {
        var city = extractCity(data.results);
        var country = extractCountry(data.results);
        reply({city: city, country: country});
      } else {
        reply('error: ', data.status);
      }
    });
  },

  getProfileDetails: function(req, reply) {
    var id = req.payload.id;
    var user = new Firebase('https://blazing-torch-7074.firebaseio.com/users/' + id);
    user.authWithCustomToken(adminToken, function(error) {
      if (error) {
        console.log(error);
      } else {
        user.once('value', function(snapshot){
          var profile = snapshot.val();
          var responseObject = {
            first_name: profile.first_name,
            last_name: profile.last_name,
            display_name: profile.display_name,
            hasSkills: profile.hasSkils,
            skillsNeeded: profile.skillsNeeded,
            shareSkills: profile.shareSkills,
            story: profile.story,
            canHelpLocation: profile.canHelpLocation,
            helpNeededLocation: profile.helpNeededLocation
          }
          reply(snapshot.val());
        }, function(error){
          reply(error);
        });
      }
    });
  }
};

function createUser(user, callback) {
  var users = new Firebase('https://blazing-torch-7074.firebaseio.com/users/');
  var newUser = {};
  newUser[user.uid] = {first_name: user.facebook.cachedUserProfile.first_name, last_name: user.facebook.cachedUserProfile.last_name, display_name: user.facebook.displayName};
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
      users.once("value", function(snapshot) {
        var data = snapshot.val();
        var answer = searchUsers(data, searchTerms);
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
  var searchLocationMatch = [];

  if(terms.searchChoice === "takeHelp"){

    keysArray.forEach(function(key){
      var hasSkills = data[key].hasSkills || [];
      var giveHelpLocation = data[key].canHelpLocation || [];

      if (hasSkills.indexOf(terms.searchTopic) > -1 && key != terms.uid) {
        var result = {};
        result[key] = data[key];

        if (giveHelpLocation.indexOf(terms.searchLocation) > -1) {
          searchLocationMatch.push(result);
        } else {
          searchResults.push(result);
        }
      }
    });


  } else if (terms.searchChoice === "giveHelp"){
    keysArray.forEach(function(key){
      var skillsNeeded = data[key].skillsNeeded || [];
      var getHelpLocation = data[key].helpNeededLocation || [];

      if (skillsNeeded.indexOf(terms.searchTopic) > -1 && key != terms.uid) {
        var result = {};
        result[key] = data[key];

        if (getHelpLocation.indexOf(terms.searchLocation) > -1) {
          searchLocationMatch.push(result);
        } else {
          searchResults.push(result);
        }
      }
    });
  } else {
    console.log('error');
  }

  var fullResults = searchLocationMatch.concat(searchResults);
  return fullResults;
}


function extractCity(data) {
  var found;
  data.forEach(function(el){
    if (el.types.indexOf("locality") > -1) {
      found = el.address_components[0].long_name;
    }
  });
  return found;
}

function extractCountry(data) {
  var found;
  data.forEach(function(el){
    if (el.types.indexOf("country") > -1) {
      found = el.address_components[0].long_name;
    }
  });
  return found;
}

function getMessageDetails(senderuid, recieveruid, callback) {
  var users = new Firebase('https://blazing-torch-7074.firebaseio.com/users/');
  var messageDetails = {};

  users.authWithCustomToken(adminToken, function(error) {
    if (error) {
      console.log(error);
    } else {
      users.once("value", function(snapshot) {
        var data = snapshot.val();
        messageDetails.sender = data[senderuid];
        messageDetails.sender.uid = senderuid;
        messageDetails.reciever = data[recieveruid];
        messageDetails.reciever.uid = recieveruid;

        callback(messageDetails);
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });
    }
  });
}

function twilio(messageDetails, reply) {
  // var accountSid = process.env.TWILIO_ACCOUNT_SID;
  // var authToken = process.env.TWILIO_AUTH_TOKEN;
  // var twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
  //
  // var client = require('twilio')(accountSid, authToken);
  //
  // client.messages.create({
  //     to: '07952795872',
  //     from: twilioPhoneNumber,
  //     body: "Hello " + messageDetails.reciever.first_name + ", " + messageDetails.sender.first_name + " needs help with generic skill. Get in touch with them at " + messageDetails.sender.tel,
  // }, function(err, message) {
  //   if (err) {
  //     console.log(err);
  //     reply('Something went wrong, please try again later');
    // } else {
      console.log('inside twillio function');
      addContact('contact_sent', messageDetails.sender.uid, {uid: messageDetails.reciever.uid, name: messageDetails.reciever.display_name});
      addContact('contact_recieved', messageDetails.reciever.uid, {uid: messageDetails.sender.uid, name: messageDetails.sender.display_name, tel: messageDetails.sender.phoneCC + messageDetails.sender.phoneNumber});

      reply({success: true, message: 'Message Sent!'});
    // }
  // });
}

function checkContacts(sender, reciever, callback) {
  var user = new Firebase('https://blazing-torch-7074.firebaseio.com/users/' + sender.uid + '/' + 'contact_sent');

  user.once("value", function(snapshot){
    var contacts = snapshot.val();
    for (var key in contacts) {
      if (contacts[key].uid === reciever.uid) {
        return callback(true);
      }
    }
    callback(false);
  });
}

function addContact(contactKey, userid, contactObject) {
  var user = new Firebase('https://blazing-torch-7074.firebaseio.com/users/' + userid + '/' + contactKey);

  user.authWithCustomToken(adminToken, function(error) {
    if (error) {
      console.log(error);
    } else {
      user.push(contactObject);
    }
  });

}
