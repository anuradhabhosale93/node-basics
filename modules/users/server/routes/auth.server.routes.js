'use strict';
const validator = require('../validator/auth');
const validatorErrors = require('../../../../utils/validatorErrors');
/**
 * Module dependencies
 */
var passport = require('passport');

module.exports = function (app) {
  // User Routes
  var users = require('../controllers/users.server.controller');

  // Setting up the users password api
  app.route('/api/auth/forgot').post(users.forgot);
  app.route('/api/auth/reset/:token').get(users.validateResetToken);
  app.route('/api/auth/reset/:token').post(users.reset);

  // Setting up the users authentication api
  app.route('/api/auth/signup').post(validator.signup, validatorErrors.validationErrorChecker, users.signup);
  app.route('/api/auth/signin').post(validator.signin, validatorErrors.validationErrorChecker, users.signin);
  app.route('/api/auth/signout').get(users.signout);

  // Setting the oauth routes
  app.route('/api/auth/:strategy').get(users.oauthCall);
  app.route('/api/auth/:strategy/callback').get(users.oauthCallback);

};
