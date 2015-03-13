/** Objects controller **/

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
	if (!this.pluginsMgr.plugins.hasOwnProperty(pluginToken + request.params.name)) {
	    // 404 : Ressource not found
	    return reply(Boom.notFound("plugin " + request.params.name + " not found."));
	}
	reply(this.pluginsMgr.get(pluginToken + request.params.name));
    } else {
        // Get plugin list
	reply(this.pluginsMgr.getAll());
    }
};

module.exports.init = function(request, reply) {
    // `this` - is a reference to sensihome scope
    if (!this.pluginsMgr.plugins.hasOwnProperty(pluginToken + request.params.name)) {
        // 404 : Ressource not found
        return reply(Boom.notFound("plugin " + request.params.name + " not found."));
    }
    this.pluginsMgr.init(pluginToken + request.params.name, function(err) {
        if (err)
	    return reply(err.toBoomError());
    });
    reply();
};

module.exports.run = function(request, reply) {
    // `this` - is a reference to sensihome scope
    if (!this.pluginsMgr.plugins.hasOwnProperty(pluginToken + request.params.name)) {
        // 404 : Ressource not found
        return reply(Boom.notFound("plugin " + request.params.name + " not found."));
    }
    this.pluginsMgr.run(pluginToken + request.params.name, function(err) {
        if (err)
            return reply(err.toBoomError());
	reply();
    });
};

module.exports.stop = function(request, reply) {
    // `this` - is a reference to sensihome scope
    if (!this.pluginsMgr.plugins.hasOwnProperty(pluginToken + request.params.name)) {
        // 404 : Ressource not found
        return reply(Boom.notFound("plugin " + request.params.name + " not found."));
    }
    this.pluginsMgr.stop(pluginToken + request.params.name, function(err) {
        if (err)
            return reply(err.toBoomError());
	reply();
    });
};

module.exports.put = function(request, reply) {
    // `this` - is a reference to sensihome scope
    if (!this.pluginsMgr.plugins.hasOwnProperty(pluginToken + request.params.name)) {
        // 404 : Ressource not found
        return reply(Boom.notFound("plugin " + request.params.name + " not found."));
    }
    if (request.payload.config && !_.isEmpty(request.payload.config)) {
	 this.pluginsMgr.saveConfig(pluginToken + request.params.name, request.payload.config, function(err) {
             if (err)
		 return reply(err.toBoomError());
	     reply();
	 });
    }
}

