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

         var firstName=$('#FirstName').val();
         var lastName=$('#LastName').val();
         var email=$('#Email').val();
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
        var teamMemberhr= "teamMemberhr"+next


        var newTeamMemberStringPt1 = "<div id='"+teamMemberIDtag+"'"+" class='teammember row'>"
        var newTeamMemberStringPt2 = "<div class='form-group col-md-2'><input id='"+teamMemberFNameIDtag+"'"+'name='+teamMemberFNameIDtag+" type='text' placeholder='First Name' class='form-control teammemberflnameinput'/></div>"
        var newTeamMemberStringPt3 = "<div class='form-group col-md-2'><input id='"+teamMemberLNameIDtag+"'"+'name='+teamMemberLNameIDtag+" type='text' placeholder='Last Name' class='form-control teammemberfnameinput'/></div>"
        var newTeamMemberStringPt4 = "<div class='form-group col-md-4'><input id='"+teamMemberEmailIDtag+"'"+'name='+teamMemberEmailIDtag+" type='email' placeholder='Email' class='form-control teammemberemailinput'/></div>"
        var newTeamMemberStringPt5 = "<button type='button' class='btn remove-me col-md-offset-3'><img src='img/delete.png'></button>"
        var newTeamMemberStringPt6 = "<hr></div>"
        newFormFeild = newTeamMemberStringPt1+newTeamMemberStringPt2+newTeamMemberStringPt3+newTeamMemberStringPt4+newTeamMemberStringPt5+newTeamMemberStringPt6

        // console.log(teamMember);
        // teamMembers.push(teamMember)
        // console.log(teamMembers);

        $(newFormFeild).insertAfter( "#hiddenTeamSize" );
        // console.log(teamMemberIDtag);
        // $('#SaveTeam').insertAfter('#teamMember2');
        $('#'+teamMemberFNameIDtag)[0].value=firstName;
        $('#'+teamMemberLNameIDtag)[0].value=lastName;
        $('#'+teamMemberEmailIDtag)[0].value=email;

        $('#FirstName')[0].value=null;
        $('#LastName')[0].value=null;
        $('#Email')[0].value=null;
        checkTeamNumber();

        $('.remove-me').click(function(e){
            console.log(next);
            e.preventDefault();
            $(this).parent().remove();
            console.log($(this).parent().next());


            checkTeamNumber();
      });

      function checkTeamNumber(){

        teamMemberCount=$(".teammember").length;
        console.log(teamMemberCount);
        //Add value to team member size form feild
        $('#hiddenTeamSize')[0].value=teamMemberCount;

        if(teamMemberCount<6){
          $('#SaveTeam').prop("disabled", true);
        }
        else if(teamMemberCount>=6 && teamMemberCount<=10){
          $('#SaveTeam').prop("disabled", false);
        }
        if(teamMemberCount>=10){
          $('#AddTeamMember').prop("disabled", true);
        }
        else if(teamMemberCount<10){
          $('#AddTeamMember').prop("disabled", false);
        }

      }
    });
});
