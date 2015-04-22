// Load modules

// Load sensihome dependencies
var SensihomeError = require("./error.js");
var Device = require("./models/device").Device;

// Declare internals
var internals = {};

module.exports = internals.Devices = function(sensihome, options) {
    this.sensihome = sensihome;
};

internals.Devices.prototype.get = function (id, cb) {
    Device.get(id, function(err, devices) {
	if (err)
	    return cb(err);
	cb(null, devices);
    });
};

internals.Devices.prototype.add = function (data, cb) {
    Device.add(data, function(err, device) {
        if (err)
	    return cb(err);
        this.sensihome.api.getSocket().emit("device-added", device);
	cb(null, device);
    });
};

internals.Devices.prototype.update = function (id, data, cb) {
    Device.update(id, data, function(err, device) {
        if (err)
            return cb(err);
	this.sensihome.api.getSocket().emit("device-updated", device);
	cb(null, device);
    });
};

internals.Devices.prototype.delete = function (id, cb) {
    Device.delete(id, function(err) {
        if (err)
            return cb(err);
	this.sensihome.api.getSocket().emit("device-deleted", id);
	cb();
    });
};
