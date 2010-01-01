// Load modules

// Load sensihome dependencies
var SensihomeError = require("./error.js");
var Device = require("./models/device").Device;
var DeviceCommand = require("./models/deviceCommand").DeviceCommand;

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

/*** Device commands ***/

internals.Devices.prototype.commandTypes = [
    "info",
    "action"
];

internals.Devices.prototype.getCommands = function (id, cb) {
    DeviceCommand.get(id, function(err, deviceCommands) {
        if (err)
            return cb(err);
        cb(null, deviceCommands);
    });
};

internals.Devices.prototype.addCommand = function (data, cb) {
    DeviceCommand.add(data, function(err, deviceCommand) {
        if (err)
            return cb(err);
        this.sensihome.api.getSocket().emit("device-command-added", deviceCommand);
        cb(null, deviceCommand);
    });
};

internals.Devices.prototype.updateCommand = function (id, data, cb) {
    DeviceCommand.update(id, data, function(err, deviceCommand) {
        if (err)
            return cb(err);
        this.sensihome.api.getSocket().emit("device-command-updated", deviceCommand);
        cb(null, deviceCommand);
    });
};

internals.Devices.prototype.deleteCommand = function (id, cb) {          
    DeviceCommand.delete(id, function(err) {                             
        if (err)                                                  
            return cb(err);                                       
        this.sensihome.api.getSocket().emit("device-command-deleted", id);
        cb();                                                     
    });                                                           
};                                                                

internals.Devices.prototype.triggerCommand = function (id, cb) {
    // Foreach plugin == command.plugin
    // Send command
};
