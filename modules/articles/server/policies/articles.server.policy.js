'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');
var jwt=require('jsonwebtoken');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Articles Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/articles',
      permissions: '*'
    }, {
      resources: '/api/articles/:articleId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/articles',
      permissions: ['get', 'post']
    }, {
      resources: '/api/articles/:articleId',
      permissions: ['get']
    }]
  },
  {
    roles: ['user'],
    allows: [{
      resources: '/api/jwt',
      permissions: ['post']
    }]
  } ,
  {
    roles: ['guest'],
    allows: [{
      resources: '/api/articles',
      permissions: ['get']
    }, {
      resources: '/api/articles/:articleId',
      permissions: ['get']
    }]
  }]);
};
/**
 * Check If Articles Policy Allows
 */
exports.isAllowed = function (req, res, next) 
{
  var duser,drole;
    jwt.verify(req.query.token,"abc",function(err,decoded)
    {
      if(err)
      {
        return res.status(404).send({
          message: 'Invalid'});
      }
      else
      {
        var decoded=jwt.decode(req.query.token,{complete:true});
        console.log("user="+decoded.payload.user+"  role="+decoded.payload.role);
        duser=decoded.payload.user;
        drole=decoded.payload.role;
          return next();
      }
      
    });
    //verify role of the user

    var role=duser ? drole :['guest'];


      acl.areAnyRolesAllowed(role,req.route.path,req.method.toLowerCase(),function(err,isAllowed)
      {
          if(err)
          {
            return res.status(500).send('Unexpected authorization error');
          }
          else{
            if(isAllowed)
            {
              return next();
            }
            else{
              return res.status(403).json({
                message: 'User is not authorized'
              });
            }
          }
      });



/*

  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Article is being processed and the current user created it then allow any manipulation
  if (req.article && req.user && req.article.user && req.article.user.id === req.user.id) {
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
  */
};
