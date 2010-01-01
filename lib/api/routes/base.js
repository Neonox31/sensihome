// Local vars
var controller = require("../controllers/base.js");

module.exports = function(sensihome) {
    return (
	[

	    /**
	     * GET /
	     *
	     * @description
	     *   Index de l'API
	     *
	     * @return
	     *   200
	     */
	    
	    {
		method: 'GET',
		path: '/',
		handler: controller.index
	    }

	]
    );
}
