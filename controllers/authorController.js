const asyncHandler = require('express-async-handler');
const { Author, validateCreateAuthor, validateUpdateAuthor } = require('../models/Author');

/**
 * @description Get all authors
 * @route       GET /api/authors
 * @access      public
 */
const getAllAuthors = asyncHandler(
  async (req, res) => {
    const { pageNumber } = req.query;
    const perPage = 2;

    const authors = await Author.find()
                                .skip((pageNumber - 1) * perPage)
                                .limit(perPage);
    res.status(200).json(authors);
  }
);

/**
 * @description Get a single author
 * @route       GET /api/authors/:id
 * @access      public
*/
const getAuthorById = asyncHandler(
  async (req, res) => {
    const author = await Author.findById(req.params.id);
    if (!author) return res.status(404).json({ message: "The author with the given ID was not found" });

    res.status(200).json(author);
  }
);

/**
 * @description Add an author
 * @route       POST /api/authors
 * @access      private - admin
 */
const addAuthor = asyncHandler(
  async (req, res) => {
    const { error } = validateCreateAuthor(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    const author = new Author({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      nationality: req.body.nationality,
      image: req.body.image || 'default-image.png',
    });

    const result = await author.save();
    res.status(201).json(result);
  }
);

/**
 * @description Update an author
 * @route       PUT /api/authors/:id
 * @access      private - admin
 */
const updateAuthor = asyncHandler(
  async (req, res) => {
    const { error } = validateUpdateAuthor(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    const author = await Author.findByIdAndUpdate(req.params.id, {
      $set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        nationality: req.body.nationality,
        image: req.body.image,
      },
    },
    { new: true }
    );

    if (!author) return res.status(404).json({ message: "The author with the given ID was not found" });
    res.status(200).json({ message: "Author updated successfully" });
  }
);

/**
 * @description Delete an author
 * @route       DELETE /api/authors/:id
 * @access      private - admin
 */
const deleteAuthor = asyncHandler(
  async (req, res) => {
    const author = await Author.findByIdAndDelete(req.params.id);
    if (!author) return res.status(404).send('The author with the given ID was not found');

    res.status(200).json({ message: "Author deleted successfully" });
  }
);

module.exports = {
  getAllAuthors,
  getAuthorById,
  addAuthor,
  updateAuthor,
  deleteAuthor,
};
