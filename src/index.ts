import express from 'express'
import {json} from 'body-parser'
import {mainRouter} from './user'
import mongoose from 'mongoose'

const app = express()

app.use(json())
app.use('/v2',mainRouter)

// CONNECT TO THE MONGODB
async function connectToDB() {
    try {
      await mongoose.connect('mongodb://127.0.0.1:27017/todos',);
      console.log('Connected to DB');
    } catch (err) {
      console.error('Error connecting to DB', err);
    }
  }
  
  connectToDB();


app.listen(5000,()=>{
console.log('server is listening on 3000')
})