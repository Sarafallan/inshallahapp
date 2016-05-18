var searchResultProfiles = [];
var searchQuery = {};

$('#search-button').bind('click', function(e){
  var searchChoice = $('#search-choice').val();
  var searchTopic = $('#search-topic').val();
  var searchLocation = state.userProfile.locationCountry;
  var profile = JSON.parse(localStorage.getItem('firebase:session::blazing-torch-7074'));

  searchQuery = {
    'uid' : profile.uid,
    'searchLocation' : searchLocation,
    'searchChoice' : searchChoice,
    'searchTopic' : searchTopic
  };

  var request = new XMLHttpRequest();
  request.open('POST', '/returnSearch');
  request.send(JSON.stringify(searchQuery));

  if (state.userProfile.profileComplete) {

    request.onreadystatechange = function() {
      if (request.readyState === 4) {
        if (request.status === 200) {
          var resultsArray = JSON.parse(request.responseText);
          state.searchResultProfiles = arrayToObject(resultsArray);
          localStorage.setItem('state', JSON.stringify(state));
          renderResults(resultsArray);
        } else {
          console.log('function error');
        }
      }
    };
  } else {
    $( "#profileIncomplete" ).popup();
    $( "#profileIncomplete" ).popup( "open" );
  }
});

function renderResults(searchResultsArray) {
  var resultsHTML = "";

  if (searchResultsArray.length){
    searchResultsArray.forEach(function(user){
      var uid = Object.keys(user);
      var location;
      var hasSkills;
      var skillsNeeded;
      // var recommendsString;

      if (user[uid].locationCity && user[uid].locationCountry) {
        location = user[uid].locationCity + ', ' + user[uid].locationCountry;
      } else if (user[uid].locationCountry) {
        location = user[uid].locationCountry;
      } else {
        location = 'Anywhere';
      }

      if (user[uid].hasSkills && searchQuery.searchChoice === "takeHelp") {
        hasSkills = user[uid].hasSkills.map(function(el){
          return '<div class="skill">' + el + ' / ' + arabicSkills[el] + '</div>';
        }).join('');
        hasSkillsString = '<p>Has Skills: ' + hasSkills + '</p>';
      } else {
        hasSkillsString = '';
      }

      if (user[uid].skillsNeeded && searchQuery.searchChoice === "giveHelp") {
        skillsNeeded = user[uid].skillsNeeded.map(function(el){
          return '<div class="skill">' + el + ' / ' + arabicSkills[el] + '</div>';
        }).join('');
        skillsNeededString = '<p>Needs Help With: ' + skillsNeeded + '</p>';
      } else {
        skillsNeededString = '';
      }

      // if (user[uid].star_count >= 1) {
      //   recommendsString = '<div><img src="./assets/star.png" style="height: 35px; background-color: yellow"/> ' + user[uid].star_count +' recommends</div>';
      // } else {
      //   recommendsString ='';
      // }

      resultsHTML = resultsHTML + '<div id=' + uid[0] +' class="individual"><h4>' + user[uid].display_name + '</h4><div class="individual-details"><p>' + 'Location: ' +  location + '</p>'+ hasSkillsString + skillsNeededString + '<a href="#profile?id=' + uid[0] + '"></div><button id="view-individual" class="view-individual ui-btn ui-btn-inline">View Individual / إعرض الأشخاص</button></a></div>';
    });
  } else {
    resultsHTML += '<p>We can\'t find you anyone right now. Click below to send us your details and we will try to help.</p><p class="translation"> لارسال معلوماتك و سنحاول مساعدتك لم نستطع ايجاد احد حاليا ,اضغط اسفل </p><p><div class="send-query"><button id="send-query" class="ui-btn ui-shadow ui-corner-all">Send Request</button><div></p>'
  }

  $('.results-box').html(resultsHTML);
}

$('.results-box').on('click', '#send-query', function(e){
  sendMessage("inshallahGeneric");
});

// -- Plugin for handling Query Strings -- //

$.mobile.paramsHandler.addPage(
  "profile", // id of jquery mobile page you want to accept URL parameters
  ["id"],    // required parameters for that page
  [],        // optional parameters for that page

  // callback function for when that page is about to show
  function (urlParams) {
    getProfile(urlParams.id);
  }
);

$.mobile.paramsHandler.init();

function arrayToObject(array) {
  return array.reduce(function(object, element){
    var firstKey = Object.keys(element)[0];
    object[firstKey] = element[firstKey];
    return object;
  }, {});
}

function getProfile(id) {
  if (state.searchResultProfiles[id]) {
    $('.profile').html(createProfile(state.searchResultProfiles[id], id));
  } else {
    $.post('/getProfileDetails', {id: id} ,function(data){
      $('.profile').html(createProfile(data, id));
    });
  }
}

function createProfile(profile, id) {
  var skillsSentence = '';
  var skills = '';
  var needs = '';
  // var starSentence = "";

  // if (profile.star_count !== 0) {
  //   starSentence = profile.first_name + ' has been recommended ' + profile.star_count + ' times';
  // }

  if (profile.hasSkills) {
    skills = '<div class="translation"><h4>' + profile.first_name +' can help with...</h4><h4>.يستطيع المساعدة ب</h4></div>' + profile.hasSkills.map(function(el){
      return '<div class="skill">' + el + ' / ' + arabicSkills[el] + '</div>';
    }).join('') || '';
  }
  if (profile.skillsNeeded) {
    needs = '<div class="translation"><h4>'+ profile.first_name +' needs help with...</h4><h4> يحتاج المساعدة ب</h4></div>' + profile.skillsNeeded.map(function(el){
      return '<div class="skill">' + el + ' / ' + arabicSkills[el] + '</div>';
    }).join('') || '';
  }
  return ('<div class="translation contact recieverid" id="' +id+ '"><h2>Contact ' + profile.first_name + '</h2><h2>جنوب</h2></div>' +
     '<div class="has-skills">' + skills + '</div>' + '<div class="need-skills">' + needs + '</div>' +
    '<div class="send-details"><div class="translation"><p>Send ' + profile.first_name + ' Your Details</p><p>إرسل '+ profile.first_name +' تفاصيلك</p></div>' +
    '<button id="send-message-button" class="send-message" data-role="button">Send / إرسل</button></div>'
  );
}

$('.profile').on('click', '.send-message', function(e){
  if (state.userProfile.profileComplete) {
      var personRecieving = $(".recieverid").attr("id");
      sendMessage(personRecieving);
  } else {
    $( "#profileIncomplete" ).popup();
    $( "#profileIncomplete" ).popup( "open" );
  }
});

function sendMessage(recieverVar) {
  var authData = JSON.parse(localStorage.getItem('firebase:session::blazing-torch-7074'));
  var currentUid = authData.uid;
  var reciever = recieverVar;

  var sendObject = {
    sender : currentUid,
    reciever : reciever,
    searchLocation : searchQuery.searchLocation || "United Kingdom",
    searchChoice : searchQuery.searchChoice || "takeHelp",
    searchTopic : searchQuery.searchTopic || "advice"
  };

  $.post('/sendMessage', sendObject, function(data){
    if (data.success){
      //state.userProfile.contact_sent[data.contact.uid] = data.contact;
      //renderActivity();
    }
    $('#contactMessage').popup();
    $('#contactMessage').html('<div class="translation"><p>' + data.message + '</p><p>' + data.arabicMessage + '</p></div>');
    $('#contactMessage').popup('open');
  });
}
