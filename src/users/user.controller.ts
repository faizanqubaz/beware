import express,{Response,Request} from 'express'


const Register = (req:Request,res:Response)=>{
    res.send('hello')
}

export {
    Register
}