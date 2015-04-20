/** Plugins controller **/

// Load dependencies
var Boom = require('boom');
var _ = require("lodash");

// Load sensihome dependencies
var SensihomeError = require('../../error.js');

// Local vars
var pluginToken = "sensihome-plugin-";

module.exports.get = function(request, reply) {
    // `this` - is a reference to sensihome scope
    if (request.params.name) {
        // Get an unique plugin
	if (!this.plugins.plugins.hasOwnProperty(pluginToken + request.params.name)) {
	    // 404 : Ressource not found
	    return reply(Boom.notFound("plugin " + request.params.name + " not found."));
	}
	reply(this.plugins.get(pluginToken + request.params.name));
    } else {
        // Get plugin list
	reply(this.plugins.get());
    }
};

module.exports.init = function(request, reply) {
    // `this` - is a reference to sensihome scope
    if (!this.plugins.plugins.hasOwnProperty(pluginToken + request.params.name)) {
        // 404 : Ressource not found
        return reply(Boom.notFound("plugin " + request.params.name + " not found."));
    }
    this.plugins.init(pluginToken + request.params.name, function(err) {
        if (err)
	    return reply(err.toBoomError());
    });
    reply();
};

module.exports.run = function(request, reply) {
    // `this` - is a reference to sensihome scope
    if (!this.plugins.plugins.hasOwnProperty(pluginToken + request.params.name)) {
        // 404 : Ressource not found
        return reply(Boom.notFound("plugin " + request.params.name + " not found."));
    }
    this.plugins.run(pluginToken + request.params.name, function(err) {
        if (err)
            return reply(err.toBoomError());
	reply();
    });
};

module.exports.stop = function(request, reply) {
    // `this` - is a reference to sensihome scope
    if (!this.plugins.plugins.hasOwnProperty(pluginToken + request.params.name)) {
        // 404 : Ressource not found
        return reply(Boom.notFound("plugin " + request.params.name + " not found."));
    }
    this.plugins.stop(pluginToken + request.params.name, function(err) {
        if (err)
            return reply(err.toBoomError());
	reply();
    });
};

module.exports.install = function(request, reply) {
    // `this` - is a reference to sensihome scope
    this.plugins.install(pluginToken + request.params.name, function(err) {
        if (err)
            return reply(err.toBoomError());
        reply().code(202);
    });
};

module.exports.uninstall = function(request, reply) {
    // `this` - is a reference to sensihome scope
    this.plugins.uninstall(pluginToken + request.params.name, function(err) {
        if (err)
            return reply(err.toBoomError());
        reply().code(202);
    });
};

module.exports.put = function(request, reply) {
    // `this` - is a reference to sensihome scope
    if (!this.plugins.plugins.hasOwnProperty(pluginToken + request.params.name)) {
        // 404 : Ressource not found
        return reply(Boom.notFound("plugin " + request.params.name + " not found."));
    }
    if (request.payload.config && !_.isEmpty(request.payload.config)) {
	 this.plugins.saveConfig(pluginToken + request.params.name, request.payload.config, function(err) {
             if (err)
		 return reply(err.toBoomError());
	     reply();
	 });
    }
}

