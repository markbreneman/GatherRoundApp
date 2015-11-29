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
 * GET /:orderid/:teammemberemail/vote
 * Login page.
 */
exports.getVote = function(req, res) {
  res.render('vote', {
    title: 'Vote'
  });
};
