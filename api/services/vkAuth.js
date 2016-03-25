var createSendToken = require('../services/jwt');
var request = require('request');
var User = require('../models/User');

module.exports = function (req, res) {
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

};
