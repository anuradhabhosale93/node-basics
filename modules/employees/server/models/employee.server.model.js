'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Employee Schema
 */
var EmployeeSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Employee name',
    trim: true
  },
  empid:{
    type:Number,
    required:'Please fill Employee id',
    trim:true
  },
  deptid:
  {
    type:Number,
    default:101,
    trim:true
  },
  salary:
  {
    type:Number,
    default:'',
    trim:true,
    required:'Please fill salary'
  },

  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Employee', EmployeeSchema);
