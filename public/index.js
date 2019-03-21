var arabicSkills = {
  "Accommodation" : 'سكن',
  "Arabic Lessons" : 'دروس عربي',
  "Asylum System" : 'نظام اللجوء',
  "Border Updates" : 'آخر تطورات الحدود',
  "Child Support" : 'دعم الطفل',
  "Cooking" : 'طهي',
  "Counselling" : 'استشارات',
  "Education" : 'التعليم',
  "English Lessons" : 'دروس انجليزي',
  "French Lessons" : 'دروس فرنسي',
  "Friendship" : 'الصداقة',
  "German Lessons" : 'دروس ألماني',
  "Interview Advice" : 'حول المقابلة',
  "Jobs" : 'أعمال',
  "Legal Help" : 'مساعدة قانونية',
  "Medical Care" : 'عناية طبية',
  "Mentoring" : 'التوجيه',
  "Phone Credit" : 'تعبئة رصيد هاتف',
  "Psychologist" : 'معالج نفسيلا',
  "Translation" : 'الترجمة'
};

var nonDigit = new RegExp(/[^0-9]/g);
var leadingZero = new RegExp(/\b0+/g);

$("#get-started").on('click', function(){
  window.location.href = '/main';
});

// -- Initialise App -- //

$(document).ready(function(){
  state = JSON.parse(localStorage.getItem('state')) || state;
  if (!localStorage.getItem('result') && !state.authData){
    window.location.href = '/';
  }
  state.userProfile.hasSkills = state.userProfile.hasSkills || [];
  state.userProfile.skillsNeeded = state.userProfile.skillsNeeded || [];

  console.log("intialising app");
  renderProfile();
  renderActivity();
});

