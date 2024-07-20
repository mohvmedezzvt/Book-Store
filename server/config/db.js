/* eslint-disable no-undef */
const mongoose = require('mongoose');
require('dotenv').config();

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');
  } catch (error) {
    console.error('Could not connect to MongoDB...', error);
    process.exit(1);
  }
}

module.exports = connectToDatabase;
