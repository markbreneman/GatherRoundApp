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
        //GET USER NAME EMAIL DIV, AND CIRCLE NEXT TO SWITCH
        var userNameEmail=$($($(this).parent()[0]).prev()[0]);
        // console.log(userNameEmail[0]);
        var userCircle=$($($(this).parent()[0]).prev()).prev()[0];
        // console.log(usercircle);
        var userEmailString=$(userNameEmail[0]).children('p')[1].innerHTML
        // console.log(userEmailString);

        var inputsarray = $('.form-control');

        //TOGGLE CHECKED STATE OF INPUT AND CHANGE LABEL OPACITY
        if($(selectedInput).is(':checked'))
          {
            $(selectedInput).attr ( "checked" ,"checked" );
            $(userNameEmail).css({'opacity':'1'});
            $(userCircle).css({'opacity':'1'});
            enableFormFeild();
          }
        else
          {
             $(selectedInput).removeAttr('checked');
             $(userNameEmail).css({'opacity':'.2'});
             $(userCircle).css({'opacity':'.2'});
             disableFormFeild();

          }

        //THE FOLLOWING FUNCTIONS DO A QUERY ON FORM ELEMENTS TO FIND THE FORM FEILDS WHICH
        //HAVE MATCHIN EMAIL ATTRIBUTES(ASSUMING NO TWO ALIKE EMAILS)THEN DISABLE/ENABLES THE
        //USER FEILDS
        function enableFormFeild(){
                    for (i=0; i<inputsarray.length; i++){
                      // console.log($(inputsarray[i]).attr('value'));
                      if($(inputsarray[i]).attr('value')==userEmailString){
                        // console.log("i=" + i );
                        $(inputsarray[i]).prop('disabled',false);
                        $(inputsarray[i-1]).prop('disabled',false);
                        $(inputsarray[i-2]).prop('disabled',false);
                      }
                    }
        }

        function disableFormFeild(){
          for (i=0; i<inputsarray.length; i++){
            // console.log($(inputsarray[i]).attr('value'));
            if($(inputsarray[i]).attr('value')==userEmailString){
              // console.log("i=" + i );
              $(inputsarray[i]).prop('disabled',true);
              $(inputsarray[i-1]).prop('disabled',true);
              $(inputsarray[i-2]).prop('disabled',true);

            }
          }
        }
      });

    //ADD GUEST MODAL
    $('#AddGuest').on('click',function(e){
      //Get the values of the guest form
      var guestfname =  $('#GuestFName').val();
      var guestlname =  $('#GuestLName').val();
      var guestemail =  $('#GuestEmail').val();
      var guestinitials = guestfname.charAt(0)+guestlname.charAt(0);
      var guestfullname = guestfname+" "+guestlname;


      //Clear the add guest form
      $('#GuestFName')[0].value=null;
      $('#GuestLName')[0].value=null;
      $('#GuestEmail')[0].value=null;
      //How many team members?+new guest
      var teamlength = $('.teamtogglelist .teammemberrow').length
      console.log("teamlength= " + teamlength)

      var newTeamToggle1="<div class='row teammemberrow' id='teammembertoggle"+teamlength+"'"+ "><div class='col-md-2 hidden-xs'><p class='btn-circle'>";
      var newTeamToggle2="</p></div><div class='col-xs-8'><p>"
      var newTeamToggle3="</p><p>"
      var newTeamToggle4="</p></div><div class='col-md-2'><div class='switch'><input type='checkbox' checked='checked' id='cmn-toggle-"
      var newTeamToggle5="' class='cmn-toggle cmn-toggle-round-flat'/><label for='cmn-toggle-"
      var newTeamToggle6="'></label></div></div><hr class='teammemberreview'/></div>"

      teamtogglestring = newTeamToggle1 + guestinitials + newTeamToggle2 + guestfullname + newTeamToggle3 + guestemail + newTeamToggle4 + teamlength + newTeamToggle5 + teamlength + newTeamToggle6
      // console.log(teamtogglestring);
      // console.log($('.teamtogglelist .teammemberrow')[teamlength]);
      var stupd = "teammembertoggle"+(teamlength-1);
      console.log(stupd);
      $(teamtogglestring).insertAfter($("#"+stupd));

      // console.log(guestinitials);



    });


});
