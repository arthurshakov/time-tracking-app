const User = require('../models/User');
const { verify } = require("../helpers/token");

module.exports = async function (req, res, next) {
  try {
    // Check if token exists
    if (!req.cookies.token) {
      return next(); // No token, proceed to login/register page
    }

    // Verify token
    const tokenData = verify(req.cookies.token);
    if (!tokenData?.id) {
      return next(); // Invalid token, proceed to login/register page
    }

    // Check if user exists
    const user = await User.findOne({ _id: tokenData.id });
    if (user) {
      return res.redirect('/'); // Authenticated user - redirect away from login/register
    }

    // If we get here, token was valid but user not found
    res.clearCookie('token'); // Clean up invalid token
    next();
  } catch (error) {
    // Token verification failed
    res.clearCookie('token'); // Clean up invalid token
    next();
  }
};
