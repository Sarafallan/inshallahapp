var stateCanHelpLocation = 'France';
var stateNeedHelpLocation = 'UK';
var searchResultProfiles = [];

$('#search-button').bind('click', function(e){
  var searchChoice = $('#search-choice').val();
  var searchTopic = $('#search-topic').val();
  var searchLocation;

  if (searchChoice === "takeHelp") {
    searchLocation = stateNeedHelpLocation;
  } else {
    searchLocation = stateCanHelpLocation;
  }

  var searchQuery = {
    'uid' : 'facebook:10156895568825089',
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
        var resultsArray = JSON.parse(request.responseText)
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
  searchResultsArray.forEach(function(user){
    var uid = Object.keys(user);
    resultsHTML = resultsHTML + '<div id=' + uid[0] +' class="individual"><div>' + user[uid].first_name + '</div><div>' + 'Can Help Here' + user[uid].canHelpLocation +'    Need Help Here' + user[uid].helpNeededLocation + ' Has Skills '+ user[uid].hasSkills + '</div><a href="#profile?id=' + uid[0] + '"><button class=" view-individual ui-btn-inline">View Individual</button></a></div>';
  });
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
    $('.profile').html(createProfile(state.searchResultProfiles[id]));
  } else {
    $.post('/getProfileDetails', {id: id} ,function(data){
      console.log(data);
      $('.profile').html(createProfile(data));
    });
  }
}

function createProfile(profile) {
  var skillsSentence = '';
  var skills = '';
  var needs = '';

  if (profile.shareSkills) {
    skillsSentence = '<h2>' + profile.first_name + '\'s Skills</h2>' + '<p>' + profile.shareSkills + '</p>' || '';
  }
  if (profile.hasSkills) {
    skills = '<h2>' + profile.first_name +' can also help with...</h2>' + profile.hasSkills.map(function(el){
      return '<div>' + el + '</div>';
    }).join('') || '';
  }
  if (profile.skillsNeeded) {
    needs = '<h2>'+ profile.first_name +' needs help with...</h2>' + profile.skillsNeeded.map(function(el){
      return '<div>' + el + '</div>';
    }).join('') || '';
  }
  return ('<h1>Contact ' + profile.first_name + '</h1>' +
     skillsSentence + skills + needs +
    '<div><p>Send ' + profile.first_name + ' Your Details</p>' +
    '<button class="send-message">Send</button></div>'
  );
}

$('.profile').on('click', '.send-message', function(e){
  var authData = JSON.parse(localStorage.getItem('firebase:session::blazing-torch-7074'));
  var currentUid = authData.uid;
  var sendObject = {
    sender : currentUid,
    reciever : 'facebook:74747'};

  $.post('/sendMessage', sendObject, function(data){
    if (data.success){
      // state.contacted.push()
    }
    alert(data.message);
  });
});
