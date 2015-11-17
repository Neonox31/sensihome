// Load dependencies
var Boom = require('boom');

function SensihomeError(msg, code, httpCode) {
    Error.call(this);
    Error.captureStackTrace && Error.captureStackTrace(this, arguments.callee);
    this.message = msg;
    if (code)
        this.code = code;
    this.httpCode = httpCode || 500;
    this.name = 'SensihomeError';
//    console.error(this.message);
}

// Inherits from Error.
SensihomeError.prototype = Object.create(Error.prototype);
SensihomeError.prototype.constructor = Error;

// Add Boom Integration
SensihomeError.prototype.toBoomError = function () {
    return Boom.create(this.httpCode, this.message, {timestamp: Date.now()});
};

// Module export
module.exports = exports = SensihomeError;
