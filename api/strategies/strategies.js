'use strict';

var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/User.js');


var stratergyOptions = {
  usernameField: 'email'
};

var loginStrategy = new LocalStrategy(stratergyOptions, function (email, password, done) {
  var searchUser = { email: email};
  User.findOne(searchUser, function (err, user) {
    if (err) {
      return done(err);
    }

    if (!user) {
      return done(null, false, {
        message: 'Wrong email/password'
      });
    }

    user.comparePasswords(password, function (err, isMatch) {
      if (err) {
        return done(err);
      }

      if (!isMatch) {
        return done(null, false, {
          message: 'Wrong email/password'
        });
      }

      return done(null, user);
    });
  });
});

var registerStrategy = new LocalStrategy(stratergyOptions, function (email, password, done) {

  var searchUser = { email: email};

  User.findOne(searchUser, function (err, user) {
    if (err) {
      return done(err);
    }

    if (user) {
      return done(null, false, {
        message: 'email already exists'
      });
    }

    var newUser = new User({
      email: email,
      password: password,
      jobs: []
    });

    newUser.save(function (err) {
      done(null, newUser);
    });
  });
});


module.exports = {
  loginStrategy: loginStrategy,
  registerStrategy: registerStrategy
};
