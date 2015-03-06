// Load dependencies
var async = require("async");
var config = require("config");
var mongoose = require("mongoose");

// Load sensihome dependencies
var Api = require("./api.js");
var Plugins = require("./plugins.js");

(function(log, err, exit) {

/** Get the package.json **/
try {
    var appPackage = require(__dirname + '/../package.json');
} catch (e) {
    err(e);
    exit();
}

/** Init sensihome scope **/
this.sensihome = {};

/** Init config **/
this.sensihome.config = config;

/** Init database **/
this.sensihome.database = mongoose;
this.sensihome.database.connect(this.sensihome.config.database.uri);

/** Init api **/
this.sensihome.apiMgr = new Api(this.sensihome);

/** Init plugins **/
this.sensihome.pluginsMgr = new Plugins(this.sensihome);
async.waterfall([
    function (next) {
	this.sensihome.pluginsMgr.getInstalled(next);
    },
    function (next) {
	this.sensihome.pluginsMgr.attachAll(next);
    },
    function (next) {
	this.sensihome.pluginsMgr.runAll(next);
    }],
	function (e) {
	    err(e);
	});

/** Start application **/
log("%s v%s started", appPackage.name, appPackage.version);

})(console.log, console.error, process.exit);

