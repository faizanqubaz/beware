import express,{Express,Request,Response} from 'express'
import {Register} from './user.controller'
const router = express.Router();

router.post('/register',Register)

export {router as userRoute}