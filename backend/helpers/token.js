const jwt = require('jsonwebtoken');
const key = process.env.JWT_SECRET;

module.exports = {
  generate(data) {
    return jwt.sign(data, key, {expiresIn: '30d'});
  },
  verify(token) {
    return jwt.verify(token, key);
  }
}
