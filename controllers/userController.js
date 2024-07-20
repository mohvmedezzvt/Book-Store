const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const { User, validateUpdate } = require('../models/User');

/**
 * @description Get All users
 * @route       GET /api/users
 * @access      private - admin
 */
const getAllUsers = asyncHandler(
  async (req, res) => {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  }
);

/**
 * @description Get user by id
 * @route       GET /api/users/:id
 * @access      private - admin & user himself
*/
const getUserById = asyncHandler(
  async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  }
);

/**
 * @description Update a user
 * @route       PUT /api/users/:id
 * @access      private
 */
const updateUser = asyncHandler(
  async (req, res) => {

    const { error } = validateUpdate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          email: req.body.email,
          username: req.body.username,
          password: req.body.password,
        }
      }, { new: true }
    ).select('-password');

    res.status(200).json(user);
  }
);

/**
 * @description Delete a user
 * @route       DELETE /api/users/:id
 * @access      private - admin & user himself
 */
const deleteUser = asyncHandler(
  async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User has been deleted' });
  }
);

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
