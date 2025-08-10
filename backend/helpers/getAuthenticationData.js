const User = require('../models/User');
const { verify } = require("../helpers/token");

module.exports = async function (req, res) {
  // Check if token exists
  if (!req.cookies.token) {
    return null;
  }

  try {
    // Verify token
    const tokenData = verify(req.cookies.token);
    if (!tokenData?.id) {
      return null;
    }

    // Check if user exists
    const user = await User.findOne({ _id: tokenData.id });
    if (user) {
      return user;
    }

    // If we get here, token was valid but user not found
    res.clearCookie('token'); // Clean up invalid token
    return null;
  } catch (error) {
    // Token verification failed
    res.clearCookie('token');
    return null;
  }
};
