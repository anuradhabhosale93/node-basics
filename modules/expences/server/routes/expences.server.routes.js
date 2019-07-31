'use strict';

/**
 * Module dependencies
 */
var expencesPolicy = require('../policies/expences.server.policy'),
  expences = require('../controllers/expences.server.controller');

module.exports = function(app) {
  // Expences Routes
  app.route('/api/expences').all(expencesPolicy.isAllowed)
    .get(expences.list)
    .post(expences.create);

  app.route('/api/expences/:expenceId').all(expencesPolicy.isAllowed)
    .get(expences.read)
    .put(expences.update)
    .delete(expences.delete);

  // Finish by binding the Expence middleware
  app.param('expenceId', expences.expenceByID);
};
