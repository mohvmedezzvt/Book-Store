const express = require('express');
const router = express.Router();
const { verifyTokenAndAdmin } = require('../middlewares/verifyToken');
const {
  getAllBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook
} = require('../controllers/bookController');

// /api/books
router.route('/')
      .get(getAllBooks)
      .post(verifyTokenAndAdmin, addBook);

// /api/books/:id
router.route('/:id')
      .get(getBookById)
      .put(verifyTokenAndAdmin, updateBook)
      .delete(verifyTokenAndAdmin, deleteBook);

module.exports = router;
