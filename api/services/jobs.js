var jwt = require('jwt-simple');
var User = require('../models/User');


exports.get = function (req, res) {
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

};

exports.put = function (req, res) {
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
};

exports.post = function (req, res) {
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
};
