var mongoose = require('mongoose');

var teammemberSchema = new mongoose.Schema({
  firstname: String,
  lastname:String,
  initials:String,
  email:String,
  vote: String,
  notes:String,
  votestatus:String,
});

module.exports = mongoose.model('TeamMember', teammemberSchema);
