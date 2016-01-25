var mongoose = require('mongoose');

var sharedSchema = mongoose.Schema({
  net: String,
  id: String,

});

module.exports = mongoose.model('Share', sharedSchema);
