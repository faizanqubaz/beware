import express, { Response, Request } from 'express';
import { Customer } from './customer.model';
import { User } from '../users/user.model';
import {sendEmailToUser} from '../utility/sendemail.utils'
import {
  getManagementToken,
  getUserFromManagementToken,
} from '../utility/auth.utility';
import qs from 'qs';
import {
  IEmailArc,
  ICustomerDocument,
  IEmailRequestBody,
} from './ICustomerInterface';
import dotenv from 'dotenv';
import { IUserDocument } from '../users/Iuser.interface';
import { findCustomerBYEmail,findUserByEmail,saveCustomer, saveUserToDB } from '../utility/findone.utils';
dotenv.config();

const SendInvite = async (
  req: Request<{}, {}, IEmailRequestBody>,
  res: Response,
) => {
  const { useremail, sender, role } = req.body;

  if (!useremail || !sender || !sender.name || !sender.email || !role) {
    return res.status(400).json({
      status: 400,
      message: 'email sender and role information should not be empty!',
    });
  }

  const emailData: IEmailArc = {
    to: useremail,
    sender: sender,
    role:role
  };

  try {
    const inviteDetails = await sendEmailToUser(emailData);

    res.status(200).json({
      status: 200,
      message: 'Email sent successfully',
      inviteDetails,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: `Error sending email: ${error}`,
    });
  }
};


const saveTheUser = async (req: Request, res: Response) => {
  // get the senderemail and enduser email
  const inviteTo: string | undefined = req.query.inviteTo as string | undefined;
  const inviteFrom: string | undefined = req.query.inviteFrom as
    | string
    | undefined;

    const role: string | undefined = req.query.role as
    | string
    | undefined;

  // check if empty
  if (!inviteTo || !inviteFrom || !role) {
    return res.status(400).json({
      status: 400,
      message: 'Invalid or missing invite parameters!',
    });
  }

  try {
    // get the management api
    const managementToken = await getManagementToken();

    const UserExists = await getUserFromManagementToken(
      managementToken,
      inviteTo,
    );
console.log('userExists',UserExists)
    // if user not exists
    if (UserExists.length == 0) {
      const state = JSON.stringify({ inviteTo, inviteFrom, role });

      const authUrl =
        `https://${process.env.AUTH0_SPA_DOMAIN}/authorize?` +
        qs.stringify({
          client_id: process.env.AUTH0_SPA_DOMAIN,
          response_type: 'code',
          redirect_uri: process.env.AUTH0_SPA_REDIRECT_URI,
          scope: 'openid profile email read:users',
          audience: `https://${process.env.AUTH0_SPA_DOMAIN}/api/v2/`,
          state,
        });

      console.log('authurl', authUrl);

      return res.redirect(authUrl);
    }

    //IF USER EXIST
    const existingCustomer =await findCustomerBYEmail(UserExists[0].email)

    if (existingCustomer) {
      return res.redirect(
        `http://localhost:3000?email=${existingCustomer.email}&name=${existingCustomer.name}`,
      );
    }

   const newCustomer= await saveCustomer(UserExists,inviteFrom,role)
    

    // SAVE THE USER ALSO
  
const existingAuth0User= await findUserByEmail(UserExists[0].email)
    if (existingAuth0User) {
      return res.redirect(`http://localhost:3000?email=${UserExists[0].email}&name=${UserExists[0].name}`);
    }
  
    
   const newUser=await saveUserToDB(UserExists,role)

  

    console.log('User saved to database:', newCustomer);
    return res.redirect(
      `http://localhost:3000?email=${newCustomer.email}&name=${newCustomer.name}`,
    );
  } catch (error) {
    console.error('Error checking if user exists:', error);
    throw error;
  }
};

const getAllCustomersBySender = async (req: Request, res: Response) => {
  const { email: senderEmail } = req.query;

  if (!senderEmail) {
    return res.status(400).json({
      status: 400,
      message: 'senderEmail query parameter is required!',
    });
  }

  try {
    const customers = await Customer.find({ inviteFrom: senderEmail });

    if (customers.length === 0) {
      return res.status(200).json({
        status: 200,
        message: 'No customers found for this sender',
      });
    }

    res.status(200).json({
      status: 200,
      data: customers,
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({
      status: 500,
      message: 'Error fetching customers',
    });
  }
};

// IF THE USER NOT EXIT IN AUTH0 THEN IT WILL CALLED
const getAuthorizationCode = async (req: Request, res: Response) => {
  const code = req.query.code as string | undefined;
  const state = req.query.state as string | undefined;

  if (!code || !state) {
    return res.status(400).json({
      status: 400,
      message: 'Authorization code or state is missing!',
    });
  }

  const { inviteTo, inviteFrom,role } = JSON.parse(state);
  console.log('inviteto',inviteTo)
  console.log('inviteFrom',inviteFrom)
  const managementToken = await getManagementToken();

  const UserFromManagementToken = await getUserFromManagementToken(
    managementToken,
    inviteTo,
  );
  const auth0User = UserFromManagementToken[0];
  console.log('auth0User',auth0User)
const authUserId=auth0User.user_id;
console.log('authuserId',authUserId)
  // // SAVE THAT INTO THE CUSTOMER TABLE ALSO


// CHECK IF THE CUSTOMER ALREADY EXISTS
const customerExists =await findCustomerBYEmail(auth0User.email)

if (customerExists) {
  return res.redirect(
    `http://localhost:3000?email=${customerExists.email}&name=${customerExists.name}`,
  );
}

  const newCustomerAdded: ICustomerDocument = Customer.build({
    name: auth0User.name,
    email: auth0User.email,
    created_at: auth0User.created_at,
    username: auth0User.nickname,
    userId: auth0User.user_id,
    picture: auth0User.picture,
    inviteFrom: inviteFrom,
    role:role
  });

  await newCustomerAdded.save();

  // CHECK FOR USER EXISTS WITH THE EMAIL FIRST
  const existingUser = await User.findOne({ email: auth0User.email });

  if (existingUser) {
    return res.redirect(`http://localhost:3000?email=${existingUser.email}&name=${existingUser.name}`);
  }

  
  const newUserAdded: IUserDocument = User.build({
    name: auth0User.name,
    email: auth0User.email,
    created_at: auth0User.created_at,
    username: auth0User.nickname,
    authUserId: auth0User.user_id,
    picture: auth0User.picture,
    role:role
  });

  await newUserAdded.save();

  // save roles to auth0 user also


  return res.redirect(
    `http://localhost:3000?email=${UserFromManagementToken[0].email}&name=${UserFromManagementToken[0].name}`,
  );
};

export {
  SendInvite,
  saveTheUser,
  getAllCustomersBySender,
  getAuthorizationCode,
};
