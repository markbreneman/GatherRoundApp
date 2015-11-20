$(document).ready(function() {

  var teamMembers=[];

  var team={
    name:"",
    teamMembers:[],
  };

  var next = 1;
     $(".add-more").click(function(e){
         e.preventDefault();

         var firstName=$('#firstName').val()
         var lastName=$('#lastName').val()
         var email=$('#email').val()
        //  console.log("firstName " + firstName + " " + "lastName " + lastName  + " " + "email " + email);
         var teamMember = {
            firstName:firstName,
            lastName:lastName,
            email:email,
            id:next,
          };

        console.log(teamMember);
        teamMembers.push(teamMember)
        console.log(teamMembers);
        next+=1;
        var newFormFeild="<input class='input' id='teamMember1FName' type='text'/><input class='input' id='teamMember1LName' type='text'/><input class='input' id='teamMember1Email' type='text'/><button id='b1' class='btn remove-me' type='button'>-</button>"
        $(newFormFeild).insertAfter( "#TeamMembersList" );
        // $('#teamMember1FName')[0].value=firstName;
        // $('#teamMember1LName')[0].value=lastName;
        // $('#teamMember1Email')[0].value=email;


        //  var addto = "#field" + next;
        //  var addRemove = "#field" + (next);
        //  next = next + 1;
        //  var newIn = '<input autocomplete="off" class="input form-control" id="field' + next + '" name="field' + next + '" type="text">';
        //  var newInput = $(newIn);
        //  var removeBtn = '<button id="remove' + (next - 1) + '" class="btn btn-danger remove-me" >-</button></div><div id="field">';
        //  console.log(newInput);
        //  var removeButton = $(removeBtn);
        //  $(addto).after(newInput);
        //  $(addRemove).after(removeButton);
        //  $("#field" + next).attr('data-source',$(addto).attr('data-source'));
        //  $("#count").val(next);
      });

      $('.remove-me').click(function(e){
          e.preventDefault();
         console.log("fired");
          $(this).parent().remove();
          //  var fieldNum = this.id.charAt(this.id.length-1);
          //  var fieldID = "#field" + fieldNum;
      });

});
