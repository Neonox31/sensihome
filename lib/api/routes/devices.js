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
	    },

	    /*** Device commands ***/

	    /**
             * GET /api/v1/devices/{device_id}/commands/{command_id?}
             *
             * @description
             *   Get unique device command or list
             *
             * @return
             *   200
             */

            {
                method: 'GET',
                path: '/api/v1/devices/{device_id}/commands/{command_id?}',
                handler: controller.getCommands.bind(this),
                config: {
                    validate: {
                        params: {
                            device_id: Joi.objectId(),
			    commmand_id: Joi.objectId()
                        }
                    }
                }
            },

	     /**
             * POST /api/v1/devices/{device_id}/commands
             *
             * @description
             *   Creates a device command
             *
             * @return
             *   201
             */

            {
                method: 'POST',
                path: '/api/v1/devices/{device_id}/commands',
                handler: controller.addCommand.bind(this),
                config: {
                    validate: {
			params: {
                            device_id: Joi.objectId()
                        },
                        payload: {
			    name: Joi.string().required(),
                            type: Joi.string().valid(this.devices.commandTypes).required(),
                            device_id: Joi.objectId(),
                            plugin: Joi.string(),
                            plugin_data: Joi.object(),
			    value: Joi.any()
                        }
                    }
                }
            },

	    /**
             * PUT /api/v1/devices/{device_id}/commands/{command_id}
             *
             * @description
             *   Update a device command
             *
             * @return
             *   200
             */

            {
                method: 'PUT',
                path: '/api/v1/devices/{device_id}/commands/{command_id}',
                handler: controller.updateCommand.bind(this),
                config: {
                    validate: {
                        params: {
                            device_id: Joi.objectId(),
			    command_id: Joi.objectId()
                        },
                        payload: {
			    name: Joi.string().required(),
                            type: Joi.string().valid(this.devices.commandTypes).required(),
                            device_id: Joi.objectId(),
                            plugin: Joi.string(),
                            plugin_data: Joi.object(),
			    value: Joi.any()
                        }
                    }
                }
            },

	    /**
             * DELETE /api/v1/devices/{device_id}/commands/{command_id}
             *
             * @description
             *   Delete a device command
             *
             * @return
             *   204
             */

            {
                method: 'DELETE',
                path: '/api/v1/devices/{device_id}/commands/{command_id}',
                handler: controller.deleteCommand.bind(this),
                config: {
                    validate: {
                        params: {
                            device_id: Joi.objectId(),
			    command_id: Joi.objectId()
                        }
                    }
                }
            },
	    
	]
    )
}
