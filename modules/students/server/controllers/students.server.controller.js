'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Student = mongoose.model('Student'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Student
 */
exports.create = async (req, res)=>{
  try{
      var student = new Student(req.body);
      student.user = req.user;
      var data= await student.save();
      res.jsonp(data);
  }
  catch(e){
      res.jsonp(e);
  }

};

/**
 * Show the current Student
 */
exports.read = function(req, res){
  
  var student = req.student ? req.student.toJSON() : {};
  student.isCurrentUserOwner = req.user && student.user && student.user._id.toString() === req.user._id.toString();

  res.jsonp(student);
};

/**
 * Update a Student
 */
exports.update = async (req, res)=>{
   try{
       var student = req.student;
       student = _.extend(student, req.body);
        student.save();
        res.jsonp({message:"updated"});
   }
  catch(e){
      res.jsonp(e);
  }


};

/**
 * Delete an Student*/
 
exports.delete = async (req, res)=>{
  var student = req.student;
  try{
     student.remove();
    res.jsonp({message:'deleted successfully'});
  }
  catch(e){
      res.jsonp(e);
  }
};

/**
 * List of Students*/

exports.list = async (req, res)=>{
  try{
  var data=await Student.find().sort('-created').populate('user', 'displayName').exec();
  res.jsonp(data);   
  }
  catch(e){
      res.jsonp(e);
  }

};
  
/**
 * Student middleware
 */
exports.studentByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Student is invalid'
    });
  }

  Student.findById(id).populate('user', 'displayName').exec(function (err, student) {
    if (err) {
      return next(err);
    } else if (!student) {
      return res.status(404).send({
        message: 'No Student with that identifier has been found'
      });
    }
    req.student = student;
    next();
  });
};
