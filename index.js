var skillsNeeded = [];
var hasSkills = [];

var arabicSkills = {
  Law: 'بلا',
  Advice: 'بلا',
  Asylum: 'بلا',
};

// -- Sending Data to Database From Signup/Update Profile -- //

$('#save-button').on('click', function(){
  console.log('save clicked');
  var phoneNumber = validatePhone();
  if (phoneNumber){
    saveProfile(phoneNumber);
  } else {
    showWarning();
  }
});

function saveProfile(phoneNumber) {
  var authData = JSON.parse(localStorage.getItem('firebase:session::blazing-torch-7074'));
  var currentUid = authData.uid;

  var helpNeededLocation = $('#help-needed-location').val();
  var canHelpLocation = $('#can-help-location').val();

  var tel = phoneNumber;

  var story = sanitise($('#story').val());
  var shareSkills = sanitise($('#share-skills').val());
  var anythingElse = sanitise($('#anything-else').val());

  var updateUser = {
    'uid' : currentUid,
    'tel' : tel,
    'story' : story,
    'skillsNeeded': skillsNeeded,
    'hasSkills': hasSkills,
    'helpNeededLocation': helpNeededLocation,
    'shareSkills': shareSkills,
    'canHelpLocation': canHelpLocation
  };

  console.log(updateUser);

  var request = new XMLHttpRequest();
  request.open('POST', '/saveProfile');
  request.send(JSON.stringify(updateUser));

  request.onreadystatechange = function(){
    if (request.readyState === 4) {
      if (request.status === 200) {
        window.location.href = '/main#search';
        console.log('search');
      } else {
        console.log('error, in search');
      }
    }
  };
}

// -- Validation Functions -- //

function validatePhone() {

  var phoneNum = $('#tel').val();
  var countryCode = $('#country-code').val();
  var nonDigit = new RegExp(/[^0-9]/, 'g');
  var leadingZero = new RegExp(/\b0+/, 'g')
  var digits = phoneNum.replace(nonDigit, '').replace(leadingZero, '');
  var countryDigits = countryCode.replace(nonDigit, '').replace(leadingZero, '');
  if (digits.length < 10 || digits.length > 15) {
    return false;
  } else {
    return '+' + countryDigits + digits;
  }
}

function showWarning() {
  console.log('wrong number');
}

function sanitise(input) {

  if ( input.match("<") || input.match(">") ) {
    cleanText = input.replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
    return cleanText;
  }
  return input;
}


// -- Skills box functions -- //

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
