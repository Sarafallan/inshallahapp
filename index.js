var arabicSkills = {
  'Accommodation': 'سكن',
  'Advice': 'سكن',
  'Arabic Lessons': 'سكن',
  'Asylum System': 'سكن',
  'Border Updates': 'سكن',
  'Child Support': 'سكن',
  'English Lessons': 'سكن',
  'Emotional Support': 'سكن',
  'Financial Advice': 'سكن',
  'Form Filling': 'سكن',
  'Friendship': 'سكن',
  'Jobs': 'سكن',
  'Legal Help': 'سكن',
  'Medical Care': 'سكن',
  'Mentoring': 'سكن',
  'Psychologist': 'سكن',
  'Studying': 'سكن',
  'Translation': 'سكن',
};
var nonDigit = new RegExp(/[^0-9]/, 'g');
var leadingZero = new RegExp(/\b0+/, 'g');

// -- Initialise App -- //

$(document).ready(function(){
  if (!localStorage.getItem('firebase:session::blazing-torch-7074')){
    window.location.href = '/';
  }
  state = JSON.parse(localStorage.getItem('state')) || state;
  renderProfile();
  renderActivity();
});

function renderProfile(){
  var profile = JSON.parse(localStorage.getItem('firebase:session::blazing-torch-7074'));

  $('.first-name').html(profile.facebook.cachedUserProfile.first_name);

  state.userProfile.skillsNeeded.map(function(el){
    displaySkill('.need-skill-box', el, 'skillsNeeded');
  });

  state.userProfile.hasSkills.map(function(el){
    displaySkill('.have-skill-box', el, 'hasSkills');
  });

  $('#country-code').val(state.userProfile.phoneCC);
  $('#tel').val(state.userProfile.phoneNumber);

  $('#location').val(state.userProfile.location);

  $('#share-skills').val(state.userProfile.shareSkills);
  $('#anything-else').val(state.userProfile.anythingElse);
}

// -- Sending Data to Database From Signup/Update Profile -- //

$('#save-button').on('click', function(){
  state.userProfile.phoneNumber = validatePhone();
  state.userProfile.phoneCC = validatePhoneCC();
  if (state.userProfile.phoneNumber && state.userProfile.phoneCC){
    saveProfile();
  } else {
    showWarning();
  }
});

function saveProfile() {
  var authData = JSON.parse(localStorage.getItem('firebase:session::blazing-torch-7074'));
  var currentUid = authData.uid;

  state.userProfile.location = sanitise($('#location').val()) || 'Anywhere';

  state.userProfile.shareSkills = sanitise($('#share-skills').val());
  state.userProfile.anythingElse = sanitise($('#anything-else').val());

  var authToken = authData.token;

  var updateUser = {
    'uid' : currentUid,
    'phoneNumber' : state.userProfile.phoneNumber,
    'phoneCC': state.userProfile.phoneCC,
    'story' : state.userProfile.story,
    'skillsNeeded': state.userProfile.skillsNeeded,
    'hasSkills': state.userProfile.hasSkills,
    'location': state.userProfile.location,
    'shareSkills': state.userProfile.shareSkills,
    'anythingElse': state.userProfile.anythingElse,
  };

  localStorage.setItem('state', JSON.stringify(state));

  var request = new XMLHttpRequest();
  request.open('POST', '/saveProfile');
  request.send(JSON.stringify({token: authToken, userProfile: updateUser}));

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
  var digits = phoneNum.replace(nonDigit, '').replace(leadingZero, '');
  if (digits.length < 10 || digits.length > 15) {
    return '';
  } else {
    return digits;
  }
}

function validatePhoneCC() {
  var countryCode = $('#country-code').val();
  var countryDigits = countryCode.replace(nonDigit, '').replace(leadingZero, '');
  return '+' + countryDigits;
}

function showWarning() {
  alert('Please enter a valid phone number to create your account');
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
    addSkill(e, 'skillsNeeded', '.need-skill-box');
  } else if ($(this).hasClass('have-skill-select')) {
    addSkill(e, 'hasSkills', '.have-skill-box');
  }
});

