'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Article = mongoose.model('Article'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

var jwt=require('jsonwebtoken'); 
var bparser=require('body-parser');
var ex=require('express');
/**
 * Create a Article
 */
exports.create = function(req, res) {


  //req.body.writter=req.user._id;

  var article = new Article(req.body);
  article.user = req.user;
  article.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(article);
    }
  });
};

/**
 * Show the current Article
 */
exports.read = function(req, res) 
{
  // convert mongoose document to JSON
  var article = req.article ? req.article.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  article.isCurrentUserOwner = req.user && article.user && article.user._id.toString() === req.user._id.toString();

  res.jsonp(article);
};

/**
 * Update a Article
 */
exports.update = function(req, res) 
{

 // req.body.writter=req.user._id;
  var article = req.article;
  article = _.extend(article, req.body);

  article.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(article);
    }
  });
};

/**
 * Delete an Article
 */
exports.delete = function(req, res) {
  var article = req.article;

  article.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(article);
    }
  });
};

/**
 * List of Articles
 */
exports.list = function(req, res) 
{
  /*var token=jwt.sign({name:req.user},"abc");

  jwt.verify(token,"xyz",function(err,decoded)
  {
    if(err) console.log("Not Verified");
    else
    {
      var decoded=jwt.decode(token,{complete:true});

      console.log(decoded.header);
      console.log(decoded.payload);
    }
    
  });*/

 // console.log("decoded url="+JSON.parse(JSON.stringify(decoded)));

  Article.aggregate([{$lookup:{from:'students',localField:'-id',foreignField:'_id',as:'List'}}]).exec(function(err,articles)
  {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(articles);
    }
  });


/*
  Article.find().sort('-created').populate('user', 'displayName').exec(function(err, articles) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(articles);
    }
  });
*/
  
/** List of articles display asscending order by name */
/*
  Article.find().sort({name:1}).populate('user', 'displayName').exec(function(err, articles) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(articles);
    }
  });
  */

  /** List of articles display Specific data 

  Article.find().select({'name':1,'descript':1}).sort({name:1}).populate('user', 'displayName').exec(function(err, articles) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(articles);
    }
  });
*/

//searching by id

/*
Article.findOne({_id:req.body._id}).populate('user', 'displayName').exec(function(err, articles) {
  if (err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  } else {
    res.jsonp(articles);
  }
});
*/

//Searching by name

  /*
  console.log(req.body.name);
  Article.findOne({name:req.query.name}).populate('user', 'displayName').exec(function(err, articles)
   {
     console.log("params="+req.params.name);

    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(articles);
    }
  });
  */
  
};

////jwt apis

exports.jtoken = function(req, res) 
{

  var token=jwt.sign({name:req.user._id,role:req.user.roles},"abc");

        res.jsonp(token);

};


/* my own creation  

exports.countRecords=function(req,res)
{
    Article.aggregate([{$count:"passing_score"}]).exec(function(err,article)
    {
        
    });
};
*/
  
/**
 * Article middleware
 */
exports.articleByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Article is invalid'
    });
  }

  Article.findById(id).populate('user', 'displayName').exec(function (err, article) 
  {
    if (err) {
      return next(err);
    } else if (!article) {
      return res.status(404).send({
        message: 'No Article with that identifier has been found'
      });
    }
    req.article = article;
    next();
  });
};
