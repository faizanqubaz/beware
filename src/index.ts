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
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/todos';

app.use('/v2', mainRouter);

// CONNECT TO THE MONGODB
const start = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to DB');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to DB', err);
  }
};

start();
