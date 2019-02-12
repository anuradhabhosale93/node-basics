'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Article Schema
 */
var ArticleSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Article name',
    trim: true
  },
  descript:
  {
    type:String,
    default:'',
    required:'Please fill Description',
    trim:true
  },
  writter:
  {
    type:String,
    required:'Writter is not empty plz fill',
    trim:true
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

mongoose.model('Article', ArticleSchema);
