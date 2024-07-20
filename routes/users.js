const express = require('express');
const router = express.Router();
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('../middlewares/verifyToken');
const { getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');

// /api/users
router.get('/', verifyTokenAndAdmin, getAllUsers);

// /api/users/:id
router.route('/:id')
      .get(verifyTokenAndAuthorization, getUserById)
      .put(verifyTokenAndAuthorization, updateUser)
      .delete(verifyTokenAndAuthorization, deleteUser);

module.exports = router;
