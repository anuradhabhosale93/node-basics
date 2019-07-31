'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Expence = mongoose.model('Expence'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  expence;

/**
 * Expence routes tests
 */
describe('Expence CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Expence
    user.save(function () {
      expence = {
        name: 'Expence name'
      };

      done();
    });
  });

  it('should be able to save a Expence if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Expence
        agent.post('/api/expences')
          .send(expence)
          .expect(200)
          .end(function (expenceSaveErr, expenceSaveRes) {
            // Handle Expence save error
            if (expenceSaveErr) {
              return done(expenceSaveErr);
            }

            // Get a list of Expences
            agent.get('/api/expences')
              .end(function (expencesGetErr, expencesGetRes) {
                // Handle Expences save error
                if (expencesGetErr) {
                  return done(expencesGetErr);
                }

                // Get Expences list
                var expences = expencesGetRes.body;

                // Set assertions
                (expences[0].user._id).should.equal(userId);
                (expences[0].name).should.match('Expence name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Expence if not logged in', function (done) {
    agent.post('/api/expences')
      .send(expence)
      .expect(403)
      .end(function (expenceSaveErr, expenceSaveRes) {
        // Call the assertion callback
        done(expenceSaveErr);
      });
  });

  it('should not be able to save an Expence if no name is provided', function (done) {
    // Invalidate name field
    expence.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Expence
        agent.post('/api/expences')
          .send(expence)
          .expect(400)
          .end(function (expenceSaveErr, expenceSaveRes) {
            // Set message assertion
            (expenceSaveRes.body.message).should.match('Please fill Expence name');

            // Handle Expence save error
            done(expenceSaveErr);
          });
      });
  });

  it('should be able to update an Expence if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Expence
        agent.post('/api/expences')
          .send(expence)
          .expect(200)
          .end(function (expenceSaveErr, expenceSaveRes) {
            // Handle Expence save error
            if (expenceSaveErr) {
              return done(expenceSaveErr);
            }

            // Update Expence name
            expence.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Expence
            agent.put('/api/expences/' + expenceSaveRes.body._id)
              .send(expence)
              .expect(200)
              .end(function (expenceUpdateErr, expenceUpdateRes) {
                // Handle Expence update error
                if (expenceUpdateErr) {
                  return done(expenceUpdateErr);
                }

                // Set assertions
                (expenceUpdateRes.body._id).should.equal(expenceSaveRes.body._id);
                (expenceUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Expences if not signed in', function (done) {
    // Create new Expence model instance
    var expenceObj = new Expence(expence);

    // Save the expence
    expenceObj.save(function () {
      // Request Expences
      request(app).get('/api/expences')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Expence if not signed in', function (done) {
    // Create new Expence model instance
    var expenceObj = new Expence(expence);

    // Save the Expence
    expenceObj.save(function () {
      request(app).get('/api/expences/' + expenceObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', expence.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Expence with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/expences/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Expence is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Expence which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Expence
    request(app).get('/api/expences/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Expence with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Expence if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Expence
        agent.post('/api/expences')
          .send(expence)
          .expect(200)
          .end(function (expenceSaveErr, expenceSaveRes) {
            // Handle Expence save error
            if (expenceSaveErr) {
              return done(expenceSaveErr);
            }

            // Delete an existing Expence
            agent.delete('/api/expences/' + expenceSaveRes.body._id)
              .send(expence)
              .expect(200)
              .end(function (expenceDeleteErr, expenceDeleteRes) {
                // Handle expence error error
                if (expenceDeleteErr) {
                  return done(expenceDeleteErr);
                }

                // Set assertions
                (expenceDeleteRes.body._id).should.equal(expenceSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Expence if not signed in', function (done) {
    // Set Expence user
    expence.user = user;

    // Create new Expence model instance
    var expenceObj = new Expence(expence);

    // Save the Expence
    expenceObj.save(function () {
      // Try deleting Expence
      request(app).delete('/api/expences/' + expenceObj._id)
        .expect(403)
        .end(function (expenceDeleteErr, expenceDeleteRes) {
          // Set message assertion
          (expenceDeleteRes.body.message).should.match('User is not authorized');

          // Handle Expence error error
          done(expenceDeleteErr);
        });

    });
  });

  it('should be able to get a single Expence that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Expence
          agent.post('/api/expences')
            .send(expence)
            .expect(200)
            .end(function (expenceSaveErr, expenceSaveRes) {
              // Handle Expence save error
              if (expenceSaveErr) {
                return done(expenceSaveErr);
              }

              // Set assertions on new Expence
              (expenceSaveRes.body.name).should.equal(expence.name);
              should.exist(expenceSaveRes.body.user);
              should.equal(expenceSaveRes.body.user._id, orphanId);

              // force the Expence to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Expence
                    agent.get('/api/expences/' + expenceSaveRes.body._id)
                      .expect(200)
                      .end(function (expenceInfoErr, expenceInfoRes) {
                        // Handle Expence error
                        if (expenceInfoErr) {
                          return done(expenceInfoErr);
                        }

                        // Set assertions
                        (expenceInfoRes.body._id).should.equal(expenceSaveRes.body._id);
                        (expenceInfoRes.body.name).should.equal(expence.name);
                        should.equal(expenceInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Expence.remove().exec(done);
    });
  });
});