function deleteSkill(e, skill, skillsArray) {
  $(e.target.parentElement).remove();
  skillsArray.splice(skillsArray.indexOf(skill), 1);
}

function addSkill(e, skillsArray, box) {
  var skill = $(e.target).val();
  if (state.userProfile[skillsArray].indexOf(skill) === -1 && state.userProfile[skillsArray].length < 5) {
    state.userProfile[skillsArray].push(skill);
    displaySkill(box, skill, skillsArray);
  }
}

function displaySkill(box, skill, skillsArray){
  $(box).append('<div class="skill"><a href="#" id=' + skill + '-' + skillsArray + ' class="delete-skill ui-btn ui-shadow ui-corner-all ui-icon-delete ui-btn-icon-notext ui-btn-b ui-btn-inline">Delete</a>' + skill + ' / ' + arabicSkills[skill] + '</div>');
  $('#' + skill + '-' + skillsArray).on('click', function(ev){
    deleteSkill(ev, skill, state.userProfile[skillsArray]);
  });
}

// -- Location -- //

$('.getLocation').on('click', function(e){
  if (!navigator.geolocation) {
    alert('Geolocation is not available on this browser/device.');
  }

  navigator.geolocation.getCurrentPosition(function(position){
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    $.post('/location', {latitude: latitude, longitude: longitude}, function(data){
      var select = $('#location');
      var city = data.city;
      var country = data.country;
      var location;
      if (data.city && data.country) {
        location = data.city + ', ' + data.country;
      } else if (data.country) {
        location = data.country;
      } else {
        location = 'Anywhere';
      }
      select.val(location);
    });
  }, function(error){
    if (error.code === 1) {
      alert("Geolocation has been denied on this page. Please select 'Anywhere' from the dropdown menu.");
    } else {
      alert("We couldn't get your location. Please ensure geolocation is turned on and try again.");
    }
  });
});

// -- Header Menu -- //

var menu = {
  html: '<div class="modal"><div class="links"><ul><a href="/main"><li>My INshallah Page</li></a><a href="#search"><li>Search</li></a><a href="#activity"><li>Your Activity</li></a><a href="#information"><li>Information</li></a><a href="https://docs.google.com/forms/d/16EC6IcvYIWvaEvRRHBZYlpaMbo6eLCl4Dud3miyoZE0/viewform"><li>Contact INshallah</li></a></ul></div></div>',
  visible: false,
};

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

function renderActivity() {
    state.contacted = [];
    state.receivedContact = [];

  for (var key in state.userProfile.contact_sent) {
    state.contacted.push(state.userProfile.contact_sent[key]);
  }

  for (var key in state.userProfile.contact_recieved) {
    state.contacted.push(state.userProfile.contact_recieved[key]);
  }

  $('.sent').append(state.contacted.map(function(el){
    var starClass;
    if (el.star_status === "unstarred") {
      starClass = "unstarred";
      console.log("un", starClass);
    } else {
      starClass = "starred";
      console.log("st", el.star_status);
    }

    return (
      '<div class="activity-individual"><a class="profile-link" href="#profile?id=' + el.uid + '"><div>' + el.name + '</div></a><div><button class="star ' + starClass + '">Star</button></div></div>'
    );
  }));

  $('.received').append(state.receivedContact.map(function(el){
    return (
      '<a href="#profile?id=' + el.uid + '"><div>' + el.name + '</div></a>'
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
}

//Star function

$('.sent').on('click', '.star', function(e){

    var userStarred = e.target;
    var activityIndividual = $(userStarred).parent()[0].parentElement;
    var link = $(activityIndividual).find('a:first').attr('href');
    var useridToStar = link.split('id=')[1];

    console.log(useridToStar);

    if ($(userStarred).hasClass('starred')) {
      $.post('/removeStar', function(data){
        if (data === 'success'){
          $(userStarred).removeClass('starred');
          $(userStarred).addClass('unstarred');
       console.log('star removed', userStarred);
        }
      });

    } else {
      $.post('/addStar', function(data){
        if (data === 'success'){
          $(userStarred).addClass('starred');
          $(userStarred).removeClass('unstarred');
          console.log('star added', userStarred);
        }
      });
    }
  });
