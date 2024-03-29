var _ = require('lodash');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var EmailTemplate = require('email-templates').EmailTemplate;
var wellknown = require('nodemailer-wellknown')

var passport = require('passport');
var User = require('../models/User');
var Team = require('../models/Team');
var TeamMember = require('../models/TeamMember');
var Order = require('../models/Order');
var stripe;
var secrets = require('../config/secrets');
var aws = require('aws-sdk');

var path = require('path');
var templatesDir = path.resolve(__dirname, '..', 'emailtemplates')



/**
 * GET /login
 * Login page.
 */
exports.getLogin = function(req, res) {
  if (req.user) return res.redirect('/');
  res.render('account/login', {
    title: 'Login'
  });
};

/**
 * POST /login
 * Sign in using email and password.
 */
exports.postLogin = function(req, res, next) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password cannot be blank').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/login');
  }

  passport.authenticate('local', function(err, user, info) {
    if (err) return next(err);
    if (!user) {
      req.flash('errors', { msg: info.message });
      return res.redirect('/login');
    }
    req.logIn(user, function(err) {
      if (err) return next(err);
      req.flash('success', { msg: 'Success! You are logged in.' });
      // res.redirect(req.session.returnTo || '/'); // Session Bit is actin funny--mark does not understand how it works.
      res.redirect('/dashboard');
    });
  })(req, res, next);
};

/**
 * GET /userDashboard
 */
exports.index = function(req, res) {
  User.findById(req.user.id, function(err, user) {
    if (err) return next(err);
    res.render('account/dashboard', {
      title: 'Dashboard',
      name:user.firstname,
    });
  });
};

/**
 * GET /teams
 */
exports.getTeams = function(req, res) {
  User.findById(req.user.id, function(err, user) {
    if (err) return next(err);
    res.render('account/teams', {
      title: 'Teams',
    });
  });
};

/**
 * GET /teams/delete/:teamID
 * this is the ajax route to delete a team
 */
exports.getTeamDelete = function(req, res) {
  // console.log(req.params);
  User.findById(req.user.id, function(err, user) {
      if (err) return next(err);
      var selectedTeamIndex;
      for (i = 0; i < user.teams.length; i++){
        if (user.teams[i]._id==req.params.teamid){
          selectedTeamIndex=i;
          break
        }
      }
  });
  console.log("before", req.user.teams)
  console.log(req.params.teamid)

  teamID=req.params.teamid;
  userID=req.user.id;

  // User.update(
  // {'_id': userID},
  // { $pull: { "teams" : { id: teamID } } },
  // false,
  // true
  // );
  // user.markModified("teams");
  // user.save();



  User.update(
  {'_id': userID},
  { "$pull": { "teams" : {"_id" : teamID } } },
  { "multi": true }
  );

  req.user.markModified("teams");
  req.user.save(function(err) {
      console.log("after", req.user.teams)
      if (err) return next(err);
      req.flash('success', { msg: 'Team deleted' });
  });

};

/**
 * GET /createteam
 */
exports.getCreateTeam = function(req, res) {
  res.render('account/createteam', {
    title: 'CreateATeam',
  });
};

/**
 * POST /Create a Team
 * Create a new team
 */
exports.postCreateTeam = function(req, res, next) {
  // res.send(req.body)
  User.findById(req.user.id, function(err, user) {
    if (err) return next(err);
    //Create a Team Object with the teamMemberFName
    var team=new Team({
      teamname: req.body.teamname,
    });

    //Get the teamsize from the post request
    var teamsizeinput = req.body.teamsize;
    var teamArray = [];
    console.log(req.body);
    //For the size of the team create a team member object for each team member
    for (i = 0; i < teamsizeinput; i++){
      var fnameString=req.body.teamMemberFName[i];
      var lnameString=req.body.teamMemberLName[i];
      var emailString=req.body.teamMemberEmail[i];
      console.log("firstname", fnameString);
      console.log("lastname", lnameString);
      console.log("email", emailString);
      var teammember=new TeamMember({
        firstname: fnameString,
        lastname: lnameString,
        email: emailString,
        initials:fnameString.charAt(0)+lnameString.charAt(0)
      });
      teamArray.push(teammember);
      // console.log("Created New Team Member! " + teammember);
    }
    team.members=teamArray;

    user.teams.push(team);

    user.save(function(err) {
      if (err) return next(err);
      req.flash('success', { msg: 'Team saved' });
      if(user.orders.length<=0){
      res.redirect('/teams/'+req.body.teamname+"/orderdetails");
      }
      else{
      res.redirect('/teams/');
      }
    });
  });
};

