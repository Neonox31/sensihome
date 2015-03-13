// Load modules
var npm = require("npm");
var async = require("async");
var _ = require("lodash");

// Load sensihome dependencies
var SensihomeError = require("./error.js");

// Declare internals
var internals = {};

var pluginPattern = /^sensihome-plugin-(.*)$/;

var prettyfy = function (plugin) {
    var out = _.omit(plugin, "instance");
    out = _.omit(out, "pkg");
    out.attributes = plugin.instance.attributes;

    if (plugin.instance.attributes.config && plugin.instance.attributes.config.get)
	out.attributes.config = plugin.instance.attributes.config.get();
    return out;
}

module.exports = internals.Plugins = function(sensihome, options) {
    this.sensihome = sensihome;
    this.plugins = {};
};

internals.Plugins.prototype.getInstalled = function (cb) {
    var self = this;
    if (this.sensihome.config.get("plugins:autostart") === true) {
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
		    console.log("no installed plugins detected.")
		    return next();
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
    if (this.plugins.hasOwnProperty(plugin.name))
	throw new SensihomeError(plugin.name + " : " + "already installed.", null, 400);
    // Get plugin instance
    try {
	var pluginInstance = require(plugin.name);
    } catch (e) {
	throw new SensihomeError(plugin.name + " : " + e, null, 400);
    }

    // Test plugin structure
    if (!pluginInstance.init && typeof pluginInstance.init !== "function")
	throw new SensihomeError(plugin.name + " : " + "invalid or missing init function", null, 400);
    if (!pluginInstance.run && typeof pluginInstance.run !== "function")
	throw new SensihomeError(plugin.name + " : " + "invalid or missing run function", null, 400);
    if (!pluginInstance.stop && typeof pluginInstance.stop !== "function")
        throw new SensihomeError(plugin.name + " : " + "invalid or missing stop function", null, 400);

     // Add plugin in memory
     var item = {
	 pkg: plugin,
         instance: pluginInstance,
	 initialized: false,
	 running: false
     };
     this.plugins[plugin.name] = item;
};

internals.Plugins.prototype.get = function(plugin) {
    return prettyfy(this.plugins[plugin]);
};

internals.Plugins.prototype.getAll = function() {
    var out = {};

    for (var key in this.plugins) {
	var match = pluginPattern.exec(key);
	out[match[1]] = prettyfy(this.plugins[key]);
    }
    return out;
};

internals.Plugins.prototype.initAll = function(cb) {
    if (_.isEmpty(this.plugins)) {
	console.log("initAll : no installed plugins detected.");
	return cb();
    }
    var self = this;
    async.each(Object.keys(this.plugins), this.init.bind(self), function (err) {
	if (err)
	    return cb(err);
	cb();
    });
};

internals.Plugins.prototype.init = function(plugin, cb) {
    if (this.plugins[plugin].initialized === true)
        return cb(new SensihomeError(plugin + " " + "already initialized.", null, 400));
    var self = this;
    this.plugins[plugin].instance.init(this.sensihome, {}, function (err) {
	if (err)
	    return cb(err);
	self.plugins[plugin].initialized = true;
	cb();
    });
};

internals.Plugins.prototype.runAll = function(cb) {
    if (_.isEmpty(this.plugins)) {
        console.log("runAll : no installed plugins detected.");
        return cb();
    }
    var self = this;
    async.each(Object.keys(this.plugins), this.run.bind(self), function (err) {
        if (err)
            return cb(err);
        cb();
    });
};

internals.Plugins.prototype.run = function(plugin, cb) {
    if (this.plugins[plugin].running === true)
	return cb(new SensihomeError(plugin + " " + "already running.", null, 400));
    if (this.plugins[plugin].instance.attributes.config.get("enabled") === false) {
	console.log("plugin " + plugin + " not enabled. see its config.");
	return cb();
    }
    var self = this;
    this.plugins[plugin].instance.run(this.sensihome, {}, function (err) {
	if (err)
	    return cb(err);
        self.plugins[plugin].running = true;
        cb();
    });
};

internals.Plugins.prototype.stopAll = function(cb) {
    if (_.isEmpty(this.plugins)) {
        console.log("stopAll : no installed plugins detected.");
        return cb();
    }
    var self = this;
    async.each(Object.keys(this.plugins), this.stop.bind(self), function (err) {
        if (err)
            return cb(err);
        cb();
    });
};

internals.Plugins.prototype.stop = function(plugin, cb) {
    if (this.plugins[plugin].running === false)
	return cb(new SensihomeError(plugin + " " + "already stopped.", null, 400));
    var self = this;
    this.plugins[plugin].instance.stop(this.sensihome, {}, function (err) {
        if (err)
            return cb(err);
	self.plugins[plugin].running = false;
        cb();
    });
};

internals.Plugins.prototype.saveConfig = function(plugin, config, cb) {    
    if (!this.plugins[plugin].instance.attributes.config) {
	return cb(new SensihomeError("Cannot access config for " + plugin + " plugin."));
    }
    this.plugins[plugin].instance.attributes.config.merge(config);
    this.plugins[plugin].instance.attributes.config.save(function(err) {
	if (err)
	    return cb(new SensihomeError("Cannot save config for plugin " + plugin + " : " + err));
	cb();
    });
};
