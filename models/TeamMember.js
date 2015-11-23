var mongoose = require('mongoose');

var teammemberSchema = new mongoose.Schema({
  firstname: String,
  lastname:String,
  initials:String,
  email:String
});

module.exports = mongoose.model('TeamMember', teammemberSchema);