function renderProfile(){
  var profile = JSON.parse(localStorage.getItem('result'));
  $('.first-name').html(profile.additionalUserInfo.profile.first_name);

  state.userProfile.skillsNeeded.map(function(el){
    displaySkill('.need-skill-box', el, 'skillsNeeded');
  });

  state.userProfile.hasSkills.map(function(el){
    displaySkill('.have-skill-box', el, 'hasSkills');
  });

  $('#country-code').val(state.userProfile.phoneCC);
  $('#tel').val(state.userProfile.phoneNumber);

  $('#locationCity').val(state.userProfile.locationCity);
  $('#locationCountry').val(state.userProfile.locationCountry);

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
  var authData = JSON.parse(localStorage.getItem('result'));
  var currentUid = authData.user.uid;
  state.userProfile.locationCity = sanitise($('#locationCity').val()) || '';
  state.userProfile.locationCountry = sanitise($('#locationCountry').val()) || 'Anywhere';

  state.userProfile.shareSkills = sanitise($('#share-skills').val());
  state.userProfile.anythingElse = sanitise($('#anything-else').val());

  state.userProfile.profileComplete = true;

  var authToken = authData.credential.accessToken;

  var updateUser = {
    'uid' : currentUid,
    'phoneNumber' : state.userProfile.phoneNumber,
    'phoneCC': state.userProfile.phoneCC,
    'skillsNeeded': state.userProfile.skillsNeeded,
    'hasSkills': state.userProfile.hasSkills,
    'locationCity': state.userProfile.locationCity,
    'locationCountry': state.userProfile.locationCountry,
    'shareSkills': state.userProfile.shareSkills,
    'anythingElse': state.userProfile.anythingElse,
    'profileComplete': true
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
  if (digits.length < 9 || digits.length > 15) {
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
  $( "#phoneAlert" ).popup();
  $( "#phoneAlert" ).popup( "open" );
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
  console.log("render");
  $(box).append('<div class="skill"><a href="#" id="' + skill.replace(' ', '') + '-' + skillsArray + '" class="delete-skill ui-btn ui-shadow ui-corner-all ui-icon-delete ui-btn-icon-notext ui-btn-b ui-btn-inline">Delete</a>' + skill + ' / ' + arabicSkills[skill] + '</div>');
  $('#' + skill.replace(' ', '') + '-' + skillsArray).on('click', function(ev){
    deleteSkill(ev, skill, state.userProfile[skillsArray]);
  });
}

// -- Location -- //

$('.getLocation').on('click', function(e){
  if (!navigator.geolocation) {
    $( "#geoUnavailable" ).popup();
    $( "#geoUnavailable" ).popup( "open" );
  }

  navigator.geolocation.getCurrentPosition(function(position){
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    $.post('/location', {latitude: latitude, longitude: longitude}, function(data){
      var locCity = $('#locationCity');
      var locCountry = $('#locationCountry');
      var city = data.city;
      var country = data.country;
      if (data.city && data.country) {
        locationCity = data.city;
        locationCountry = data.country;
      } else if (data.country) {
        locationCountry = data.country;
        locationCity = '';
      } else {
        locationCountry = 'Anywhere';
        locationCity = '';
      }
      locCity.val(locationCity);
      locCountry.val(locationCountry);
    });
  }, function(error){
    if (error.code === 1) {
      $( "#geoDenied" ).popup();
      $( "#geoDenied" ).popup( "open" );
    } else {
      $( "#geoError" ).popup();
      $( "#geoError" ).popup( "open" );
    }
  });
});

// -- Header Menu -- //

var menu = {
  html: '<div class="modal"><div class="links"><ul><a href="#signup-1"><li>My Inshallah Profile / صفحتي الشخصية</li></a><a href="#search"><li>Search / بحث</li></a><a href="#about"><li class="about">About Inshallah</li></a><a href="https://docs.google.com/forms/d/16EC6IcvYIWvaEvRRHBZYlpaMbo6eLCl4Dud3miyoZE0/viewform"><li>Contact Inshallah / اتصل بنا</li></a><a onclick="logout()"><li class="logout">Log Out</li></a></ul></div></div>',
  visible: false,
};

//Add in when info there -> <a href="#information"><li>Information / معلومات/li></a>
//Add in when activity readdedd - <a href="#activity"><li>My Activity / نشاطي</li></a>

$('.hamburger').on('click', function(){
  console.log("menu click");
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

function logout() {
    document.cookie.split(";").forEach(function(c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
    localStorage.clear();
    window.location.replace('/');
}

// -- Activity Page -- //

function renderActivity() {
    state.contacted = [];
    state.receivedContact = [];

  // for (var key in state.userProfile.contact_sent) {
  //   state.contacted.push(state.userProfile.contact_sent[key]);
  //   console.log("contacted", state.contacted);
  // }
  //
  //
  // for (var item in state.userProfile.contact_recieved) {
  //   state.receivedContact.push(state.userProfile.contact_recieved[item]);
  //   console.log("recieved", state.receivedContact);
  // }
  //
  // $('.sent').append(state.contacted.map(function(el){
  //   //var starClass = checkStar(el);
  //   // <button class="star" +starClass+><img src="./assets/star.png"/></button>
  //
  //   return (
  //     '<div class="activity-individual"><a class="profile-link" href="#profile?id=' + el.uid + '"><div class="activity-name">' + el.name + '</div></a></div>'
  //   );
  // }));
  //
  // $('.received').append(state.receivedContact.map(function(el){
  //   //var starClass = checkStar(el);
  //
  //   return (
  //     '<div class="activity-individual"><a class="profile-link" href="#profile?id=' + el.uid + '"><div class="activity-name">' + el.name + '</div></a></div>'
  //   );
  // }));
  //
  // $('.sent-nav').on('click', function(){
  //   $('.sent').removeClass('hidden');
  //   $('.received').addClass('hidden');
  // });
  //
  // $('.received-nav').on('click', function(){
  //   $('.received').removeClass('hidden');
  //   $('.sent').addClass('hidden');
  // });
}

//Star function - not displayed for now.

// $('.activity').on('click', '.star', function(e){
//     var currentUser = JSON.parse(localStorage.getItem(Settings.FIREBASE_STORAGE_KEY));
//     var currentid = currentUser.uid;
//     var userStarred;
//
//     userStar = e.target.toString();
//     if (userStar.indexOf('Image') > -1){
//       userStarred = $(e.target).parent();
//     } else {
//       userStarred = e.target;
//     }
//
//     var activityIndividual = $(userStarred).parent()[0].parentElement;
//     var link = $(activityIndividual).find('a:first').attr('href');
//     var useridToStar = link.split('id=')[1];
//
//     if (state.userProfile.profileComplete) {
//       if ($(userStarred).hasClass('starred')) {
//         $.post('/removeStar', {'currentUser' : currentid, 'useridToStar': useridToStar}, function(data){
//           if (data === 'unstarred'){
//             $(userStarred).removeClass('starred');
//             $(userStarred).addClass('unstarred');
//           }
//         });
//
//       } else {
//         $.post('/addStar', {'currentUser' : currentid,'useridToStar': useridToStar}, function(data){
//           if (data === 'starred'){
//             $(userStarred).addClass('starred');
//             $(userStarred).removeClass('unstarred');
//           }
//         });
//       }
//     } else {
//       $( "#profileIncomplete" ).popup();
//       $( "#profileIncomplete" ).popup( "open" );
//     }
// });

function checkStar(el) {
  if (el.star_status === "unstarred") {
    return "unstarred";
  } else {
    return "starred";
  }
}
