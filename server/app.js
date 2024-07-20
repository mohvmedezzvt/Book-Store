const express = require('express');
const connectToDatabase = require('./config/db');
const logger = require('./middlewares/logger');
const { notFound, errorHandler } = require('./middlewares/errors');
// const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();

// Connect to the database
connectToDatabase();

// Initialize Express App
const app = express();

// Middleware for serving static files
// eslint-disable-next-line no-undef
// app.use(express.static(path.join(__dirname, 'images')));

// Middleware for parsing JSON bodies
app.use(express.json());

// Middleware for parsing URL-encoded bodies
app.use(express.urlencoded({ extended: false }));

// Custom Middleware
app.use(logger);

// Helmet Middleware
app.use(helmet());

// CORS Middleware
app.use(cors());

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Routes
app.use('/api/books', require('./routes/books'));
app.use('/api/authors', require('./routes/authors'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/password', require('./routes/password'));

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Start the server
// eslint-disable-next-line no-undef
const port = process.env.PORT || 5000;
app.listen(port, () => {
  // eslint-disable-next-line no-undef
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
});
