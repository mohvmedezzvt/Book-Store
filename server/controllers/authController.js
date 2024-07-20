const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const {
  User,
  validateRegister,
  validateLogin,
} = require('../models/User');

/**
 * @description Register a new user
 * @route   POST /api/auth/register
 * @access  public
 */
const register = asyncHandler(
  async (req, res) => {
    const { error } = validateRegister(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).json({ message: 'User already registered.'});

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    user = new User({
      email: req.body.email,
      username: req.body.username,
      password: hashedPassword,
    });

    const result = await user.save();
    const token = user.generateAuthToken();

    // eslint-disable-next-line no-unused-vars
    const { password, ...data } = result._doc;

    res.status(201).json({ ...data, token });
  }
);

/**
 * @description Login a user
 * @route   POST /api/auth/login
 * @access  public
 */
const login = asyncHandler(
  async (req, res) => {
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password.'});

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).json({ message: 'Invalid email or password.'});

    const token = user.generateAuthToken();

    // eslint-disable-next-line no-unused-vars
    const { password, ...data } = user._doc;

    res.status(201).json({ ...data, token });
  }
)

module.exports = {
  register,
  login,
};
