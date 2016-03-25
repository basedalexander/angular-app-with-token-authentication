var createSendToken = require('../services/jwt');
var request = require('request');
var User = require('../models/User');

module.exports = function (req, res) {

  console.log('express: got post /auth/google ');

  var url = 'https://www.googleapis.com/oauth2/v4/token';
  var apiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';

  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: config.GOOGLE_SECRET,
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
};
