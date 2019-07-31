'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');
var jwt = require('jsonwebtoken');
// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Expences Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/expences',
      permissions: '*'
    }, {
      resources: '/api/expences/:expenceId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/expences',
      permissions: '*'
    }, {
      resources: '/api/expences/:expenceId',
      permissions: '*'
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/expences',
      permissions: ['get']
    }, {
      resources: '/api/expences/:expenceId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Expences Policy Allows
 */
exports.isAllowed = function (req, res, next) {

  const token = req.query.token;
  const decoded = jwt.decode(token);
  console.log("user="+decoded.user+"  role="+decoded.role);
  req.user = decoded.user;

  var roles = (req.user) ? decoded.role : ['guest'];

  // If an Expence is being processed and the current user created it then allow any manipulation
  if (req.expence && req.user && req.expence.user && req.expence.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
