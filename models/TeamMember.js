var mongoose = require('mongoose');

var teammemberSchema = new mongoose.Schema({
  firstname: String,
  lastname:String,
  email:String
});

module.exports = mongoose.model('TeamMember', teammemberSchema);
