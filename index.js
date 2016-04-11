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
    addSkill(e, skillsNeeded, '.have-skill-box');
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
