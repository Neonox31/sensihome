// Load dependencies
var Joi = require('joi');
Joi.objectId = require('joi-objectid');

// Local vars
var controller = require("../controllers/plugins.js");

module.exports = function() {
    return (    
	[

	    /**
	     * GET /api/v1/plugins/{name?}
	     *
	     * @description
	     *   Get unique plugin or list
	     *
	     * @return
	     *   200
	     */
	    
	    {
		method: 'GET',
		path: '/api/v1/plugins/{name?}',
		handler: controller.get.bind(this),
		config : {
		    validate: {
			params: {
			    name: Joi.string()
			}
		    }
		}
	    },
	    
	    /**
	     * GET /api/v1/plugins/{name}/init
	     *
	     * @description
	     *   Initialize a plugin
	     *
	     * @return
	     *   202
	     */
	    
	    {
		method: 'GET',
		path: '/api/v1/plugins/{name}/init',
		handler: controller.init.bind(this),
		config: {
		    validate: {
			params: {
                            name: Joi.string()
                        }
		    }
		}
	    },

	     /**
             * GET /api/v1/plugins/{name}/run
             *
             * @description
             *   Run a plugin
             *
             * @return
             *   202
             */

            {
                method: 'GET',
                path: '/api/v1/plugins/{name}/run',
                handler: controller.run.bind(this),
                config: {
                    validate: {
                        params: {
                            name: Joi.string()
                        }
                    }
                }
            },

	    /**
             * GET /api/v1/plugins/{name}/stop
             *
             * @description
             *   Stop a plugin
             *
             * @return
             *   202
             */

            {
                method: 'GET',
                path: '/api/v1/plugins/{name}/stop',
                handler: controller.stop.bind(this),
                config: {
                    validate: {
                        params: {
                            name: Joi.string()
                        }
                    }
                }
            },

	    /**
             * GET /api/v1/plugins/{name}/install
             *
             * @description
             *   Install a plugin
             *
             * @return
             *   202
             */

            {
                method: 'GET',
                path: '/api/v1/plugins/{name}/install',
                handler: controller.install.bind(this),
                config: {
                    validate: {
                        params: {
                            name: Joi.string()
                        }
                    }
                }
            },

	    /**
             * GET /api/v1/plugins/{name}/uninstall
             *
             * @description
             *   Uninstall a plugin
             *
             * @return
             *   202
             */

            {
                method: 'GET',
                path: '/api/v1/plugins/{name}/uninstall',
                handler: controller.uninstall.bind(this),
                config: {
                    validate: {
                        params: {
                            name: Joi.string()
                        }
                    }
                }
            },

	    /**
             * PUT /api/v1/plugins/{name}
             *
             * @description
             *   Updates plugin
             *
             * @return
             *   202
             */

            {
                method: 'PUT',
                path: '/api/v1/plugins/{name}',
                handler: controller.put.bind(this),
                config: {
                    validate: {
                        params: {
                            name: Joi.string()
                        },
			payload: {
			    config: Joi.object()
			}
		    }
                }
            },
	    
	]
    )
}
