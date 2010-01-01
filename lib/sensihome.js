// Load dependencies
var async = require("async");
var nconf = require('nconf');
var mongoose = require("mongoose");
var events = require('events');

// Load sensihome dependencies
var Api = require("./api.js");
var Plugins = require("./plugins.js");
var Devices = require("./devices.js");
var Items = require("./items.js");

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

nconf.argv().env();
nconf.file({ file: __dirname + '/../config/config.json' });
this.sensihome.config = nconf;

/** Init events **/
this.sensihome.events = new events.EventEmitter();

/** Init database **/
this.sensihome.database = mongoose;
this.sensihome.database.connect(this.sensihome.config.get("database:uri"));

/** Init api **/
//this.sensihome.api = new Api(this.sensihome);

/** Init plugins **/
this.sensihome.plugins = new Plugins(this.sensihome);
async.waterfall([
    function (next) {
	this.sensihome.plugins.getInstalled(next);
    },
    function (next) {
	this.sensihome.plugins.initAll(next);
    },
    function (next) {
	this.sensihome.plugins.runAll(next);
    }],
	function (e) {
	    err(e);
	});

/** Init items **/
this.sensihome.items = new Items(this.sensihome);

/** Init devices **/
this.sensihome.devices = new Devices(this.sensihome);

/** Init api **/
this.sensihome.api = new Api(this.sensihome);

/** Start application **/
log("%s v%s started", appPackage.name, appPackage.version);

})(console.log, console.error, process.exit);