/**
 * GET /teams/:teamname/orderdetails
 */
exports.getOrderDetails = function(req, res) {
  User.findById(req.user.id, function(err, user) {
    var teamid;
    for(i=0; i<req.user.teams.length; i++){
      if(req.user.teams[i].teamname==req.name){
        teamid=i;
      }
    }
    //SHOULD ADD IF STATEMENT IN CASE TEAM DOESN"T EXIST.

    // stripe = require('stripe')(secrets.stripe.secretKey);
    res.render('account/orderdetails', {
      title:"OrderDetails",
      teamname:req.user.teams[teamid].teamname,
      teammembers:req.user.teams[teamid].members,
      // publishableKey: secrets.stripe.publishableKey
    });
  });
};

/**
 * POST /Create a Team
 * Create a new team
 */
exports.postOrderDetails = function(req, res, next) {
  // res.send(req.body)
  // console.log(req.body.teamMemberFName[2]);
  User.findById(req.user.id, function(err, user) {
    if (err) return next(err);
    //Create a Team Object
    var teamOrder=new Team({
      teamname: req.body.teamname,
    });

    //Get the teamsize from the post request
    var teamsizeinput = req.body.orderteamsize;
    var teamArray = [];

    //For the size of the team create a team member object for each team member
    for (i = 0; i < teamsizeinput; i++){
      var teammember=new TeamMember({
        firstname: req.body.teamMemberFName[i],
        lastname: req.body.teamMemberLName[i],
        email: req.body.teamMemberEmail[i],
        initials:req.body.teamMemberFName[i].charAt(0)+req.body.teamMemberLName[i].charAt(0),
        vote: "",
        notes:"",
        votestatus:"",
      });
      //Add the teammember to the array of team members
      teamArray.push(teammember);
      // console.log("Created New Team Member! " + teammember);
    }
    //Add the array to the Team Object under the "team" property
    teamOrder.members=teamArray;

    //Create a new Order Object
    var newOrder= new Order({
      orderteamsize:req.body.orderteamsize,
      dateplaced:Date(),
      orderfordate:req.body.orderfordate,
      totalcost:req.body.totalcost,
      deliverytime: req.body.deliverytime,
      teamminimum: req.body.minteamsize,
      defaultfoodmood: String,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      postalcode: req.body.postalcode,
      phone:req.body.phone,
      defaultfoodmood:req.body.defaultfoodmood,
      team:teamOrder,
      draft:true,
      votingtime:req.body.votingtime,
      status:"",
      paid:false,
      refund:0,
    })

    console.log(newOrder.id);

    newOrder.orderidforemail=newOrder.id;
    user.orders.push(newOrder);

    user.save(function(err) {
      if (err) return next(err);
      // req.flash('success', { msg: 'order Created' });
      res.redirect('/order/'+newOrder.id+'/reviewandpay');
    });

  });
};

/**
 * GET reviewandpay
 * Get the review and final invoice
 */
exports.getReviewandPay = function(req, res) {
  User.findById(req.user.id, function(err, user) {
    var orderID=req.name;

    for(i=0; i<req.user.orders.length; i++){
      // console.log(req.user.orders[i]._id);
      // console.log("total orders ="+ req.user.orders.length);
      if(req.user.orders[i]._id==req.name){
        orderIndex=i
        // console.log("order Number= " +orderIndex);
        break
      }
    }
    username=req.user.profile.firstname+" "+ req.user.profile.lastname
    dateplaced=req.user.orders[orderIndex].dateplaced
    orderfordate=req.user.orders[orderIndex].orderfordate
    // console.log(req.user.orders[orderIndex])
    teamname=req.user.orders[orderIndex].team.teamname

    orderteamsize=req.user.orders[orderIndex].orderteamsize
    deliverytime=req.user.orders[orderIndex].deliverytime
    totalcost=req.user.orders[orderIndex].totalcost
    teamminimum=req.user.orders[orderIndex].teamminimum
    defaultfoodmood=req.user.orders[orderIndex].defaultfoodmood
    address=req.user.orders[orderIndex].address
    city=req.user.orders[orderIndex].city
    state=req.user.orders[orderIndex].state
    postalcode=req.user.orders[orderIndex].postalcode
    phone=req.user.orders[orderIndex].phone
    votingtime=req.user.orders[orderIndex].votingtime
    orderidforemail=req.user.orders[orderIndex].orderidforemail
    ordermembersarray=req.user.orders[orderIndex].team.members
    userid=req.user.id
    refund=req.user.orders[orderIndex].refund

    // console.log(req.user.orders[orderIndex].dateplaced);

    //SHOULD ADD IF STATEMENT IN CASE TEAM DOESN"T EXIST.

    stripe = require('stripe')(secrets.stripe.secretKey);
    res.render('account/reviewandpay', {
      username:username,
      title:"ReviewandPay",
      teamname:teamname,
      orderid:orderID,
      orderfordate:orderfordate,
      deliverytime:deliverytime,
      totalcost:totalcost,
      teamminimum:teamminimum,
      defaultfoodmood:defaultfoodmood,
      address:address,
      city:city,
      state:state,
      postalcode:postalcode,
      ordermembersarray:ordermembersarray,
      votingtime:votingtime,
      orderidforemail:orderidforemail,
      userid:userid,
      refund:refund,
      publishableKey: secrets.stripe.publishableKey


    });
  });
};


