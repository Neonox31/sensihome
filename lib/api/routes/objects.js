// Load dependencies
var Joi = require('joi');
Joi.objectId = require('joi-objectid');

// Local vars
var controller = require("../controllers/objects.js");

module.exports = function() {
    return (    
	[

	    /**
	     * GET /api/v1/objects/{id?}
	     *
	     * @description
	     *   Get unique object or list
	     *
	     * @return
	     *   200
	     */
	    
	    {
		method: 'GET',
		path: '/api/v1/objects/{id?}',
		handler: controller.get.bind(this)
	    },
	    
	    /**
	     * POST /api/v1/objects
	     *
	     * @description
	     *   Creates an object
	     *
	     * @return
	     *   201
	     */
	    
	    {
		method: 'POST',
		path: '/api/v1/objects',
		handler: controller.post.bind(this),
		config: {
		    validate: {
			payload: {
			    name: Joi.string().trim().min(3).max(100).required()
			} 
		    }
		}
	    },
	    
	    /**
	     * PUT /api/v1/objects/{id}
	     *
	     * @description
	     *   Update an object
	     *
	     * @return
	     *   200
	     */
	    
	    {
		method: 'PUT',
		path: '/api/v1/objects/{id}',
		handler: controller.put.bind(this),
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
	     * DELETE /api/v1/objects/{id}
	     *
	     * @description
	     *   Delete an object
	     *
	     * @return
	     *   204
	     */
	    
	    {
		method: 'DELETE',
		path: '/api/v1/objects/{id}',
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
