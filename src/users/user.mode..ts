import mongoose from 'mongoose'
import mongose from 'mongoose'

const todoSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    }
})

const Todo = mongoose.model('Todo',todoSchema)

export {Todo}