$(document).ready(function() {

    //ADD REMOVE TEAM MEMBERS
    var maxteamSize=10;
    var minteamSize=2;
    var next = 1;
     $(".add-more").click(function(e){
         e.preventDefault();
         //Add the team name to the hidden team name input feild
         var teamNameinput=$('.teamnameinput').val();
         $('#hiddenTeamName')[0].value=teamNameinput;

         var firstName=$('#FirstName').val();
         var lastName=$('#LastName').val();
         var email=$('#Email').val();

        next+=1;
        var teamMemberIDtag= "teamMember"+next
        var teamMemberFNameIDtag= "teamMemberFName"+next
        var teamMemberLNameIDtag= "teamMemberLName"+next
        var teamMemberEmailIDtag= "teamMemberEmail"+next


        var newTeamMemberStringPt1 = "<div id='"+teamMemberIDtag+"'"+" class='teammember row'>"
        var newTeamMemberStringPt2 = "<div class='form-group col-md-2'><input id='"+teamMemberFNameIDtag+"'"+'name='+teamMemberFNameIDtag+" type='text' placeholder='First Name' class='form-control teammemberfnameinput'/></div>"
        var newTeamMemberStringPt3 = "<div class='form-group col-md-2'><input id='"+teamMemberLNameIDtag+"'"+'name='+teamMemberLNameIDtag+" type='text' placeholder='Last Name' class='form-control teammemberlnameinput'/></div>"
        var newTeamMemberStringPt4 = "<div class='form-group col-md-4'><input id='"+teamMemberEmailIDtag+"'"+'name='+teamMemberEmailIDtag+" type='email' placeholder='Email' class='form-control teammemberemailinput'/></div>"
        var newTeamMemberStringPt5 = "<button type='button' class='btn remove-me col-md-offset-3'><img src='img/delete.png'></button>"
        var newTeamMemberStringPt6 = "<hr></div>"

        newFormFeild = newTeamMemberStringPt1+newTeamMemberStringPt2+newTeamMemberStringPt3+newTeamMemberStringPt4+newTeamMemberStringPt5+newTeamMemberStringPt6

        // $(newFormFeild).insertAfter( "#TeamMembersList" );
        $(newFormFeild).insertAfter( "#AddedTeamNames" );

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
            checkTeamNumber();
      });

      function checkTeamNumber(){

        teamMemberCount=$(".teammember").length;
        // console.log(teamMemberCount);
        //Add value to team member size form feild
        $('#hiddenTeamSize')[0].value=teamMemberCount;

        if(teamMemberCount<minteamSize){
          $('#SaveTeam').prop("disabled", true);
        }
        else if(teamMemberCount>=minteamSize && teamMemberCount<=maxteamSize){
          $('#SaveTeam').prop("disabled", false);
        }
        if(teamMemberCount>=maxteamSize){
          $('#AddTeamMember').prop("disabled", true);
        }
        else if(teamMemberCount<maxteamSize){
          $('#AddTeamMember').prop("disabled", false);
        }

      }
    });

    //ADD REMOVE TEAM MEMBERS PLACE Order
    $('.switch').on('click',function(e){

      //GET THE SELECTED INPUT ASSOCIATE WITH THE SWITCH
      var selectedInput=$(this).children()[0];
      // console.log(selectedInput);
      //GET USER NAME EMAIL, AND CIRCLE NEXT TO SWITCH
      var userNameEmail=$($($(this).parent()[0]).prev()[0]);
      // console.log(userNameEmail[0]);
      var userCircle=$($($(this).parent()[0]).prev()).prev()[0];
      // console.log(usercircle);
      //TOGGLE CHECKED STATE OF INPUT AND CHANGE LABEL OPACITY
      if($(selectedInput).is(':checked'))
        {
          $(selectedInput).attr ( "checked" ,"checked" );
          $(userNameEmail).css({'opacity':'1'});
          $(userCircle).css({'opacity':'1'});

        }
      else
        {
           $(selectedInput).removeAttr('checked');
           $(userNameEmail).css({'opacity':'.2'});
           $(userCircle).css({'opacity':'.2'});

        }

      });

});
