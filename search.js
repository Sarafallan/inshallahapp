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
        renderResults(JSON.parse(request.responseText));
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
    resultsHTML = resultsHTML + '<div class="individual"><div>' + user[uid].first_name + '</div><div>' + user[uid].hasSkills + '</div><button id="view-individual" class="ui-btn-inline">View Individual</button></div>';
    console.log('results>', resultsHTML);
  });
  $('.results-box').html(resultsHTML);
}
