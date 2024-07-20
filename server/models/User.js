const mongoose = require('mongoose');
const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 5,
    maxlength: 100,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 2,
    maxlength: 200,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 1024,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

// Generate an auth token
userSchema.methods.generateAuthToken = function () {
  // eslint-disable-next-line no-undef
  return jwt.sign({ id: this._id, isAdmin: this.isAdmin }, process.env.JWT_SECRET);
};

const User = mongoose.model('User', userSchema);

function validateRegister(user) {
  const schema = Joi.object({
    email: Joi.string().trim().min(5).max(100).required().email(),
    username: Joi.string().trim().min(2).max(200).required(),
    password: passwordComplexity().required(),
  });

  return schema.validate(user);
}

function validateLogin(user) {
  const schema = Joi.object({
    email: Joi.string().trim().min(5).max(100).required().email(),
    password: Joi.string().trim().min(6).max(1024).required(),
  });

  return schema.validate(user);
}

function validateChangePassword(user) {
  const schema = Joi.object({
    password: Joi.string().trim().min(6).max(1024).required(),
  });

  return schema.validate(user);
}

function validateUpdate(user) {
  const schema = Joi.object({
    email: Joi.string().trim().min(5).max(100).email(),
    username: Joi.string().trim().min(2).max(200),
    password: Joi.string().trim().min(6).max(1024),
  });

  return schema.validate(user);
}

module.exports = {
  User,
  validateRegister,
  validateLogin,
  validateChangePassword,
  validateUpdate,
};
