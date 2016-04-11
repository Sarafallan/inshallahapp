
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

var arabicSkills = {
  Law: 'بلا',
  Advice: 'بلا',
  Asylum: 'بلا',
};

var skillsNeeded = [];
var hasSkills = [];

$('.select').on('change',function(e){

  if ($(this).hasClass('need-skill-select')) {
    addSkill(e, skillsNeeded, '.need-skill-box');
  } else if ($(this).hasClass('have-skill-select')) {
    addSkill(e, hasSkills, '.have-skill-box');
  }
});

function deleteSkill(e, skill, skillsArray) {

  $(e.target.parentElement).remove();
  skillsArray.splice(skillsArray.indexOf(skill), 1);
}

function addSkill(e, skillsArray, box) {

  var skill = $(e.target).val();

  if (skillsArray.indexOf(skill) === -1 && skillsArray.length < 5) {
    skillsArray.push(skill);
    $(box).append('<div class="skill"><a href="#" id=' + skill  + ' class="delete-skill ui-btn ui-shadow ui-corner-all ui-icon-delete ui-btn-icon-notext ui-btn-b ui-btn-inline">Delete</a>' + skill + ' / ' + arabicSkills[skill] + '</div>');
    $('#' + skill).on('click', function(ev){

      deleteSkill(ev, skill, skillsArray);
    });
  }
}
