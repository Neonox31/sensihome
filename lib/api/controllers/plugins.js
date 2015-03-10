/** Objects controller **/

// Load dependencies
var Boom = require('boom');

// Local vars
var pluginToken = "sensihome-plugin-";

module.exports.get = function(request, reply) {
    // `this` - is a reference to sensihome scope
    if (request.params.name) {
        // Get an unique plugin
	if (!this.pluginsMgr.plugins.hasOwnProperty(pluginToken + request.params.name)) {
	    // 404 : Ressource not found
	    reply(Boom.notFound("plugin " + request.params.name + " not found."));
	}
	reply(this.pluginsMgr.plugins[pluginToken + request.params.name]);
    } else {
        // Get plugin list
	reply(this.pluginsMgr.plugins);
    }
};

module.exports.init = function(request, reply) {
    // `this` - is a reference to sensihome scope
    if (!this.pluginsMgr.plugins.hasOwnProperty(pluginToken + request.params.name)) {
        // 404 : Ressource not found
        reply(Boom.notFound("plugin " + request.params.name + " not found."));
    }
    this.pluginsMgr.init(pluginToken + request.params.name, function(err) {
	// 500 : Internal server error
        if (err) {
	    reply(Boom.badImplementation(err));
	    return;
	}
    });
    reply().code(202);
};

module.exports.run = function(request, reply) {
    // `this` - is a reference to sensihome scope
    if (!this.pluginsMgr.plugins.hasOwnProperty(pluginToken + request.params.name)) {
        // 404 : Ressource not found
        reply(Boom.notFound("plugin " + request.params.name + " not found."));
    }
    this.pluginsMgr.run(pluginToken + request.params.name, function(err) {
        // 500 : Internal server error
        if (err) {
            reply(Boom.badImplementation(err));
            return;
        }
    });
    reply().code(202);
};

module.exports.stop = function(request, reply) {
    // `this` - is a reference to sensihome scope
    if (!this.pluginsMgr.plugins.hasOwnProperty(pluginToken + request.params.name)) {
        // 404 : Ressource not found
        reply(Boom.notFound("plugin " + request.params.name + " not found."));
    }
    this.pluginsMgr.stop(pluginToken + request.params.name, function(err) {
        // 500 : Internal server error
        if (err) {
            reply(Boom.badImplementation(err));
            return;
        }
    });
    reply().code(202);
};

