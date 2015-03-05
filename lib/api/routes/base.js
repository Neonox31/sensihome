// Local vars
var controller = require("../controllers/base.js");

module.exports = [

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

];
