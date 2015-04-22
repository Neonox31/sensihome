// Load dependencies
var Joi = require('joi');
Joi.objectId = require('joi-objectid');

// Local vars
var controller = require("../controllers/items.js");

module.exports = function() {
    return (    
	[

	    /**
	     * GET /api/v1/items/{id?}
	     *
	     * @description
	     *   Get unique item or list
	     *
	     * @return
	     *   200
	     */
	    
	    {
		method: 'GET',
		path: '/api/v1/items/{id?}',
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
	     * POST /api/v1/items
	     *
	     * @description
	     *   Creates an item
	     *
	     * @return
	     *   201
	     */
	    
	    {
		method: 'POST',
		path: '/api/v1/items',
		handler: controller.add.bind(this),
		config: {
		    validate: {
			payload: {
			    name: Joi.string().trim().min(3).max(100).required(),
			    parent: Joi.objectId()
			} 
		    }
		}
	    },
	    
	    /**
	     * PUT /api/v1/items/{id}
	     *
	     * @description
	     *   Update an item
	     *
	     * @return
	     *   200
	     */
	    
	    {
		method: 'PUT',
		path: '/api/v1/items/{id}',
		handler: controller.update.bind(this),
		config: {
		    validate: {
			params: {
			    id: Joi.objectId()
			},
			payload: {
			    name: Joi.string().trim().min(3).max(100).required(),
			    parent: Joi.objectId()
			}
		    }
		}
	    },
	    
	    /**
	     * DELETE /api/v1/items/{id}
	     *
	     * @description
	     *   Delete an item
	     *
	     * @return
	     *   204
	     */
	    
	    {
		method: 'DELETE',
		path: '/api/v1/items/{id}',
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
