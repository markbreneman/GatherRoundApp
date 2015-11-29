var mongoose = require('mongoose');

var orderSchema = new mongoose.Schema({
  teamname: String,
  team:Array,
  orderteamsize:String,
  dateplaced: String,
  orderfordate: String,
  totalcost: String,
  deliverytime: String,
  status: String,
  teamminimum: String,
  defaultfoodmood: String,
  address: String,
  city: String,
  state: String,
  postalcode: String,
  phone:String,
  draft:Boolean,
  refund:String,
  paid:Boolean,
  votingtime:String
});

module.exports = mongoose.model('Order', orderSchema);
