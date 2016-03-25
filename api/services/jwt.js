var jwt = require('jwt-simple');
var moment = require('moment');
var config = require('./config');

module.exports = function (user, res) {
  var payload = {
    sub: user.id,
    exp: moment().add(10, 'days').unix()
  };

  var token = jwt.encode(payload, config.JWT_SECRET);

  res.status(200).send({
    user: user.toJSON(),
    token: token
  });
};
