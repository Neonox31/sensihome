// Load modules
var mongoose = require("mongoose");
var _ = require("lodash");

// Load sensihome dependencies
var SensihomeError = require("../error.js");

var DeviceSchema = new mongoose.Schema({
  name: {
    type: String,
    index: true
  },
  object_id: {
    type: mongoose.Schema.Types.ObjectId,
    index: true
  },
  value: {
    type: Number    
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

DeviceSchema.statics.get = function (id, cb) {
    // Get an unique device
    var errorPrepend = "Get device : ";
    if (typeof cb === 'undefined')
        cb = id;
    if (id) {
        this.findOne({_id: id}, function (err, device) {
	    if (err)
		return cb(new SensihomeError(errorPrepend + err.message, null, 500));
            if (!device) {
		return cb(new SensihomeError(errorPrepend + id + " not found.", null, 404));
            }
            cb(null, device);
        });
    } else {
	 // Get device list
         this.find({}, function (err, devices) {
	     if (err)
		 return cb(new SensihomeError(errorPrepend + err.message, null, 500));
            cb(null, devices);
        });
    }
}

DeviceSchema.statics.add = function (data, cb) {
    // Create device
    var errorPrepend = "Create device : ";
    if (arguments.length < 2 || Object.prototype.toString.call(cb) !== "[object Function]")
        return cb(new SensihomeError(errorPrepend + "Wrong arguments.", null, null));
    var device = new Device(data);
    device.save(function (err, device) {
	if (err)
            return cb(new SensihomeError(errorPrepend + err.message, null, 500));
	cb(null, device);
    });
}

DeviceSchema.statics.update = function (id, data, cb) {
    // Get existing device and update
    var errorPrepend = "Update device : ";
    if (arguments.length < 3 || Object.prototype.toString.call(cb) !== "[object Function]")
        return cb(new SensihomeError(errorPrepend + "Wrong arguments.", null, null));
    this.findOneAndUpdate({_id: id}, _.extend(data, {updated_at: new Date()}), {new: true}, function (err, device) {
        if (err)
            return cb(new SensihomeError(errorPrepend + err.message, null, 500));
        if (!device) {
	    return cb(new SensihomeError(errorPrepend + id + " not found.", null, 404));
        }
	cb(null, device);
    });
}

DeviceSchema.statics.delete = function (id, cb) {
    // Get existing device and delete it
    var errorPrepend = "Delete device : ";
    if (arguments.length < 2 || Object.prototype.toString.call(cb) !== "[object Function]")
        return cb(new SensihomeError(errorPrepend + "Wrong arguments.", null, null));
    this.findOneAndRemove({_id: id}, function (err) {
        if (err)
            return cb(new SensihomeError(errorPrepend + err.message, null, 500));
	cb();
    });
}

var Device = mongoose.model('Device', DeviceSchema);

module.exports = {
  Device: Device
}
