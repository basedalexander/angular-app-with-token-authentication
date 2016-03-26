var config = require('./config');
var jwt = require('jwt-simple');
var _ = require('underscore');
var fs = require('fs');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

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
        pass: 'darkdog2001puppy'
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






_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g
};
