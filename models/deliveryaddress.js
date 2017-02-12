var mongoose = require('mongoose');

var devliveryAddressSchema = mongoose.Schema({
  user: { type: String, required: true},
  name: String,
  email: String,
  tel: Number,
  address: String,
  updated_at: {  type: Date, "default": Date.now  }
});

devliveryAddressSchema.methods.updateAndSave = function(data) {
  for( var key in data) {
    this[key] = data[key];
  }
  return true;
};

module.exports = mongoose.model('DeliveryAddress', devliveryAddressSchema);