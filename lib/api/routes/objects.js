// Local vars
var controller = require("../controllers/objects.js");

module.exports = [

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
    handler: controller.get
  },

  /**
   * POST /api/v1/objects/{id?}
   *
   * @description
   *   Update or append object
   *
   * @return
   *   201
   */

  {
    method: 'POST',
    path: '/api/v1/objects/{id?}',
    handler: controller.post
  },

  /**
   * PUT /api/v1/objects/{id?}
   *
   * @description
   *   Update or append object
   *
   * @return
   *   201
   */

  {
    method: 'PUT',
    path: '/api/v1/objects/{id?}',
    handler: controller.put
  },

  /**
   * DELETE /api/v1/objects/{id}
   *
   * @description
   *   Delete object
   *
   * @return
   *   200
   */

  {
    method: 'DELETE',
    path: '/api/v1/objects/{id}',
    handler: controller.delete
  }

];
