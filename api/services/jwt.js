exports.encode = function (payload, secret) {
  algorithm = 'HS256';

  var header = {
    typ: 'JWT',
    alg: algorithm
  };
};

function base64Encode (str) {
  return new Buffer(str).toString('base64');
}
