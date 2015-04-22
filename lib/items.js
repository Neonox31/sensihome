// Load sensihome dependencies
var SensihomeError = require("./error.js");
var Item = require("./models/item").Item;

// Declare internals
var internals = {};

module.exports = internals.Items = function(sensihome, options) {
    this.sensihome = sensihome;
};

internals.Items.prototype.get = function (id, cb) {
    Item.get(id, function(err, items) {
	if (err)
	    return cb(err);
	cb(null, items);
    });
};

internals.Items.prototype.add = function (data, cb) {
    Item.add(data, function(err, item) {
        if (err)
	    return cb(err);
        this.sensihome.api.getSocket().emit("item-added", item);
	cb(null, item);
    });
};

internals.Items.prototype.update = function (id, data, cb) {
    Item.update(id, data, function(err, item) {
        if (err)
            return cb(err);
	this.sensihome.api.getSocket().emit("item-updated", item);
	cb(null, item);
    });
};

internals.Items.prototype.delete = function (id, cb) {
    Item.delete(id, function(err) {
        if (err)
            return cb(err);
	this.sensihome.api.getSocket().emit("item-deleted", id);
	cb();
    });
};
