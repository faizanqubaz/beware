import express from 'express';
import { json } from 'body-parser';
import { mainRouter } from './routes';
import mongoose from 'mongoose';
import cors from 'cors';

import dotenv from 'dotenv';

// Load environment variables
if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.production' });
} else {
  dotenv.config({ path: '.env.development' });
}

const app = express();
app.use(express.json());
app.use(json());
app.use(cors());
app.use('/api/v2', mainRouter);

const PORT = process.env.PORT || 3000;
const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://faizanquba1:wk63Jpi7c16ISRyE@search-apserverdb.mj8x8op.mongodb.net/?retryWrites=true&w=majority&appName=search-apserverDB';

// Dynamic BASE_URL based on NODE_ENV
const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.BASE_URL || 'https://mycarcolor-8348d7d97064.herokuapp.com/'
    : process.env.BASE_URL || 'http://localhost:3000';

// CONNECT TO THE MONGODB
const start = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      ssl: true,
    });
    console.log('Connected to DB');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Base URL: ${BASE_URL}`);
    });
  } catch (err) {
    console.error('Failed to connect to DB', err);
  }
};

start();
