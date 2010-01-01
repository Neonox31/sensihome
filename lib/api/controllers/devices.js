/** Devices controller **/

// Load dependencies
var Boom = require('boom');

module.exports.get = function(request, reply) {
    // `this` - is a reference to sensihome scope
    this.devices.get(request.params.id, function(err, devices) {
	if (err) {
	    return reply(err.toBoomError());
	}
	// 200 : Success
	reply(devices);
    });
};

module.exports.add = function(request, reply) {
    // `this` - is a reference to sensihome scope
    this.devices.add(request.payload, function(err, device) {
	if (err)
            return reply(err.toBoomError());
        // 201 : Created
	reply(device).code(201);
    });
};

module.exports.update = function(request, reply) {
    // `this` - is a reference to sensihome scope
    this.devices.update(request.params.id, request.payload, function(err, device) {
        if (err)
            return reply(err.toBoomError());
        // 200 : Success
	reply(device).code(200);
    });
};

module.exports.delete = function(request, reply) {
    // `this` - is a reference to sensihome scope
    this.devices.delete(request.params.id, function(err) {
        if (err)
            return reply(err.toBoomError());
        // 204 : No content
	reply().code(204);
    });
};

/*** Device commands ***/

module.exports.getCommands = function(request, reply) {
    // `this` - is a reference to sensihome scope
    this.devices.getCommands(request.params.command_id, function(err, deviceCommands) {
        if (err) {
            return reply(err.toBoomError());
        }
        // 200 : Success
        reply(deviceCommands);
    });
};

module.exports.addCommand = function(request, reply) {
    // `this` - is a reference to sensihome scope
    this.devices.addCommand(request.payload, function(err, deviceCommand) {
        if (err)
            return reply(err.toBoomError());
        // 201 : Created
        reply(deviceCommand).code(201);
    });
};

module.exports.updateCommand = function(request, reply) {
    // `this` - is a reference to sensihome scope
    this.devices.updateCommand(request.params.command_id, request.payload, function(err, deviceCommand) {
        if (err)
            return reply(err.toBoomError());
        // 200 : Success
        reply(deviceCommand).code(200);
    });
};

module.exports.deleteCommand = function(request, reply) {
    // `this` - is a reference to sensihome scope
    this.devices.deleteCommand(request.params.command_id, function(err) {
        if (err)
            return reply(err.toBoomError());
        // 204 : No content
        reply().code(204);
    });
};
