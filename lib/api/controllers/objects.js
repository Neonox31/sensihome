/** Objects controller **/

// Load dependencies
var Boom = require('boom');

// Local vars
var Object = require("../../models/object").Object;

module.exports.get = function(request, reply) {
    // `this` - is a reference to sensihome scope
    Object.get(request.params.id, function(err, objects) {
	if (err)
	    return reply(err.toBoomError());
	// 200 : Success
	reply(objects);
    });
};

module.exports.add = function(request, reply) {
    // `this` - is a reference to sensihome scope
    Object.add(request.payload, function(err, object) {
	if (err)
            return reply(err.toBoomError());
        // 201 : Created
	reply(object).code(201);
    });
};

module.exports.update = function(request, reply) {
    // `this` - is a reference to sensihome scope
    Object.update(request.params.id, request.payload, function(err, object) {
        if (err)
            return reply(err.toBoomError());
        // 200 : Success
	reply(object).code(200);
    });
};

module.exports.delete = function(request, reply) {
    // `this` - is a reference to sensihome scope
    Object.delete(request.params.id, function(err) {
        if (err)
            return reply(err.toBoomError());
        // 204 : No content
	reply().code(204);
    });
};

