'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Expence Schema
 */
var ExpenceSchema = new Schema({
  desc: {
    type: String,
    default: '',
    required: 'Please fill Expence name',
    trim: true
  },
  amt: {
    type: Number,
    required: 'Please fill Expence amount',
    trim: true
  },
  expdate: {
    type: Date,
    trim: true
  },
  note: {
    type: String,
  },
  editing: {
    type:Boolean,
    default:false,
    trim:true,
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

mongoose.model('Expence', ExpenceSchema);
