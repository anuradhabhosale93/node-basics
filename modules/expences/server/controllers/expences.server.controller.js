'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Expence = mongoose.model('Expence'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Expence
 */
exports.create = async (req, res)=>{
  try
  {
    let expence = new Expence(req.body);
    expence.user = req.user;
    expence.expdate = new Date(req.body.expdate);
    console.log("user="+expence.user+"  id="+req.user);
    console.log(req.body);
    const result= await expence.save();

    res.jsonp(result);

  }
  catch(e)
  {
   res.jsonp(e);
  }
  
};

/**
 * Show the current Expence
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var expence = req.expence ? req.expence.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  expence.isCurrentUserOwner = req.user && expence.user && expence.user.toString() === req.user.toString();

  res.jsonp(expence);
};

/**
 * Update a Expence
 */
exports.update = async (req, res) =>{
  var expence = req.expence;
  expence.expdate = new Date(req.body.expdate);
  expence = _.extend(expence, req.body);

  const result = await expence.save();
  res.jsonp("Updated");
};

/**
 * Delete an Expence
 */
exports.delete = async (req, res) =>{
  var expence = req.expence;

  const result=await expence.remove();
  res.jsonp("Deleted");
};

/**
 * List of Expences
 */
exports.list = function(req, res) {
  Expence.find({user:req.user}).exec(function(err, expences) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(expences);
    }
  });
};

/**
 * Expence middleware
 */
exports.expenceByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Expence is invalid'
    });
  }

  Expence.findById(id).populate('user', 'displayName').exec(function (err, expence) {
    if (err) {
      return next(err);
    } else if (!expence) {
      return res.status(404).send({
        message: 'No Expence with that identifier has been found'
      });
    }
    req.expence = expence;
    next();
  });
};


