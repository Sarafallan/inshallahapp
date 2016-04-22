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

});

function renderResults(searchResultsArray) {
  var resultsHTML = "";

  if (searchResultsArray.length){
    searchResultsArray.forEach(function(user){
      var uid = Object.keys(user);
      var location;
      var hasSkills;
      var skillsNeeded;

      if (user[uid].locationCity && user[uid].locationCountry) {
        location = user[uid].locationCity + ', ' + user[uid].locationCountry;
      } else if (user[uid].locationCountry) {
        location = user[uid].locationCountry;
      } else {
        location = 'Anywhere';
      }

      if (user[uid].hasSkills) {
        hasSkills = user[uid].hasSkills.map(function(el){
          return '<div class="skill">' + el + ' / ' + arabicSkills[el] + '</div>';
        }).join('');
        hasSkillsString = '<p>Has Skills: ' + hasSkills + '</p>';
      } else {
        hasSkillsString = '';
      }

      if (user[uid].skillsNeeded) {
        skillsNeeded = user[uid].skillsNeeded.map(function(el){
          return '<div class="skill">' + el + ' / ' + arabicSkills[el] + '</div>';
        }).join('');
        skillsNeededString = '<p>Needs Help With: ' + skillsNeeded + '</p>'
      } else {
        skillsNeededString = '';
      }

      resultsHTML = resultsHTML + '<div id=' + uid[0] +' class="individual"><h4>' + user[uid].display_name + '</h4><div>Stars '+ user[uid].star_count +'</div><div class="individual-details"><p>' + 'Location: ' +  location + '</p>'+ hasSkillsString + skillsNeededString + '<a href="#profile?id=' + uid[0] + '"></div><button class="view-individual ui-btn ui-btn-inline">View Individual / اعرض الأشخاص</button></a></div>';
    });
  } else {
    resultsHTML += '<p>Sorry, there are no results for your request</p><p>Please <a href="https://docs.google.com/forms/d/16EC6IcvYIWvaEvRRHBZYlpaMbo6eLCl4Dud3miyoZE0/viewform">Contact Us</a>, and we\'ll see what we can do to help</p>';
  }

  $('.results-box').html(resultsHTML);
}

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

  if (profile.hasSkills) {
    skills = '<div class="translation"><h4>' + profile.first_name +' can help with...</h4><h4>بلا جنوب الواقعة</h4></div>' + profile.hasSkills.map(function(el){
      return '<div class="skill">' + el + ' / ' + arabicSkills[el] + '</div>';
    }).join('') || '';
  }
  if (profile.skillsNeeded) {
    needs = '<div class="translation"><h4>'+ profile.first_name +' needs help with...</h4><h4>بلا جنوب الواقعة</h4></div>' + profile.skillsNeeded.map(function(el){
      return '<div class="skill">' + el + ' / ' + arabicSkills[el] + '</div>';
    }).join('') || '';
  }
  return ('<div class="translation contact recieverid" id="' +id+ '"><h2>Contact ' + profile.first_name + '</h2><h2>جنوب</h2></div>' +
     '<div class="has-skills">' + skills + '</div>' + '<div class="need-skills">' + needs + '</div>' +
    '<div class="send-details"><div class="translation"><p>Send ' + profile.first_name + ' Your Details</p><p>ببب ب ب بببب</p></div>' +
    '<button class="send-message" data-role="button">Send / جنوب</button></div>'
  );
}

$('.profile').on('click', '.send-message', function(e){
  var authData = JSON.parse(localStorage.getItem('firebase:session::blazing-torch-7074'));
  var currentUid = authData.uid;
  var reciever = $(".recieverid").attr("id");

  var sendObject = {
    sender : currentUid,
    reciever : reciever,
    searchLocation : searchQuery.searchLocation,
    searchChoice : searchQuery.searchChoice,
    searchTopic : searchQuery.searchTopic
  };

  $.post('/sendMessage', sendObject, function(data){
    if (data.success){
      state.contacted.push(data.contact);
    }
    $('#contactMessage').popup();
    $('#contactMessage p').html(data.message);
    $('#contactMessage').popup('open');
  });
});
