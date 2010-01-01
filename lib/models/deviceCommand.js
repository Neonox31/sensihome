// Load modules
var mongoose = require("mongoose");
var _ = require("lodash");

// Load sensihome dependencies
var SensihomeError = require("../error.js");

var DeviceCommandSchema = new mongoose.Schema({
    name: {
	type: String
    },
    type: {
	type: String
    },
    device_id: {
	type: mongoose.Schema.Types.ObjectId,
	ref: 'Device',
	index: true
    },
    plugin: {
	type: String
    },
    plugin_data: {
	type: Object
    },
    value: {
	type: mongoose.Schema.Types.Mixed
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

DeviceCommandSchema.statics.get = function (id, cb) {
    // Get an unique device command
    var errorPrepend = "Get device command : ";
    if (typeof cb === 'undefined')
        cb = id;
    if (id) {
        this.findOne({_id: id}, function (err, deviceCommand) {
	    if (err)
		return cb(new SensihomeError(errorPrepend + err.message, null, 500));
            if (!device) {
		return cb(new SensihomeError(errorPrepend + id + " not found.", null, 404));
            }
            cb(null, deviceCommand);
        });
    } else {
	 // Get device command list
         this.find({}, function (err, deviceCommands) {
	     if (err)
		 return cb(new SensihomeError(errorPrepend + err.message, null, 500));
            cb(null, deviceCommands);
        });
    }
}

DeviceCommandSchema.statics.add = function (data, cb) {
    // Create device command
    var errorPrepend = "Add device command : ";
    if (arguments.length < 2 || Object.prototype.toString.call(cb) !== "[object Function]")
        return cb(new SensihomeError(errorPrepend + "Wrong arguments.", null, null));
    var deviceCommand = new DeviceCommand(data);
    deviceCommand.save(function (err, deviceCommand) {
	if (err)
            return cb(new SensihomeError(errorPrepend + err.message, null, 500));
	cb(null, deviceCommand);
    });
}

DeviceCommandSchema.statics.update = function (id, data, cb) {
    // Get existing device command and update
    var errorPrepend = "Update device command : ";
    if (arguments.length < 3 || Object.prototype.toString.call(cb) !== "[object Function]")
        return cb(new SensihomeError(errorPrepend + "Wrong arguments.", null, null));
    this.findOneAndUpdate({_id: id}, _.extend(data, {updated_at: new Date()}), {new: true}, function (err, deviceCommand) {
        if (err)
            return cb(new SensihomeError(errorPrepend + err.message, null, 500));
        if (!deviceCommand) {
	    return cb(new SensihomeError(errorPrepend + id + " not found.", null, 404));
        }
	cb(null, deviceCommand);
    });
}

DeviceCommandSchema.statics.delete = function (id, cb) {
    // Get existing device command and delete it
    var errorPrepend = "Delete device command : ";
    if (arguments.length < 2 || Object.prototype.toString.call(cb) !== "[object Function]")
        return cb(new SensihomeError(errorPrepend + "Wrong arguments.", null, null));
    this.findOneAndRemove({_id: id}, function (err) {
        if (err)
            return cb(new SensihomeError(errorPrepend + err.message, null, 500));
	cb();
    });
}

var DeviceCommand = mongoose.model('DeviceCommand', DeviceCommandSchema, 'device_commands');

module.exports = {
  DeviceCommand: DeviceCommand
}