/**
 * POST /Review and Pay
 * Charged Card
 */
exports.postReviewandPay = function(req, res, next) {
  // res.send(req.body);

  //PAY UP - Charging Stripe
  stripe = require('stripe')(secrets.stripe.secretKey);

  var stripeToken = req.body.stripeToken;
  var stripeEmail = req.body.stripeEmail;
  var stripeAmount = req.body.stripeTotalAmount*100;
  var gatherorderid = req.body.gatherorderid;

  stripe.charges.create({
    amount: stripeAmount,
    currency: 'usd',
    source: stripeToken,
    description: stripeEmail,
    receipt_email:stripeEmail
  }, function(err, charge) {

    //IF STRIPE IS UNSUCCESSFUL
    if (err && err.type === 'StripeCardError') {
      req.flash('errors', { msg: 'Your card has been declined. Please try again.' });
      res.redirect('/order/'+gatherorderid+'/reviewandpay');
    }
    //IF STRIPE IS SUCCESSFUL
    //Find the user
    User.findById(req.user.id, function(err, user) {
      var orderID=gatherorderid;
      //Find the index of the order in the order array
      for(i=0; i<req.user.orders.length; i++){
        // console.log(req.user.orders[i]._id);
        if(req.user.orders[i]._id==req.name){
          orderIndex=i
          break
        }
      }

      // console.log("before", req.user.orders[orderIndex])
      //Set Order to placed and draft to false.
      user.orders[orderIndex].status="placed";
      user.orders[orderIndex].draft=false;
      user.orders[orderIndex].paid=true;
      user.markModified("orders");

      user.save(function(err, user) {
        // console.log("after", req.user.orders[orderIndex])
        if (err) return next(err);
        var template = new EmailTemplate(path.join(templatesDir, 'foodmood-vote'))

        //SEND EMAILS
        var transporter = nodemailer.createTransport({
          service: 'SendGrid',
          auth: {
            user: secrets.sendgrid.user,
            pass: secrets.sendgrid.password
          }
        });

        numvoters=req.user.orders[orderIndex].team.members.length;
        voters=req.user.orders[orderIndex].team.members;

      async.mapLimit(voters, numvoters, function (item, next) {
          template.render(item, function (err, results) {
            if (err) return next(err)
            // console.log(req.user.orders[orderIndex]);
            transporter.sendMail({
              from: 'team@gatherround.io',
              to: item.email,
              subject: 'You\'ve Been Invited to Gather!',
              html: results.html,
              text: results.text

            }, function (err, responseStatus) {
              if (err) {
                return next(err)
              }
              next(null, responseStatus.message)
            })
          })
        }, function (err) {
          if (err) {
            console.error(err)
          }

          req.flash('success', { msg: 'Your order is in the works! We have emailed your team members.' });
          res.redirect('/dashboard');
          // console.log('Succesfully sent %d messages', voters.length)
        })

      });//End User Save

    });//End find user

  });//End Stripe Charge

};

/**
 * GET /orders
 *
 */

exports.getOrders = function(req, res) {
  User.findById(req.user.id, function(err, user) {
    res.render('account/orders', {
      title:"Orders",
    });
  });
};

/**
 * GET /orders
 *
 */

