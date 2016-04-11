var arabicSkills = {
  Law: 'بلا',
  Advice: 'بلا',
  Asylum: 'بلا',
};

var skills = [];

$('.need-skill-select').on('change',function(e){
  var skill = $(e.target).val();
  if (skills.indexOf(skill) === -1 && skills.length < 5) {
    skills.push(skill);
    $('.skill-box').append('<div class="skill"><a href="#" id=' + skill  + ' class="delete-skill ui-btn ui-shadow ui-corner-all ui-icon-delete ui-btn-icon-notext ui-btn-b ui-btn-inline">Delete</a>' + skill + ' / ' + arabicSkills[skill] + '</div>');
    $('#' + skill).on('click', function(ev){
      deleteSkill(ev, skill)
    });
  }
});

function deleteSkill(e, skill) {
  $(e.target.parentElement).remove();
  skills.splice(skills.indexOf(skill), 1);
}
