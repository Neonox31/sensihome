// Load modules
var Hapi = require("hapi");
var requireDirectory = require('require-directory');

// Declare internals
var internals = {};

// Local vars
var routeFiles = requireDirectory(module, 'api/routes');

module.exports = internals.Api = function(sensihome, options) {
    this.sensihome = sensihome;
    this.server = new Hapi.Server();
    
    // Setup server host and port
    this.server.connection({host: this.sensihome.config.api.host, port: this.sensihome.config.api.port});

    // Setup server routes
    for (var file in routeFiles) {
	for (var route in routeFiles[file]) {
	    this.server.route(routeFiles[file][route]);
	}
    }

    // Start server
    var self = this;
    this.server.start(function() {
	console.log('api started on %s', self.server.info.uri);
    });
};

internals.Api.prototype.getServer = function () {
    return this.server;
};
