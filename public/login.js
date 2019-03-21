let config = {
  databaseURL: Settings.FIREBASE_DOMAIN,
  apiKey: Settings.API_KEY,
  authDomain: Settings.AUTH_DOMAIN
};

firebase.initializeApp(config)

if (document.getElementById('login-button')){
  document.getElementById("login-button").addEventListener('click', function(){
    callAuth();
  });
  document.getElementById('login-button-arabic').addEventListener('click', function(){
    callAuth();
  });
}

function callAuth() {
  var provider = new firebase.auth.FacebookAuthProvider();
  firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) =>{
      if (result.credential) {
        var request = new XMLHttpRequest();
        request.open("POST", "/login");
        request.send(JSON.stringify(result));
        request.onreadystatechange = function() {
          if (request.readyState === 4) {
            if (request.status === 200) {
              var response = JSON.parse(request.responseText);
              state.userProfile = buildProfile(response.userProfile);
              localStorage.setItem("state", JSON.stringify(state));
              localStorage.setItem("result", JSON.stringify(result));
              if (response.userSetupComplete) {
                if (window.location.pathname === "/") {
                  window.location.href = "/main#search";
                }
              } else {                                
                window.location.href = "/about";
              }
            } else {
              console.log(request.status);
            }
          }
        };
      }
    })
    .catch((error) =>{
      console.log(error);
    });
}

function buildProfile(databaseProfile) {
  var newProfile = {};
  newProfile['skillsNeeded'] = databaseProfile['skillsNeeded'] || [];
  newProfile['hasSkills'] = databaseProfile['hasSkills'] || [];
  newProfile['phoneNumber'] = databaseProfile['phoneNumber'] || '';
  newProfile['phoneCC'] = databaseProfile['phoneCC'] || '';
  newProfile['locationCity'] = databaseProfile['locationCity'] || '';
  newProfile['locationCountry'] = databaseProfile['locationCountry'] || '';
  newProfile['shareSkills'] = databaseProfile['shareSkills'] || '';
  newProfile['anythingElse'] = databaseProfile['anythingElse'] || '';
  newProfile['contact_sent'] = databaseProfile['contact_sent'] || [];
  newProfile['contact_recieved'] = databaseProfile['contact_recieved'] || [];
  newProfile['profileComplete'] = databaseProfile['profileComplete'] || false;
  return newProfile;
}
