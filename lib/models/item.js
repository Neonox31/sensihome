// Load modules
var mongoose = require("mongoose");
var _ = require("lodash");

// Load sensihome dependencies
var SensihomeError = require("../error.js");

var ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    index: true
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

ItemSchema.statics.get = function (id, cb) {
    // Get an unique item
    var errorPrepend = "Get item : ";
    if (typeof cb === 'undefined')
        cb = id;
    if (id) {
	this.findOne({_id: id})
	    .populate("parent")
	    .exec(function (err, item) {
		if (err)
		    return cb(new SensihomeError(errorPrepend + err.message, null, 500));
		if (!item) {
		    return cb(new SensihomeError(errorPrepend + id + " not found.", null, 404));
		}
		cb(null, item);
            });
    } else {
	 // Get item list
         this.find({})
	    .populate("parent")
	    .exec(function (err, items) {
		if (err)
		    return cb(new SensihomeError(errorPrepend + err.message, null, 500));
		cb(null, items);
            });
    }
}

ItemSchema.statics.add = function (data, cb) {
    // Create item
    var errorPrepend = "Create item : ";
    if (arguments.length < 2 || Object.prototype.toString.call(cb) !== "[object Function]")
        return cb(new SensihomeError(errorPrepend + "Wrong arguments.", null, null));
    var item = new Item(data);
    item.save(function (err, device) {
	if (err)
            return cb(new SensihomeError(errorPrepend + err.message, null, 500));
	cb(null, item);
    });
}

ItemSchema.statics.update = function (id, data, cb) {
    // Get existing item and update
    var errorPrepend = "Update item : ";
    if (arguments.length < 3 || Object.prototype.toString.call(cb) !== "[object Function]")
        return cb(new SensihomeError(errorPrepend + "Wrong arguments.", null, null));
    this.findOneAndUpdate({_id: id}, _.extend(data, {updated_at: new Date()}), {new: true}, function (err, item) {
        if (err)
            return cb(new SensihomeError(errorPrepend + err.message, null, 500));
        if (!item) {
	    return cb(new SensihomeError(errorPrepend + id + " not found.", null, 404));
        }
	cb(null, item);
    });
}

ItemSchema.statics.delete = function (id, cb) {
    // Get existing object and delete it
    var errorPrepend = "Delete object : ";
    if (arguments.length < 2 || Object.prototype.toString.call(cb) !== "[object Function]")
        return cb(new SensihomeError(errorPrepend + "Wrong arguments.", null, null));
    this.findOneAndRemove({_id: id}, function (err) {
        if (err)
            return cb(new SensihomeError(errorPrepend + err.message, null, 500));
	cb();
    });
}

var Item = mongoose.model('Item', ItemSchema);

module.exports = {
  Item: Item
}
