var mongoose = require('mongoose');

var teamSchema = new mongoose.Schema({
  teamname: String,
  members:Array,
  orders:Array,
});

module.exports = mongoose.model('Team', teamSchema);
