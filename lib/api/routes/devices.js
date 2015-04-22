// Load dependencies
var Joi = require('joi');
Joi.objectId = require('joi-objectid');

// Local vars
var controller = require("../controllers/devices.js");

module.exports = function() {
    return (    
	[

	    /**
	     * GET /api/v1/devices/{id?}
	     *
	     * @description
	     *   Get unique device or list
	     *
	     * @return
	     *   200
	     */
	    
	    {
		method: 'GET',
		path: '/api/v1/devices/{id?}',
		handler: controller.get.bind(this),
		config: {
		    validate: {
			params: {
			    id: Joi.objectId()
			}
		    }
		}
	    },
	    
	    /**
	     * POST /api/v1/devices
	     *
	     * @description
	     *   Creates a device
	     *
	     * @return
	     *   201
	     */
	    
	    {
		method: 'POST',
		path: '/api/v1/devices',
		handler: controller.add.bind(this),
		config: {
		    validate: {
			payload: {
			    name: Joi.string().trim().min(3).max(100).required()
			} 
		    }
		}
	    },
	    
	    /**
	     * PUT /api/v1/devices/{id}
	     *
	     * @description
	     *   Update a device
	     *
	     * @return
	     *   200
	     */
	    
	    {
		method: 'PUT',
		path: '/api/v1/devices/{id}',
		handler: controller.update.bind(this),
		config: {
		    validate: {
			params: {
			    id: Joi.objectId()
			},
			payload: {
			    name: Joi.string().trim().min(3).max(100).required()
			}
		    }
		}
	    },
	    
	    /**
	     * DELETE /api/v1/devices/{id}
	     *
	     * @description
	     *   Delete a device
	     *
	     * @return
	     *   204
	     */
	    
	    {
		method: 'DELETE',
		path: '/api/v1/devices/{id}',
		handler: controller.delete.bind(this),
		config: {
		    validate: {
			params: {
			    id: Joi.objectId()
			}
		    }
		}
	    }
	    
	]
    )
}
