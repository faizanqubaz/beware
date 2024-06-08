import express from 'express';
import { json } from 'body-parser';
import { mainRouter } from './routes';
import mongoose from 'mongoose';

import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());
app.use(json());

const PORT = process.env.PORT || 3000;
const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://faizanquba1:wk63Jpi7c16ISRyE@search-apserverdb.mj8x8op.mongodb.net/?retryWrites=true&w=majority&appName=search-apserverDB';

app.use('/api/v2', mainRouter);

// CONNECT TO THE MONGODB
const start = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      ssl: true,
    });
    console.log('Connected to DB');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to DB', err);
  }
};

start();
