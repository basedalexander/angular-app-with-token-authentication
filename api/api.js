var express = require('express');
var bodyParser = require('body-parser');
var headers = require('./middlewares/headers.js');
var mongoose = require('mongoose');
var jwt = require('jwt-simple'); // ('./services/jwt.js');
var createSendToken = require('./services/jwt.js');
var passport = require('passport');
var localStrategy = require('./services/localStrategy');
var moment = require('moment');
var facebookAuth = require('./services/facebookAuth');
var googleAuth = require('./services/googleAuth');
var vkAuth = require('./services/vkAuth');
var jobs = require('./services/jobs');
var emailVerification  = require('./services/emailVerification.js');


var app = express();

app.use(bodyParser.json());
app.use(passport.initialize());
app.use(headers);


passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.use('local-register', localStrategy.register);
passport.use('local-login', localStrategy.login);

app.post('/register', passport.authenticate('local-register'), function (req, res) {
  emailVerification.send(req.user.email);
  createSendToken(req.user, res);
});

app.get('/auth/verifyEmail', emailVerification.handler);

app.post('/login', passport.authenticate('local-login'), function (req, res) {
    createSendToken(req.user, res);
});


app.post('/auth/facebook', facebookAuth);
app.post('/auth/google', googleAuth);
app.post('/auth/vk', vkAuth);

app.get('/jobs', jobs.get);
app.put('/jobs', jobs.put);
app.post('/jobs', jobs.post);

mongoose.connect('mongodb://localhost/psjwt');

var server = app.listen(3000, function () {
  console.log('api listening on ', server.address().port);
});
