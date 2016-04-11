$('#select').on('click',function(){
  console.log('click');
});

$('#save-button').on('click', function(){
  console.log('save clicked');
  saveProfile();
});

function saveProfile() {
  //Looks at array of elements in the box
  var authData = JSON.parse(localStorage.getItem('firebase:session::blazing-torch-7074'));
  var currentUid = authData.uid;

  var story = $('#story').val();
  var tel = $('#tel').val();

  var updateUser = {
    'uid' : currentUid,
    'tel' : tel,
    'story' : story
  };

  console.log(updateUser);

  var request = new XMLHttpRequest();
  request.open('POST', '/saveProfile');
  request.send(JSON.stringify(updateUser));

  request.onreadystatechange = function(){
    if (request.readyState === 4) {
      if (request.status === 200) {
        console.log('helo');
      } else {
        console.log('hi');
      }
    }
  };
}
