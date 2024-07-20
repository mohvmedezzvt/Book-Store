const mongoose = require('mongoose');
const Joi = require('joi');

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 250,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    min: 5,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  cover: {
    type: String,
    default: 'soft cover',
  },
} , { timestamps: true });

const Book = mongoose.model('Book', BookSchema);

function validateCreateBook(book) {
  const schema =  Joi.object({
    title: Joi.string().trim().min(3).max(250).required(),
    author: Joi.string().required(),
    description: Joi.string().trim().min(5).required(),
    price: Joi.number().min(0).required(),
    cover: Joi.string().required(),
  });

  return schema.validate(book);
};

function validateUpdateBook(book) {
  const schema =  Joi.object({
    title: Joi.string().trim().min(3).max(250),
    author: Joi.string(),
    description: Joi.string().trim().min(5),
    price: Joi.number().min(0),
    cover: Joi.string(),
  });

  return schema.validate(book);
};

module.exports = {
  Book,
  validateCreateBook,
  validateUpdateBook,
};