exports.getOrderReport = function(req, res) {
  User.findById(req.user.id, function(err, user) {
    console.log("params", req.params.orderid);
    var orderIndex;
    for(i=0; i<user.orders.length; i++){
      if (user.orders[i].orderidforemail==req.params.orderid){
      orderIndex=i;
      break
      }
    }
    orderID=req.params.orderid;
    dateplaced=req.user.orders[orderIndex].dateplaced
    orderfordate=req.user.orders[orderIndex].orderfordate
    teamname=req.user.orders[orderIndex].team.teamname
    orderteamsize=req.user.orders[orderIndex].orderteamsize
    deliverytime=req.user.orders[orderIndex].deliverytime
    totalcost=req.user.orders[orderIndex].totalcost
    teamminimum=req.user.orders[orderIndex].teamminimum
    defaultfoodmood=req.user.orders[orderIndex].defaultfoodmood
    address=req.user.orders[orderIndex].address
    city=req.user.orders[orderIndex].city
    state=req.user.orders[orderIndex].state
    postalcode=req.user.orders[orderIndex].postalcode
    phone=req.user.orders[orderIndex].phone
    votingtime=req.user.orders[orderIndex].votingtime
    orderidforemail=req.user.orders[orderIndex].orderidforemail
    ordermembersarray=req.user.orders[orderIndex].team.members
    userid=req.user.id
    refund=req.user.orders[orderIndex].refund
    console.log("Refund.backend",refund)


    res.render('account/orderreport', {
      title:"OrderReport",
      teamname:teamname,
      orderid:orderID,
      orderfordate:orderfordate,
      deliverytime:deliverytime,
      totalcost:totalcost,
      teamminimum:teamminimum,
      defaultfoodmood:defaultfoodmood,
      address:address,
      city:city,
      state:state,
      postalcode:postalcode,
      ordermembersarray:ordermembersarray,
      votingtime:votingtime,
      orderidforemail:orderidforemail,
      userid:userid,
      refund:refund
    });
  });
};



/**
 * GET /emailTest DEBUG ONLY
 *
 */
exports.getemailTest = function(req, res) {
  res.render('emailtest', {
    title: 'emailtest'
  });
};



/**
 * GET /logout
 * Log out.
 */
exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};

/**
 * GET /signup
 * Signup page.
 */
exports.getSignup = function(req, res) {
  if (req.user) return res.redirect('/');
  res.render('account/signup', {
    title: 'Create Account'
  });
};


/**
 * POST /signup
 * Create a new local account.
 */
exports.postSignup = function(req, res, next) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
  req.assert('userfirstname', 'Missing First Name').len(2);
  req.assert('userlastname', 'Missing Last Name').len(3);
  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/signup');
  }

  var user = new User({
    email: req.body.email,
    password: req.body.password,
    profile:{
    firstname: req.body.userfirstname,
    lastname: req.body.userlastname
    }
  });

  User.findOne({ email: req.body.email }, function(err, existingUser) {
    if (existingUser) {
      req.flash('errors', { msg: 'Account with that email address already exists.' });
      return res.redirect('/signup');
    }
    user.save(function(err) {
      if (err) return next(err);
      req.logIn(user, function(err) {
        if (err) return next(err);
        res.redirect('/dashboard');
      });
    });
  });
};

/**
 * GET /account
 * Profile page.
 */
exports.getAccount = function(req, res) {
  res.render('account/profile', {
    title: 'Account',
    userid: req.user._id,
  });
  console.log("the user id is", req.user._id);
};

/*
* Load the S3 information from the environment variables.
*/
var AWS_ACCESS_KEY = secrets.aws.access_key;
var AWS_SECRET_KEY = secrets.aws.secret_key;
var S3_BUCKET = secrets.aws.s3_bucket;


exports.updateS3 = function(req, res){
    var urlstring = "?"+req.url.split('?')[1]
    // console.log("req.url", urlstring);

    function getURLParameter(name) {
      return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(urlstring)||[,""])[1].replace(/\+/g, '%20'))||null
    }

    // getURLParameter(userid)

    userid = getURLParameter('userid');
    // console.log("userid", userid);

    aws.config.update({accessKeyId: AWS_ACCESS_KEY , secretAccessKey: AWS_SECRET_KEY });
    aws.config.update({region: 'us-east-1' , signatureVersion: 'v4' });
    var s3 = new aws.S3();

    var s3_params = {
        Bucket: S3_BUCKET,
        Key: userid+'/'+req.query.file_name,
        Expires: 60,
        ContentType: req.query.file_type,
        ACL: 'public-read'
    };

    s3.getSignedUrl('putObject', s3_params, function(err, data){
        if(err){
            console.log(err);
        }
        else{
            var return_data = {
                signed_request: data,
                url: 'https://'+S3_BUCKET+'.s3.amazonaws.com/'+userid+'/'+req.query.file_name
            };
            res.write(JSON.stringify(return_data));
            // console.log(JSON.stringify(return_data));
            res.end();
        }
    });
};

