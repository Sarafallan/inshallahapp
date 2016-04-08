var ref = new Firebase('https://blazing-torch-7074.firebaseio.com');

document.getElementById("login-button").addEventListener('click', function(){
  ref.authWithOAuthRedirect("facebook", function(error, authData) {
    if (error) {
      console.log(error);
    }
  });
});

ref.onAuth(function(authData){
  if(authData) {
    var request = new XMLHttpRequest();
    request.open('POST', '/login');
    request.send(JSON.stringify(authData));

    request.onreadystatechange = function(){
      if (request.readyState === 4) {
        if (request.status === 200) {
          var response = JSON.parse(request.responseText);
          if (response.userSetupComplete){
            window.location.href = '/search';
          } else {
            window.location.href = '/setup';
          }
        } else {
          console.log(request.status);
        }
      }
    };
  }

});
