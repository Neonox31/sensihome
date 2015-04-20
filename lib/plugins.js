// Load modules
var npm = require("npm");
var async = require("async");
var _ = require("lodash");
var exec = require('child_process').exec;

// Load sensihome dependencies
var SensihomeError = require("./error.js");

// Declare internals
var internals = {};

var pluginPattern = /^sensihome-plugin-(.*)$/;

var prettyfy = function (plugin) {
    var out = _.cloneDeep(plugin);
    out = _.omit(out, "instance");
    out = _.omit(out, "pkg");
    out.attributes = _.cloneDeep(plugin.instance.attributes);

    if (plugin.instance.attributes.config && plugin.instance.attributes.config.get)
	out.attributes.config = plugin.instance.attributes.config.get();
    return out;
}

module.exports = internals.Plugins = function(sensihome, options) {
    this.sensihome = sensihome;
    this._plugins = {};
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
		self._plugins = {};

		for (var dependency in data.dependencies) {
                    if (pluginPattern.test(data.dependencies[dependency].name)) {
			console.log("installed plugin detected : %s", data.dependencies[dependency].name);
                    
			// Add plugin in memory
			try {
			    self.add(data.dependencies[dependency].name);
			} catch (e) {
			    throw new SensihomeError(e);
			}
                    }
		}
		if (_.isEmpty(self._plugins)) {
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
    if (this._plugins.hasOwnProperty(plugin))
	throw new SensihomeError(plugin + " : " + "already installed.", null, 400);
    // Get plugin instance
    try {
	var pluginInstance = require(plugin);
    } catch (e) {
	throw new SensihomeError(plugin + " : " + e, null, 400);
    }

    // Test plugin structure
    if (!pluginInstance.init && typeof pluginInstance.init !== "function")
	throw new SensihomeError(plugin + " : " + "invalid or missing init function", null, 400);
    if (!pluginInstance.run && typeof pluginInstance.run !== "function")
	throw new SensihomeError(plugin + " : " + "invalid or missing run function", null, 400);
    if (!pluginInstance.stop && typeof pluginInstance.stop !== "function")
        throw new SensihomeError(plugin + " : " + "invalid or missing stop function", null, 400);

     // Add plugin in memory
     var item = {
         instance: pluginInstance,
	 initialized: false,
	 running: false
     };
     this._plugins[plugin] = item;
};

internals.Plugins.prototype.delete = function(plugin) {
    if (this._plugins[plugin].running === true)
        throw new SensihomeError(plugin + " " + "must be stopped.", null, 400);
    delete this._plugins[plugin];
};

internals.Plugins.prototype.install = function(plugin, cb) {
    if (process.env.NODE_ENV === "development")
	var command = "link";
    else
	var command = "install";
    var self = this;
    exec('npm ' + command + ' --save ' + plugin, function (err, stdout, stderr) {
	if (err)
	    return cb(new SensihomeError("Cannot install plugin " + plugin + " : " + err));
	self.add(plugin);
	self.init(plugin, function(err) {
	    if (err)
		return cb(err);
	});
	cb();
    });
};

internals.Plugins.prototype.uninstall = function(plugin, cb) {
    if (process.env.NODE_ENV === "development")
        var command = "unlink";
    else
        var command = "uninstall";
    var self = this;
    exec('npm ' + command + ' --save ' + plugin, function (err, stdout, stderr) {
        if (err)
            return cb(new SensihomeError("Cannot uninstall plugin " + plugin + " : " + err));
        self.stop(plugin, function(err) {
            if (err)
                return cb(err);
	    self.delete(plugin);
            cb();
        });
    });
};

internals.Plugins.prototype.get = function(plugin) {
    if (typeof name !== 'undefined')
	return prettyfy(this._plugins[plugin]);
    
    var out = {};
    for (var key in this._plugins) {
	var match = pluginPattern.exec(key);
	out[match[1]] = prettyfy(this._plugins[key]);
    }
    return out;
};

internals.Plugins.prototype.initAll = function(cb) {
    if (_.isEmpty(this._plugins)) {
	console.log("initAll : no installed plugins detected.");
	return cb();
    }
    var self = this;
    async.each(Object.keys(this._plugins), this.init.bind(self), function (err) {
	if (err)
	    return cb(err);
	cb();
    });
};

internals.Plugins.prototype.init = function(plugin, cb) {
    if (this._plugins[plugin].initialized === true)
        return cb(new SensihomeError(plugin + " " + "already initialized.", null, 400));
    var self = this;
    this._plugins[plugin].instance.init(this.sensihome, {}, function (err) {
	if (err)
	    return cb(err);
	self._plugins[plugin].initialized = true;
	cb();
    });
};

internals.Plugins.prototype.runAll = function(cb) {
    if (_.isEmpty(this._plugins)) {
        console.log("runAll : no installed plugins detected.");
        return cb();
    }
    var self = this;
    async.each(Object.keys(this._plugins), this.run.bind(self), function (err) {
        if (err)
            return cb(err);
        cb();
    });
};

internals.Plugins.prototype.run = function(plugin, cb) {
    if (this._plugins[plugin].running === true)
	return cb(new SensihomeError(plugin + " " + "already running.", null, 400));
    if (this._plugins[plugin].instance.attributes.config.get("enabled") === false) {
	console.log("plugin " + plugin + " not enabled. see its config.");
	return cb();
    }
    var self = this;
    this._plugins[plugin].instance.run(this.sensihome, {}, function (err) {
	if (err)
	    return cb(err);
        self._plugins[plugin].running = true;
        cb();
    });
};

internals.Plugins.prototype.stopAll = function(cb) {
    if (_.isEmpty(this._plugins)) {
        console.log("stopAll : no installed plugins detected.");
        return cb();
    }
    var self = this;
    async.each(Object.keys(this._plugins), this.stop.bind(self), function (err) {
        if (err)
            return cb(err);
        cb();
    });
};

internals.Plugins.prototype.stop = function(plugin, cb) {
    if (this._plugins[plugin].running === false)
	return cb(new SensihomeError(plugin + " " + "already stopped.", null, 400));
    var self = this;
    this._plugins[plugin].instance.stop(this.sensihome, {}, function (err) {
        if (err)
            return cb(err);
	self._plugins[plugin].running = false;
        cb();
    });
};

internals.Plugins.prototype.saveConfig = function(plugin, config, cb) {    
    if (!this._plugins[plugin].instance.attributes.config) {
	return cb(new SensihomeError("Cannot access config for " + plugin + " plugin."));
    }
    this._plugins[plugin].instance.attributes.config.merge(config);
    this._plugins[plugin].instance.attributes.config.save(function(err) {
	if (err)
	    return cb(new SensihomeError("Cannot save config for plugin " + plugin + " : " + err));
	cb();
    });
};
