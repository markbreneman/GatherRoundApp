var mongoose = require('mongoose');

var orderSchema = new mongoose.Schema({
  teamname: String,
  members:Array,
  orderdate:Date,
  deliverydate:Date,
  totalcost:Number,
  status:String,
  notes:String
  votessubmitted:Number,
});

module.exports = mongoose.model('Order', orderSchema);
