var config = require('./config');
var jwt = require('jwt-simple');
var _ = require('underscore');
var fs = require('fs');

var model = {
  verifyUrl: 'http://localhost:9000/auth/verifyEmail?token=',
  title: 'psJwt',
  subTitle: 'Thanks for signing up!',
  body: 'Please verify your email adress by clicking the button below'
};

exports.send = function (email) {
  var payload = {
    sub: email
  };

  var token = jwt.encode(payload, config.EMAIL_SECRET);

  getHtml(token);
};


function getHtml (token) {
  var template;
  var path = './views/emailVerification.html';
  var html = fs.readFile(path, 'utf8', function (err, data) {
    if (err ) throw new Error(err.message);

    template = _.template(data);

    model.verifyUrl += token;

    var templated = template(model);
    console.log(templated);

    return templated;
  });
}

_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g
};
