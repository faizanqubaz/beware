import express,{Request,Response, Router} from 'express'
import {userRoute} from './users/user.route'
const router: Router =express.Router()

router.use('/user',userRoute)



export {router as mainRouter}