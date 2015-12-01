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
  console.log(user);
  // 5656361b2ce16699cfed56d3 - Test@test.com
  if (err) return next(err);
  var orderIndex;
  var memberIndex;
    for(i=0; i<user.orders.length; i++){
      // console.log(req.user.orders[i]._id);
      // console.log("total orders ="+ req.user.orders.length);
      if(user.orders[i]._id==req.body.orderid){
        orderIndex=i
        // console.log("order Number= " + user.orders[orderIndex]._id);
        break
      }
    }
    for(i=0; i<user.orders[orderIndex].team.members.length ; i++){
      if(user.orders[orderIndex].team.members[i].email==req.body.teammemberemail){
        memberIndex=i;
        // console.log("Member= " +user.orders[orderIndex].team.members[memberIndex]);
        break
      }
    }
      // console.log(user.orders[orderIndex].team.members[memberIndex]);
      // console.log(req.body.notes);
      user.orders[orderIndex].team.members[memberIndex].votestatus="yes";
      user.orders[orderIndex].team.members[memberIndex].vote=req.body.foodmood;
      user.orders[orderIndex].team.members[memberIndex].notes=req.body.notes;

      // console.log("after", user.orders[orderIndex].team.members[memberIndex]);
      // console.log(user.orders[orderIndex].team);
      user.save(function(err, user){
        if (err) return next(err);
        console.log("after", user.orders[orderIndex].team.members[memberIndex]);
        // console.log(arguments);
        res.redirect('/');
        // res.send(req.body);
      });
    });
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


exports.getStaticVoteA = function(req, res) {
  // res.send(req.params);
  res.render('staticvoteA', {
    title: 'Vote',
  });
};

exports.getStaticVoteB = function(req, res) {
  // res.send(req.params);
  res.render('staticvoteB', {
    title: 'Vote',
  });
};
