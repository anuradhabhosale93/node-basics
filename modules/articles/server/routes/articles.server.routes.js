'use strict';

/**
 * Module dependencies
 */
var articlesPolicy = require('../policies/articles.server.policy'),
  articles = require('../controllers/articles.server.controller');

module.exports = function(app)
 {
  // Articles Routes
  app.route('/api/articles').all(articlesPolicy.isAllowed)
  //app.route('/api/articles')
    .get(articles.list)
    .post(articles.create);

  app.route('/api/articles/:articleId').all(articlesPolicy.isAllowed)
  //app.route('/api/articles/:articleId')
    .get(articles.read)
    .put(articles.update)
    .delete(articles.delete);


   // 11/02/2019

   app.route('/api/jwt')
   .post(articles.jtoken);


  // Finish by binding the Article middleware
  app.param('articleId', articles.articleByID);


};
