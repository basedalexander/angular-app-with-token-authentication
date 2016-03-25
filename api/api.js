var express = require('express');
var bodyParser = require('body-parser');
var headers = require('./middlewares/headers.js');
var mongoose = require('mongoose');
var User = require('./models/User.js');
var jwt = require('jwt-simple'); // ('./services/jwt.js');
var passport = require('passport');
var strategies = require('./strategies/strategies.js');
var request = require('request');
var moment = require('moment');

var app = express();

app.use(bodyParser.json());
app.use(passport.initialize());
app.use(headers);


passport.serializeUser(function (user, done) {
  done(null, user.id);
});

function createSendToken (user, res) {
  var payload = {
    sub: user.id,
    exp: moment().add(10, 'days').unix()
  };

  var token = jwt.encode(payload, 'shhh...');

  res.status(200).send({
    user: user.toJSON(),
    token: token
  });
}


passport.use('local-register', strategies.registerStrategy);
passport.use('local-login', strategies.loginStrategy);


app.post('/register', passport.authenticate('local-register'), function (req, res) {
  createSendToken(req.user, res);
});

app.post('/login', passport.authenticate('local-login'), function (req, res) {
    createSendToken(req.user, res);
});


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

  console.log('express: got post /auth/google ');

  var url = 'https://www.googleapis.com/oauth2/v4/token';
  var apiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';

  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: 'NHNQGIsKH0ir7mDqi-vUD7gQ',
    redirect_uri: req.body.redirectUri,
    grant_type: 'authorization_code'
  };

  request.post(url, {
    json: true,
    form: params
  }, function (err, response, token) {
    var accessToken = token.access_token;
    var headers = {
      Authorization: 'Bearer ' + accessToken
    };

    request.get({
      url: apiUrl,
      headers: headers,
      json: true
    }, function (err, response, profile) {
      User.findOne({ googleId: profile.sub}, function (err, foundUser) {
        if (foundUser) {
          return createSendToken(foundUser, res);
        }

        var newUser = new User();
        newUser.googleId = profile.sub;
        newUser.displayName = profile.name;
        newUser.save(function (err) {
          if (err) {
            return next(err);
          }

          createSendToken(newUser, res);
        })
      });
    });
  });
});

app.post('/auth/vk', function (req, res) {
  var url = 'https://oauth.vk.com/access_token?';
  var apiUrl = 'https://api.vk.com/method/';

  console.log('express: got post /auth/vk ');

  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: 'gf11EQUehgJzzXB5AvrD',
    redirect_uri: req.body.redirectUrl
  };

  request.post(url, {
    form: params,
    json: true
  }, function (err, response, profile) {
    if (err) {
      console.error(err);
    }

    var accessToken = profile.access_token;
    var user_id = profile.user_id;

    request.get({
      url: apiUrl + 'users.get?' + 'user_ids=' + profile.user_id,
      json: true
    }, function (err, response, accountInfo) {
      if (err) {
        console.error(err);
      }

      User.findOne({ vkId: user_id }, function (err, foundUser) {
        if (foundUser) {
          return createSendToken(foundUser, res);
        }

        var newUser = new User();
        newUser.vkId = user_id;
        newUser.displayName = accountInfo.response[0].first_name;

        newUser.save(function (err) {
          if (err) {
            return next(err);
          }
          createSendToken(newUser, res);
        });

      });
    });
  });

});

mongoose.connect('mongodb://localhost/psjwt');

var server = app.listen(3000, function () {
  console.log('api listening on ', server.address().port);
});
