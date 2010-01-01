/** Objects controller **/

// Load dependencies
var Boom = require('boom');

// Local vars
var Object = require("../models/object").Object;

module.exports.get = function(request, reply) {
    // `this` - is a reference to sensihome scope
    this.apiMgr.handleRESTGetRequest(Object, request, reply);
};

module.exports.post = function(request, reply) {
    // `this` - is a reference to sensihome scope
    this.apiMgr.handleRESTPostRequest(Object, request, reply);
};

module.exports.put = function(request, reply) {
    // `this` - is a reference to sensihome scope
    this.apiMgr.handleRESTPutRequest(Object, request, reply);
};

module.exports.delete = function(request, reply) {
    // `this` - is a reference to sensihome scope
    this.apiMgr.handleRESTDeleteRequest(Object, request, reply);
};

