/** Items controller **/

// Load dependencies
var Boom = require('boom');

module.exports.get = function(request, reply) {
    // `this` - is a reference to sensihome scope
    this.items.get(request.params.id, function(err, items) {
	if (err) {
	    return reply(err.toBoomError());
	}
	// 200 : Success
	reply(items);
    });
};

module.exports.add = function(request, reply) {
    // `this` - is a reference to sensihome scope
    this.items.add(request.payload, function(err, item) {
	if (err)
            return reply(err.toBoomError());
        // 201 : Created
	reply(item).code(201);
    });
};

module.exports.update = function(request, reply) {
    // `this` - is a reference to sensihome scope
    this.items.update(request.params.id, request.payload, function(err, item) {
        if (err)
            return reply(err.toBoomError());
        // 200 : Success
	reply(item).code(200);
    });
};

module.exports.delete = function(request, reply) {
    // `this` - is a reference to sensihome scope
    this.items.delete(request.params.id, function(err) {
        if (err)
            return reply(err.toBoomError());
        // 204 : No content
	reply().code(204);
    });
};

