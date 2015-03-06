/** Objects controller **/

// Load dependencies
var Boom = require('boom');

// Local vars
var Object = require("../models/object").Object;
var objectIdPattern = new RegExp("^[0-9a-fA-F]{24}$");

module.exports.get = function(request, reply) {
    if (request.params.id) {
	// If malformed objectId
	if (!objectIdPattern.test(request.params.id)) {
            // 404 : Ressource not found
            reply(Boom.notFound('Object ' + request.params.id + ' not found'));
            return;
	}
	// Get an unique object
	Object.findOne({_id: request.params.id}, function (err, object) {
	    if (err) {
		// 500 : Internal server error
		reply(Boom.badImplementation(err));
		return;
	    }
	    if (!object) {
		// 404 : Ressource not found
                reply(Boom.notFound('Object ' + request.params.id + ' not found'));
                return;
	    }
	    reply(object);
	});
    } else {
	// Get object list
	Object.find({}, function (err, objects) {
            if (err) {
		// 500 : Internal server error
                reply(Boom.badImplementation(err));
                return;
            }
            reply(objects);
        });
    }
};

module.exports.put = function(request, reply) {
    if (request.params.id) {
	if (!objectIdPattern.test(request.params.id)) {
	    // 404 : Ressource not found
            reply(Boom.notFound('Object ' + request.params.id + ' not found'));
            return;
        }
	// Get existing object and update or append it
	Object.findOne({_id: request.params.id}, function (err, object) {
            if (err) {
		// 500 : Internal server error
		reply(Boom.badImplementation(err));
                return;
            }
	    if (!object) {
		// 404 : Ressource not found
		reply(Boom.notFound('Object ' + request.params.id + ' not found'));
		return;
	    }

	    // Update object
	    object.name = request.payload.name;
	    object.save(function (err, object) {
		if (err) {
		    // 500 : Internal server error
		    reply(Boom.badImplementation(err));
		    return;
		}
		// 204 : No content
		reply(object).code(204);
	    });
        });
    } else {
	// Create object
	var object = new Object(request.payload);
	object.save(function (err, object) {
	    if (err) {
		// 500 : Internal server error
                reply(Boom.badImplementation(err));
		return;
            }
	    // 201 : Created
	    reply(object).code(201);
	});
    }
};

module.exports.post = function(request, reply) {
    if (request.params.id) {
	if (!objectIdPattern.test(request.params.id)) {
	    // 404 : Ressource not found
            reply(Boom.notFound('Object ' + request.params.id + ' not found'));
            return;
        }
        // Get existing object and update or append it
        Object.findOne({_id: request.params.id}, function (err, object) {
            if (err) {
                // 500 : Internal server error
                reply(Boom.badImplementation(err));
                return;
            }
            if (!object) {
                // 404 : Ressource not found
                reply(Boom.notFound('Object ' + request.params.id + ' not found'));
                return;
            }

            // Update object
            object.name = request.payload.name;
            object.save(function (err, object) {
                if (err) {
                    // 500 : Internal server error
                    reply(Boom.badImplementation(err));
                    return;
		}
                // 204 : No content
                reply().code(204);
            });
        });
    } else {
        // Create object
        var object = new Object(request.payload);
        object.save(function (err, object) {
            if (err) {
                // 500 : Internal server error
                reply(Boom.badImplementation(err));
		return;
            }
            // 201 : Created
            reply(object).code(201);
        });
    }
};

module.exports.delete = function(request, reply) {
    if (request.params.id) {
	if (!objectIdPattern.test(request.params.id)) {
            // 404 : Ressource not found
            reply(Boom.notFound('Object ' + request.params.id + ' not found'));
            return;
        }
	// Get existing object and delete it
        Object.findByIdAndRemove(request.params.id, function (err, object) {
            if (err) {
                // 500 : Internal server error
                reply(Boom.badImplementation("Cannot delete object"));
                return;
            }
	    // 204 : No content
	    reply().code(204);
        });
    }
};

