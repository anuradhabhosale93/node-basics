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
      const student = new Student(req.body);
      student.user = req.user;
      const result= await student.save();
      res.jsonp(result);
  }
  catch(e){
      res.jsonp(e);
  }

};

/**
 * Show the current Student
 */
exports.read = function(req, res){
  
  const student = req.student ? req.student.toJSON() : {};
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
        const result = await student.save();
        res.jsonp(result);
   }
  catch(e){
      res.jsonp(e);
  }
};

/**
 * Delete an Student*/
 
exports.delete = async (req, res)=>{
  try{
     const deletedata = await req.student.remove();
    res.jsonp(deletedata);
  }
  catch(e){
      res.jsonp(e);
  }
};

/**
 * List of Students*/

exports.list = async (req, res)=>{
  try{
    
  const result = await Student.find().exec();
  res.jsonp(result);   
  }
  catch(e){
      res.jsonp(e);
  }

};
  
/**
 * Student middleware
 */
exports.studentByID = async (req, res, next, id) =>{

  try
  {
    if (!mongoose.Types.ObjectId.isValid(id)) 
    {
      return res.status(400).send({
       message: 'Student is invalid'
    });
  }
    req.student= await Student.findById(id).exec();
      next();
  }
  catch(e)
  {
    res.jsonp(e);
  }
};
