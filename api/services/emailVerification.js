var config = require('./config');
var jwt = require('jwt-simple');
var _ = require('underscore');
var fs = require('fs');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var User = require('../models/User');

var model = {
  verifyUrl: 'http://localhost:3000/auth/verifyEmail?token=',
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

  function getHtml (token) {
    var template;
    var path = './views/emailVerification.html';
    var html = fs.readFile(path, 'utf8', function (err, data) {
      if (err ) throw new Error(err.message);

      template = _.template(data);

      model.verifyUrl += token;

       sendEmail(email, template(model));
    });
  }

  function sendEmail (email, template) {
    var transporter = nodemailer.createTransport(smtpTransport({
      host: 'smtp.yandex.ru',
      secure: true,
      auth: {
        user: 'store@aquariatica.ru',
        pass: config.SMTP_PASSWORD
      }
    }));

    var mailOptions = {
      from: '<store@aquariatica.ru>',
      to: email,
      subject: 'psJwt Account verification',
      html: template
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) return console.log('send error ', err);

      console.log('email sent ', info.response);
    });
  }

};

exports.handler = function (req, res) {
  var token = req.query.token;

  var payload = jwt.decode(token, config.EMAIL_SECRET);

  var email = payload.sub;

  if (!email) return handleError(res);

  User.findOne({ email: email}, function (err, foundUser) {
    if (err) return res.status(500);

    if (!foundUser) return handleError(res);

    if (!foundUser.active) { foundUser.active = true; }

    foundUser.save(function (err, result) {
      if (err) { return res.status(500); }

      return res.redirect(config.APP_URL);
    });
  });
};


function handleError(res) {
  return res.status(401).send({
    message: 'Authentication failed, unable to verify email'
  });
}

_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g
};
