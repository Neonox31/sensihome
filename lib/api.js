
// Load modules
var Hapi = require('hapi');
var Boom = require('boom');
var fs = require('fs');

// Declare internals
var internals = {};

// Local vars
var routeFilesPath = require("path").join(__dirname, "api/routes");

module.exports = internals.Api = function(sensihome, options) {
    this.sensihome = sensihome;
    this.server = new Hapi.Server();
    
    // Setup server host and port
    this.server.connection({host: this.sensihome.config.get("api:host"), port: this.sensihome.config.get("api:port")});

    // Setup SocketIO plugin
    this.server.register({
	register: require('hapi-io'),
	options: {}
    }, function (err) {
	if (err)
	    console.error("Cannot load SocketIO plugin for hapi.");
    });

    // Setup server routes
    var self = this;
    fs.readdirSync(routeFilesPath).forEach(function(file) {
	var routes = require(routeFilesPath + '/' + file).call(self.sensihome);
	for (var route in routes) {
	    self.server.route(routes[route]);
	}
    });

    // Start server
    var self = this;
    this.server.start(function() {
	console.log('api started on %s', self.server.info.uri);
    });
};

internals.Api.prototype.getServer = function () {
    return this.server;
};

internals.Api.prototype.getSocket = function () {
    return this.server.plugins['hapi-io'].io;
};

internals.Api.prototype.handleRESTGetRequest = function(Model, request, reply) {
    if (request.params.id) {
	// Get an unique item
	Model.findById(request.params.id, function (err, item) {
            if (err) {
		// 500 : Internal server error
		reply(Boom.badImplementation(err));
		return;
            }
            if (!item) {
		// 404 : Ressource not found
		reply(Boom.notFound(Model.collection.name + ' ' + request.params.id + ' not found'));
		return;
            }
            reply(item);
	});
    } else {
        // Get item list
        Model.find({}, function (err, items) {
            if (err) {
                // 500 : Internal server error
                reply(Boom.badImplementation(err));
                return;
            }
            reply(items);
        });
    }
}

internals.Api.prototype.handleRESTPostRequest = function(Model, request, reply) {
    // Create item
    var item = new Model(request.payload);
    item.save(function (err, item) {
        if (err) {
            // 500 : Internal server error
            reply(Boom.badImplementation(err));
            return;
        }
        // 201 : Created
        reply(item).code(201);
    });
}

internals.Api.prototype.handleRESTPutRequest = function(Model, request, reply) {
    // Get existing item and update
    Model.findByIdAndUpdate(request.params.id, request.payload, function (err, item) {
        if (err) {
            // 500 : Internal server error
            reply(Boom.badImplementation(err));
            return;
        }
        if (!item) {
            // 404 : Ressource not found
            reply(Boom.notFound(Model.collection.name + ' ' + request.params.id + ' not found'));
            return;
        }
        // 200 : Success
        reply(item);
    });
}

internals.Api.prototype.handleRESTDeleteRequest = function(Model, request, reply) {
    // Get existing item and delete it
    Model.findByIdAndRemove(request.params.id, function (err, item) {
        if (err) {
            // 500 : Internal server error
            reply(Boom.badImplementation("cannot delete " + Model.collection.name));
            return;
        }
        // 204 : No content
        reply().code(204);
    });
}
