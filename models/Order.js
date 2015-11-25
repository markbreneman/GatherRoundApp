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
  teamMinimum: String,
  defaultfoodmood: String,
  address: String,
  city: String,
  state: String,
  postalcode: String,
  draft:Boolean,
  refund:String,
  paid:Boolean,
});

module.exports = mongoose.model('Order', orderSchema);
