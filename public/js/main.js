$(document).ready(function() {

  // var teamMembers=[];
  //
  // var team={
  //   name:"",
  //   teamMembers:[],
  // };

  var next = 1;

     $(".add-more").click(function(e){
         e.preventDefault();
         //Add the team name to the hidden team name input feild
         var teamNameinput=$('.teamnameinput').val();
         $('#hiddenTeamName')[0].value=teamNameinput;

         var firstName=$('#firstName').val();
         var lastName=$('#lastName').val();
         var email=$('#email').val();
        //  console.log("firstName " + firstName + " " + "lastName " + lastName  + " " + "email " + email);
        //  var teamMember = {
        //     firstName:firstName,
        //     lastName:lastName,
        //     email:email,
        //     id:next,
        //   };
        next+=1;
        var teamMemberIDtag= "teamMember"+next
        var teamMemberFNameIDtag= "teamMemberFName"+next
        var teamMemberLNameIDtag= "teamMemberLName"+next
        var teamMemberEmailIDtag= "teamMemberEmail"+next


        var newTeamMemberStringPt1 = "<div id='"+teamMemberIDtag+"'"+" class='teammember row'>"
        var newTeamMemberStringPt2 = "<div class='form-group'><input id='"+teamMemberFNameIDtag+"'"+'name='+teamMemberFNameIDtag+" type='text' placeholder='First Name' class='form-control'/></div>"
        var newTeamMemberStringPt3 = "<div class='form-group'><input id='"+teamMemberLNameIDtag+"'"+'name='+teamMemberLNameIDtag+" type='text' placeholder='Last Name' class='form-control'/></div>"
        var newTeamMemberStringPt4 = "<div class='form-group'><input id='"+teamMemberEmailIDtag+"'"+'name='+teamMemberEmailIDtag+" type='email' placeholder='Email' class='form-control'/></div>"
        var newTeamMemberStringPt5 = "<button type='button' class='btn remove-me'> - </button></div>"

        newFormFeild = newTeamMemberStringPt1+newTeamMemberStringPt2+newTeamMemberStringPt3+newTeamMemberStringPt4+newTeamMemberStringPt5

        // console.log(teamMember);
        // teamMembers.push(teamMember)
        // console.log(teamMembers);

        $(newFormFeild).insertAfter( "#TeamMembersList" );
        // console.log(teamMemberIDtag);
        $('#SaveTeam').insertAfter('#teamMember2');
        $('#'+teamMemberFNameIDtag)[0].value=firstName;
        $('#'+teamMemberLNameIDtag)[0].value=lastName;
        $('#'+teamMemberEmailIDtag)[0].value=email;

        $('#firstName')[0].value=null;
        $('#lastName')[0].value=null;
        $('#email')[0].value=null;
        checkTeamNumber();

        $('.remove-me').click(function(e){
            console.log(next);
            e.preventDefault();
            $(this).parent().remove();
            checkTeamNumber();
      });

      function checkTeamNumber(){

        teamMemberCount=$(".teammember").length;
        // console.log(teamMemberCount);
        //Add value to team member size form feild
        $('#hiddenTeamSize')[0].value=teamMemberCount;

        // if(teamMemberCount<6){
        //   $('#SaveTeam').prop("disabled", true);
        // }
        // else if(teamMemberCount>=6 && teamMemberCount<=10){
        //   $('#SaveTeam').prop("disabled", false);
        // }
        // if(teamMemberCount>=10){
        //   $('#AddTeamMember').prop("disabled", true);
        // }
        // else if(teamMemberCount<10){
        //   $('#AddTeamMember').prop("disabled", false);
        // }
        //
      }
    });
});