/**
 * POST /account/profile
 * Update profile information.
 */
exports.postUpdateProfile = function(req, res, next) {
  console.log(req);
  User.findById(req.user.id, function(err, user) {
    if (err) return next(err);
    user.email = req.body.email || '';
    user.profile.name = req.body.name || '';
    user.profile.gender = req.body.gender || '';
    user.profile.address = req.body.address || '';
    user.profile.city = req.body.city || '';
    user.profile.state = req.body.state || '';
    user.profile.zip = req.body.zip || '';
    user.profile.avatarurl = req.body.avatar_url || '';
    // user.markModified("profile");

    user.save(function(err) {

      if (err) return next(err);
      req.flash('success', { msg: 'Profile information updated.' });
      res.redirect('/account');
    });
  });
};

/**
 * POST /account/password
 * Update current password.
 */
exports.postUpdatePassword = function(req, res, next) {
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/account');
  }

  User.findById(req.user.id, function(err, user) {
    if (err) return next(err);

    user.password = req.body.password;

    user.save(function(err) {
      if (err) return next(err);
      req.flash('success', { msg: 'Password has been changed.' });
      res.redirect('/account');
    });
  });
};

/**
 * POST /account/delete
 * Delete user account.
 */
exports.postDeleteAccount = function(req, res, next) {
  User.remove({ _id: req.user.id }, function(err) {
    if (err) return next(err);
    req.logout();
    req.flash('info', { msg: 'Your account has been deleted.' });
    res.redirect('/');
  });
};

/**
 * GET /account/unlink/:provider
 * Unlink OAuth provider.
 */
exports.getOauthUnlink = function(req, res, next) {
  var provider = req.params.provider;
  User.findById(req.user.id, function(err, user) {
    if (err) return next(err);

    user[provider] = undefined;
    user.tokens = _.reject(user.tokens, function(token) { return token.kind === provider; });

    user.save(function(err) {
      if (err) return next(err);
      req.flash('info', { msg: provider + ' account has been unlinked.' });
      res.redirect('/account');
    });
  });
};

/**
 * GET /reset/:token
 * Reset Password page.
 */
exports.getReset = function(req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  User
    .findOne({ resetPasswordToken: req.params.token })
    .where('resetPasswordExpires').gt(Date.now())
    .exec(function(err, user) {
      if (!user) {
        req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
        return res.redirect('/forgot');
      }
      res.render('account/reset', {
        title: 'Password Reset'
      });
    });
};

/**
 * POST /reset/:token
 * Process the reset password request.
 */
exports.postReset = function(req, res, next) {
  req.assert('password', 'Password must be at least 4 characters long.').len(4);
  req.assert('confirm', 'Passwords must match.').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('back');
  }

  async.waterfall([
    function(done) {
      User
        .findOne({ resetPasswordToken: req.params.token })
        .where('resetPasswordExpires').gt(Date.now())
        .exec(function(err, user) {
          if (!user) {
            req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
            return res.redirect('back');
          }

          user.password = req.body.password;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;

          user.save(function(err) {
            if (err) return next(err);
            req.logIn(user, function(err) {
              done(err, user);
            });
          });
        });
    },
    function(user, done) {
      var transporter = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: secrets.sendgrid.user,
          pass: secrets.sendgrid.password
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'team@gatherround.io',
        subject: 'Your Gather Round password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      transporter.sendMail(mailOptions, function(err) {
        req.flash('success', { msg: 'Success! Your password has been changed.' });
        done(err);
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/');
  });
};

/**
 * GET /forgot
 * Forgot Password page.
 */
exports.getForgot = function(req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('account/forgot', {
    title: 'Forgot Password'
  });
};

/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 */
exports.postForgot = function(req, res, next) {
  req.assert('email', 'Please enter a valid email address.').isEmail();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/forgot');
  }

  async.waterfall([
    function(done) {
      crypto.randomBytes(16, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email.toLowerCase() }, function(err, user) {
        if (!user) {
          req.flash('errors', { msg: 'No account with that email address exists.' });
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var transporter = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: secrets.sendgrid.user,
          pass: secrets.sendgrid.password
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'team@gatherround.io',
        subject: 'Reset your password on GatherRound.io',
        text: 'You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      transporter.sendMail(mailOptions, function(err) {
        req.flash('info', { msg: 'An e-mail has been sent to ' + user.email + ' with further instructions.' });
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
};
