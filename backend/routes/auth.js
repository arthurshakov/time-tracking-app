const express = require('express');
const { register, login } = require('../controllers/user');
const mapUser = require('../helpers/mapUser');
const getAuthenticationData = require('../helpers/getAuthenticationData');

const router = express.Router({mergeParams: true});

// Authenticate
router.post('/authenticate', async (req, res) => {
  try {
    // check if user is already authenticated
    const authenticatedUser = await getAuthenticationData(req, res);

    res.send({
      error: null,
      user: authenticatedUser ? mapUser(authenticatedUser) : null,
    });
  } catch(error) {
    res.send({
      error: error.message || "Unknown error",
      user: null,
    });
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    const {user, token} = await register(req.body.login, req.body.password);

    res.cookie('token', token, {httpOnly: true})
      .send({
        error: null,
        user: mapUser(user),
      });
  } catch(error) {
    let errorMessage = error.message || "Unknown error";

    if (error.code === 11000) {
      errorMessage = `Login "${req.body.login}" already exists`;
    }

    res.send({
      error: errorMessage,
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const {user, token} = await login(req.body.login, req.body.password);

    res.cookie('token', token, {httpOnly: true})
      .send({
        error: null,
        user: mapUser(user),
      });
  } catch(error) {
    res.send({
      error: error.message || "Unknown error",
    });
  }
});

// Logout
router.post('/logout', async (req, res) => {
  res.cookie('token', '', {httpOnly: true})
    .send({});
});

module.exports = router;
