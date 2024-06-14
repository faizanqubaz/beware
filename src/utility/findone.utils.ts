import { ICustomerDocument } from "../customers/ICustomerInterface";
import { Customer } from "../customers/customer.model";
import { User } from "../users/user.model";



const findCustomerBYEmail = async(email:string) => {
    const customer = await Customer.findOne({
        email: email,
      });
    return customer
}

const findUserByEmail = async(email:string) => {
   const user= await User.findOne({ email: email });
   return user
}


const saveCustomer = async(UserExists:any,inviteFrom:string,role:string) => {
    const newCustomer: ICustomerDocument = Customer.build({
        name: UserExists[0].name,
        email: UserExists[0].email,
        created_at: UserExists[0].created_at,
        username: UserExists[0].nickname,
        picture: UserExists[0].picture,
        userId: UserExists[0].userId,
        inviteFrom: inviteFrom,
        role:role
      });
  
      return await newCustomer.save();
}


const saveUserToDB = async( UserExists:any,role:string) => {
    const newUserAdded = User.build({
        name: UserExists[0].name,
        email: UserExists[0].email,
        created_at: UserExists[0].created_at,
        username: UserExists[0].nickname,
        authUserId: UserExists[0].user_id,
        picture: UserExists[0].picture,
        role: role,
      });
    
     return  await newUserAdded.save();
}



export {findCustomerBYEmail,saveCustomer,findUserByEmail,saveUserToDB}