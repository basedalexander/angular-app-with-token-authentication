var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var User = require('./models/User.js');
//var jwt = require('./services/jwt.js');
var jwt = require('jwt-simple');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy ;
var request = require('request');

var app = express();

app.use(bodyParser.json());
app.use(passport.initialize());


passport.serializeUser(function (user, done) {
  done(null, user.id);
});


app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  next();
});

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

passport.use('local-register', registerStrategy);
passport.use('local-login', loginStrategy);


app.post('/register', passport.authenticate('local-register'), function (req, res) {
  createSendToken(req.user, res);
});

app.post('/login', passport.authenticate('local-login'), function (req, res) {
    createSendToken(req.user, res);
});

function createSendToken (user, res) {
  var payload = {
    sub: user.id
  };

  var token = jwt.encode(payload, 'shhh...');

  res.status(200).send({
    user: user.toJSON(),
    token: token
  });

}


app.get('/jobs', function (req, res) {
  var jobs;
  if (!req.headers.authorization) {
    return res.status(401).send({ message: 'You are not authorized'});
  }

  var token = req.headers.authorization.split(' ')[1];
  var payload = jwt.decode(token, 'shhh...');

  if (!payload.sub) {
    res.status(401).send({ message: 'Authentication failed'});
  }

  User.findOne({"_id": payload.sub}, function (err, user) {
    if (err) {
      return res.status(401).send(err);
    }
    if (!user) {
      return res.status(401).send('User not found');
    }
    res.json(user.jobs);
  });

});



app.put('/jobs', function (req, res) {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: 'You are not authorized'});
  }
  var token = req.headers.authorization.split(' ')[1];
  var payload = jwt.decode(token, 'shhh...');

  if (!payload.sub) {
    return res.status(401).send({ message: 'Authentication failed'});
  }

  User.findByIdAndUpdate(payload.sub, { $pull : { jobs: req.body }}, {new: true}, function (err, user) {
    if (err) {
      return res.status(401).send(err);
    }
    if (!user) {
      return res.status(401).send('User not found');
    }
    res.json(user.jobs);
  });
});

app.post('/jobs', function (req, res) {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: 'You are not authorized'});
  }
  var token = req.headers.authorization.split(' ')[1];
  var payload = jwt.decode(token, 'shhh...');

  if (!payload.sub) {
    return res.status(401).send({ message: 'Authentication failed'});
  }

  User.findByIdAndUpdate(payload.sub, { $addToSet : { jobs: req.body }}, {new: true}, function (err, user) {
    if (err) {
      return res.status(401).send(err);
    }
    if (!user) {
      return res.status(401).send('User not found');
    }
    res.json(user.jobs);
  });
});

app.post('/auth/google', function (req, res) {

  var url = 'https://www.googleapis.com/oauth2/v4/token';

  var params = {
    client_id: req.body.clientId,
    redirect_uri: req.body.redirectUri,
    code: req.body.code,
    grant_type: 'authorization_code',
    client_secret: 'NHNQGIsKH0ir7mDqi-vUD7gQ'
  };

  request.post(url, {
    json: true,
    form: params
  }, function (err, response, token) {
    console.log(token);
  });
});

mongoose.connect('mongodb://localhost/psjwt');

var server = app.listen(3000, function () {
  console.log('api listening on ', server.address().port);
});
