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

var path = require('path');
var templatesDir = path.resolve(__dirname, '..', 'emailtemplates')

/**
 * GET /:orderid/:teammemberemail/vote/yes
 * Login page.
 */
exports.getVoteYes = function(req, res) {
  // res.send(req.params);

  res.render('vote-yes', {
    title: 'Vote',
    userid:req.params.userid,
    orderid:req.params.orderid,
    teammemberemail:req.params.teammemberemail,
  });
};

exports.postVoteYes = function(req, res, next) {
  // res.send(req.body);
  User.findById(req.body.userid, function(err, user) {
  // console.log(user.orders.length);
  // 5656361b2ce16699cfed56d3 - Test@test.com
  if (err) return next(err);
  var orderIndex;
  var memberIndex;
      for(i=0; i<user.orders.length; i++){
        // console.log(req.user.orders[i]._id);
        // console.log("total orders ="+ req.user.orders.length);
        if(user.orders[i]._id==req.body.orderid){
          orderIndex=i
          console.log("order Number= " + user.orders[orderIndex]._id);

          break
        }
      }
      for(i=0; i<user.orders[orderIndex].team[0].members.length ; i++){
        if(user.orders[orderIndex].team[0].members[i].email==req.body.teammemberemail){
          memberIndex=i;
          // console.log("Member= " +user.orders[orderIndex].team[0].members[memberIndex]);
          break
        }
      }

      user.orders[orderIndex].team[0].members[memberIndex].votestatus="yes";
      user.orders[orderIndex].team[0].members[memberIndex].vote=req.body.foodmood;
      user.orders[orderIndex].team[0].members[memberIndex].notes=req.body.notes;

      // console.log(user.orders[orderIndex].team[0].members[memberIndex]);
      console.log(user.orders[orderIndex].team[0]);
      user.save(function(err) {
        if (err) return next(err);
        res.redirect('/');
        // res.send(req.body);
      });


    });



  // console.log(req.body.orderid)

  // res.render('vote-yes', {
  //   title: 'Vote',
  //   orderid:req.params.orderid,
  //   teammemberemail:req.params.teammemberemail,
  // });
};

/**
 * GET /:orderid/:teammemberemail/vote/yes
 * Login page.
 */
exports.getVoteNo = function(req, res) {
  // res.send(req.params);
  res.render('vote-yes', {
    title: 'Vote',
    orderid:req.params.orderid,
    teammemberemail:req.params.teammemberemail,
  });
};
