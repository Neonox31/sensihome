// Load modules
var npm = require("npm");
var async = require("async");
var _ = require("lodash");

// Declare internals
var internals = {};

// Local vars
var pluginPattern = /^sensihome-plugin-(.*)$/;

module.exports = internals.Plugins = function(sensihome, options) {
    this.sensihome = sensihome;
    this.plugins = {};
};

internals.Plugins.prototype.getInstalled = function (cb) {
    var self = this;
    if (this.sensihome.config.plugins && this.sensihome.config.plugins.autostart && this.sensihome.config.plugins.autostart === true) {
	async.waterfall([
            function (next) {
		npm.load({loaded: false}, next);
            },
            function (npm, next) {
		npm.commands.list([], true, next);
            },
            function (data, next) {
		// Erase plugins in memory
		self.plugins = {};

		for (var dependency in data.dependencies) {
                    if (pluginPattern.test(data.dependencies[dependency].name)) {
			console.log("installed plugin detected : %s", data.dependencies[dependency].name);
                    
			// Add plugin in memory
			try {
			    self.add(data.dependencies[dependency]);
			} catch (e) {
			    throw new Error(e);
			}
                    }
		}
		if (_.isEmpty(self.plugins)) {
		    return next("no installed plugins detected.");
		}
		cb();
            }
	],
		function (err) {
		    if (err)
			return cb(err, null);
		});
    }
};

internals.Plugins.prototype.add = function(plugin) {
    // Get plugin instance
    try {
	var pluginInstance = require(plugin.name);
    } catch (e) {
	throw new Error(plugin.name + " : " + e);
    }

    // Test plugin structure
    if (!pluginInstance.attach && typeof pluginInstance.attach !== "function")
	throw new Error(plugin.name + " : " + "invalid or missing attach function", null);
    if (!pluginInstance.run && typeof pluginInstance.run !== "function")
	throw new Error(plugin.name + " : " + "invalid or missing run function", null);
    if (!pluginInstance.detach && typeof pluginInstance.detach !== "function")
        throw new Error(plugin.name + " : " + "invalid or missing detach function", null);

     // Add plugin in memory
     var item = {
	 pkg: plugin,
         instance: pluginInstance,
         initialized: false,
	 running: false
     };
     this.plugins[plugin.name] = item;
};

internals.Plugins.prototype.getAll = function() {
    return this.sensihome.plugins;
};

internals.Plugins.prototype.attachAll = function(cb) {
    if (_.isEmpty(this.plugins))
	return cb("no installed plugins detected");
    var self = this;
    async.each(Object.keys(this.plugins), this.attach.bind(self), function (err) {
	if (err)
	    return cb(err);
	cb();
    });
};

internals.Plugins.prototype.attach = function(plugin, cb) {
    var self = this;
    this.plugins[plugin].instance.attach(this.sensihome, {}, function (err, next) {
	if (err)
	    return cb(err);
	self.plugins[plugin].initialized = true;
	cb();
    });
};

internals.Plugins.prototype.runAll = function(cb) {
    if (_.isEmpty(this.plugins))
        return cb("no installed plugins detected", null);
    var self = this;
    async.each(Object.keys(this.plugins), this.run.bind(self), function (err) {
        if (err)
            return cb(err);
        cb();
    });
};

internals.Plugins.prototype.run = function(plugin, cb) {
    var self = this;
    this.plugins[plugin].instance.run(this.sensihome, {}, function (err, next) {
	if (err)
	    return cb(err);
        self.plugins[plugin].running = true;
        cb();
    });
};

internals.Plugins.prototype.detachAll = function(cb) {
    if (_.isEmpty(this.plugins))
        return cb("no installed plugins detected");
    var self = this;
    async.each(Object.keys(this.plugins), this.detach.bind(self), function (err) {
        if (err)
            return cb(err);
        cb();
    });
};

internals.Plugins.prototype.detach = function(plugin, cb) {
    var self = this;
    this.plugins[plugin].instance.detach(this.sensihome, {}, function (err, next) {
        if (err)
            return cb(err);
        delete self.plugins[plugin];
        cb();
    });
};
