'use strict';

/**
 * Module dependencies.
 */

var path = require('path');
var app = require(path.resolve('./config/lib/app'));
const assert=require('chai').assert;
const chai=require('chai');
const nock=require('nock');

app.init(function () {
  console.log('Initialized test automation');
});

describe('App',function(){

  it("it should retrun ",function(){
    assert.equal('demo','demo');
  });
});

describe('GET /api/articles',function(done){
  it('should return a 200 response if the alticale retrive',()=>{
    
    nock('http://localhost:3020')
  .post('/api/articles', { id: '123' })
  .reply(200, { status: 'OK' });


  });

})
