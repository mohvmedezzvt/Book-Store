const asyncHandler = require('express-async-handler');
const { Book, validateCreateBook, validateUpdateBook } = require('../models/Book');

/**
 * @description Get all books
 * @route       GET /api/books
 * @access      public
 */
const getAllBooks = asyncHandler(
  async (req, res) => {
    const { minPrice, maxPrice } = req.query;
    let books;
    if (minPrice && maxPrice) {
      books = await Book.find({price: {$gte: minPrice, $lte: maxPrice}})
      .populate(
        'author',
        [
          '_id',
          'firstname',
          'secondname'
        ]
      );
      return res.status(200).json(books);
    } else {
      books = await Book.find().populate(
        'author',
        [
          '_id',
          'firstname',
          'secondname'
        ]
      );
      res.status(200).json(books);
    }
  }
);


/**
 * @description Get a single book
 * @route       GET /api/books/:id
 * @access      Public
*/
const getBookById = asyncHandler(
  async (req, res) => {
    const book = await Book.findById(req.params.id).populate('author');

    if (!book) return res.status(404).send('The book with the given ID was not found');
    res.status(200).json(book);
  }
);


/**
 * @description Add a book
 * @route       POST /api/books
 * @access      private - admin
*/
const addBook = asyncHandler(
  async (req, res) => {
    const { error } = validateCreateBook(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    const book = new Book (
      {
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        price: req.body.price,
        cover: req.body.cover,
      }
    );

    const result = await book.save();
    res.status(201).json(result);
  }
);


/**
 * @description Update a book
 * @route       PUT /api/books/:id
 * @access      private - admin
 */
const updateBook = asyncHandler(
  async (req, res) => {
    const { error } = validateUpdateBook(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    const book = await Book.findByIdAndUpdate(req.params.id, {
      $set: {
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        price: req.body.price,
        cover: req.body.cover,
      }
    }, { new: true });

    if (!book) return res.status(404).send('The book with the given ID was not found');
    res.status(200).json(book);
  }
);


/**
 * @description Delete a book
 * @route       DELETE /api/books/:id
 * @access      private - admin
*/
const deleteBook = asyncHandler(
  async (req, res) => {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).send('The book with the given ID was not found');

    res.status(200).json({ message: 'Book deleted successfully' });
  }
);

module.exports = {
  getAllBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook,
}
