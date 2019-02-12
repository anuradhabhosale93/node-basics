'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Student Schema
 */
var StudentSchema = new Schema({
  fname: {
    type: String,
    default: '',
    required: 'Please fill Student first name',
    trim: true
  },
  lname:{
    type:String,
    default:'',
    required:'Please fill Student last name',
    trim:true
  },
  mobile:{
    type:Number
  },
  sclass:
  {
    type:String,
    default:'',
    required:'Please fill student class',
    trim:true
  },
  marks:
  {
    type:Number
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

mongoose.model('Student', StudentSchema);
