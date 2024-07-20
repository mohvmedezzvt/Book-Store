/* eslint-disable no-undef */
const { Book } = require('./models/Book');
const { Author } = require('./models/Author');
const { books, authors } = require('./data');
const connectToDatabase = require('./config/db');
require('dotenv').config();

// Connect to the database
connectToDatabase();

// Seed the database books
const seedDatabaseBooks = async () => {
  try {
    await Book.insertMany(books);
    console.log('Database seeded books successfully...');
  } catch (error) {
    console.error('Error seeding database books...');
    process.exit(1);
  }

  process.exit(0);
};

// Seed the database authors
const seedDatabaseAuthors = async () => {
  try {
    await Author.insertMany(authors);
    console.log('Database seeded authors successfully...');
  } catch (error) {
    console.error('Error seeding database authors...', error);
    process.exit(1);
  }

  process.exit(0);
};

// Delete books from the database
const deleteBooks = async () => {
  try {
    await Book.deleteMany();
    console.log('Books deleted successfully...');
  } catch (error) {
    console.error('Error deleting books...');
    process.exit(1);
  }

  process.exit(0);
};

// Delete authors from the database
const deleteAuthors = async () => {
  try {
    await Author.deleteMany();
    console.log('Authors deleted successfully...');
  } catch (error) {
    console.error('Error deleting authors...');
    process.exit(1);
  }

  process.exit(0);
};

if (process.argv[2] === '-import-books') {
  seedDatabaseBooks();
} else if (process.argv[2] === '-delete-books') {
  deleteBooks();
} else if (process.argv[2] === '-import-authors') {
  seedDatabaseAuthors();
} else if (process.argv[2] === '-delete-authors') {
  deleteAuthors();
} else {
  console.error('Invalid command...');
  process.exit(1);
}
