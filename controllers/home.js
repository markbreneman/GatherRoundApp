/**
 * GET /
 * Home page.
 */
exports.index = function(req, res) {
  res.render('home', {
    title: 'Home'
  });
};

exports.betaindex = function(req, res) {
  res.render('homebeta', {
    title: 'HomeBeta'
  });
};
