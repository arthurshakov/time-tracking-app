const bcrypt = require('bcrypt');
const User = require('../models/User');
const tokenHelper = require('../helpers/token');
const roles = require('../constants/roles');

// registration
async function register(login, password) {
  if (!password) {
    throw new Error('Password is empty');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    login, password: passwordHash,
  })

  const token = tokenHelper.generate({id: user.id});

  return {user, token};
}

// login
async function login(login, password) {
  const user  = await User.findOne({login});

  if (!user) {
    throw new Error('User not found');
  }

  const passwordIsCorrect = await bcrypt.compare(password, user.password);

  if (!passwordIsCorrect) {
    throw new Error('Password isWrong password');
  }

  const token = tokenHelper.generate({id: user.id});

  return {user, token};
}

// get users
async function getUsers() {
  return User.find();
}

// get roles
function getRoles() {
  return [
    {id: roles.ADMIN, name: 'Admin'},
    {id: roles.MODERATOR, name: 'Moderator'},
    {id: roles.USER, name: 'User'},
  ];
}

// delete
async function deleteUser(id) {
  return User.deleteOne({_id: id});
}

// update (roles)
async function updateUser(id, userData) {
  return User.findByIdAndUpdate(id, userData, {returnDocument: 'after'});
}

module.exports = {
  register,
  login,
  getUsers,
  getRoles,
  deleteUser,
  updateUser,
};
