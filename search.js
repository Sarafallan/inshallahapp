var searchResultProfiles = [];

$('#search-button').bind('click', function(e){
  console.log('search clicked');
  var searchChoice = $('#search-choice').val();
  var searchTopic = $('#search-topic').val();

  var searchQuery = {
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
        searchResultProfiles = arrayToObject(resultsArray);
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
    console.log(uid);
    resultsHTML = resultsHTML + '<div id=' + uid[0] +' class="individual"><div>' + user[uid].first_name + '</div><div>' + user[uid].hasSkills + '</div><button class=" view-individual ui-btn-inline">View Individual</button></div>';
    console.log('results>', resultsHTML);
  });
  $('.results-box').html(resultsHTML);
}

$(document.body).on('click', '.view-individual', function(e){
  var selectedID = e.target.parentElement.id;
  $('.profile').html(createProfile(searchResultProfiles[selectedID]));
  window.location.href = '#profile';
});

function arrayToObject(array) {
  return array.reduce(function(object, element){
    var firstKey = Object.keys(element)[0];
    object[firstKey] = element[firstKey];
    return object;
  }, {});
}

function createProfile(profile) {
  return ('<h1>Contact ' + profile.first_name + '</h1>' +
    '<h2>' + profile.first_name + '\'s Skills</h2>' +
    '<p>' + profile.shareSkills + '</p>' +
    '<h2>' + profile.first_name +' can also help with...</h2>' + profile.hasSkills.map(function(el){
      return '<div>' + el + '</div>';
    }).join('') +
    '<h2>'+ profile.first_name +' needs help with...</h2>' + profile.skillsNeeded.map(function(el){
      return '<div>' + el + '</div>';
    }).join('') +
    '<div><p>Send ' + profile.first_name + ' Your Details</p>' +
    '<button>Send</button></div>'
  );
}
