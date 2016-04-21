var ref = new Firebase('https://blazing-torch-7074.firebaseio.com');

if (document.getElementById('login-button')){
  document.getElementById("login-button").addEventListener('click', function(){
    ref.authWithOAuthRedirect("facebook", function(error, authData) {
      if (error) {
        console.log(error);
      }
    });
  });
}

ref.onAuth(function(authData){
  if(authData) {
    var request = new XMLHttpRequest();
    request.open('POST', '/login');
    request.send(JSON.stringify(authData));

    request.onreadystatechange = function(){
      if (request.readyState === 4) {
        if (request.status === 200) {
          var response = JSON.parse(request.responseText);
          state.userProfile = response.userProfile;
          state.authData = authData;
          localStorage.setItem('state', JSON.stringify(state));
          if (response.userSetupComplete){
            if(window.location.pathname === '/'){
              window.location.href = '/main#search';
            };
          } else {
            window.location.href = '/main';
          }
        } else {
          console.log(request.status);
        }
      }
    };
  }

});
