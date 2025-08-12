const express = require('express')
const { updatePassword } = require('../controllers/user')
const authenticated = require('../middlewares/authenticated')
// const hasRole = require('../middlewares/hasRole')
// const mapUser = require('../helpers/mapUser')
// const ROLES = require('../constants/roles')

const router = express.Router({ mergeParams: true })

// Update password
router.post('/:userId/update-password', authenticated, async (req, res) => {
  try {
    const result = await updatePassword(req.params.userId, req.body.password);

    res.send({
      error: null,
      ...result,
    });
  } catch(error) {
    res.status(500).send({
      error: error.message || 'Failed to update password',
    });
  }
})

// router.get('/', authenticated, hasRole([ROLES.ADMIN]), async (req, res) => {
//   const users = await getUsers();

//   res.send({ data: users.map(mapUser) })
// })

// router.get('/roles', authenticated, hasRole([ROLES.ADMIN]), async (req, res) => {
//   const roles = getRoles();

//   res.send({ data: roles })
// })

// router.patch('/:id', authenticated, hasRole([ROLES.ADMIN]), async (req, res) => {
//   const newUser = await updateUser(req.params.id, {
//     role: req.body.roleId
//   })

//   res.send({ data: mapUser(newUser) })
// })

// router.delete('/:id', authenticated, hasRole([ROLES.ADMIN]), async (req, res) => {
//   await deleteUser(req.params.id)

//   res.send({ error: null })
// })

module.exports = router
