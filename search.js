$('#search-button').bind('click', function(e){
  console.log('search clicked');
  var searchChoice = $('#search-choice').val();
  var searchTopic = $('#search-topic').val();

  var searchQuery = {
    'searchChoice' : searchChoice,
    'searchTopic' : searchTopic
  };

  console.log(searchQuery);

  var request = new XMLHttpRequest();
  request.open('POST', '/returnSearch');
  request.send(JSON.stringify(searchQuery));

  request.onreadystatechange = function() {
    if (request.readyState === 4) {
      if (request.status === 200) {
        console.log(request.responseText);
      } else {
        console.log('function error');
      }
    }
  };

});
