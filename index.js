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
  alert('Please enter a phone number to create your account');
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

// -- Location -- //

$('.getLocation').on('click', function(e){
  var availability;

  if (!navigator.geolocation) {
    alert('Geolocation is not available on this browser/device.');
  }

  if ($(e.target).hasClass('help-needed-location')) {
    availability = 'help-needed-location';
  } else if ($(e.target).hasClass('can-help-location')) {
    availability = 'can-help-location';
  }

  navigator.geolocation.getCurrentPosition(function(position){
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    $.post('/location', {latitude: latitude, longitude: longitude}, function(data){
      var select = $('select#' + availability);
      var optTempl = '<option selected value="' + data.country + '">'+ data.city + ', ' + data.country +'</option>';
      select.prepend(optTempl);
      select.selectmenu();
      select.selectmenu('refresh', true);
    });
  }, function(error){
    if (error.code === 1) {
      alert("Geolocation has been denied on this page. Please select your location from the dropdown menu.");
    } else {
      alert("We couldn't get your location. Please ensure geolocation is turned on and try again.")
    }
  });

});

// -- Header Menu -- //

var menu = {
  html: '<div class="modal"><div class="links"><ul><a href="/main"><li>My INshallah Page</li></a><a href="#search"><li>Search</li></a><a href="#activity"><li>Your Activity</li></a><a href="#"><li>Contact INshallah</li></a></ul></div></div>',
  visible: false,
}

$('.hamburger').on('click', function(){
  toggleMenu();
});

function toggleMenu() {
  if (menu.visible) {
    $('.modal').remove();
    menu.visible = false;
  } else {
    $('body').prepend(menu.html);
    $('.modal, .links ul a').on('click', function(){
      toggleMenu();
    });
    menu.visible = true;
  }
}

// -- Activity Page -- //

var contacted = [{display_name: 'Sohil', uid: 'facebook:74747'}];
var received = [{display_name: 'Naaz', uid: 'facebook:23534643'}];

$('.sent').append(contacted.map(function(el){
  return (
    '<div>' + el.display_name + '</div>'
  );
}));

$('.received').append(received.map(function(el){
  return (
    '<div>' + el.display_name + '</div>'
  );
}));

$('.sent-nav').on('click', function(){
  $('.sent').removeClass('hidden');
  $('.received').addClass('hidden');
});

$('.received-nav').on('click', function(){
  $('.received').removeClass('hidden');
  $('.sent').addClass('hidden');
});
