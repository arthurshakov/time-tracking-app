const mongoose = require('mongoose');
const roles = require('../constants/roles');

const userSchema = mongoose.Schema({
  login: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: Number,
    default: roles.USER,
  },
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

module.exports = User;
