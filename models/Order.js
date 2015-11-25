var mongoose = require('mongoose');

var orderSchema = new mongoose.Schema({
  teamname: String,
  team:Array,
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


});

module.exports = mongoose.model('Order', orderSchema);
