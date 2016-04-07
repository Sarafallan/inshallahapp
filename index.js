var ref = new Firebase('https://blazing-torch-7074.firebaseio.com');

document.getElementById("login-button").addEventListener('click', function(){
  ref.authWithOAuthPopup("facebook", function(error, authData) {
    if (error) {
      if (error.code === "TRANSPORT_UNAVAILABLE") {
        ref.authWithOAuthRedirect("facebook", function(error) {
            if (error) {
              console.log(error);
            }
        });
      }
    } else if (authData) {
      console.log('authData',authData);
      // user authenticated with Firebase
    }
  });
})
