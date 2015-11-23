/**
 * POST /Create a Team
 * Create a new team
 */
exports.createTeam = function(req, res, next) {
  console.log(req);
  // req.assert('email', 'Email is not valid').isEmail();
  // req.assert('userfirstname', 'Missing First Name').len(2);
  // req.assert('userlastname', 'Missing Last Name').len(3);
  // var errors = req.validationErrors();
  //
  // if (errors) {
  //   req.flash('errors', errors);
  //   return res.redirect('/createTeam');
  // }
  //
  // var team = new team({
  //   teamname: req.body.teamname,
  //   members:{}
  // });
  //
  // var teammember = new teammember({
  //   teamname: req.body.teamname,
  //   members:{}
  // });

  // User.findOne({ email: req.body.email }, function(err, existingUser) {
  //   if (existingUser) {
  //     req.flash('errors', { msg: 'Account with that email address already exists.' });
  //     return res.redirect('/signup');
  //   }
  //   user.save(function(err) {
  //     if (err) return next(err);
  //     req.logIn(user, function(err) {
  //       if (err) return next(err);
  //       res.redirect('/dashboard');
  //     });
  //   });
  // });
};
