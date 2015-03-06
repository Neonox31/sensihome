var mongoose = require("mongoose");

var ObjectSchema = new mongoose.Schema({
  name: {
    type: String,
    index: true
  },
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    index: true
  }
});

var Object = mongoose.model('Object', ObjectSchema);

module.exports = {
  Object: Object
}
