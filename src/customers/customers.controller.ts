import express, { Response, Request } from 'express';
import { Customer } from './customer.model';
import mongoose from 'mongoose';
import { User } from '../users/user.model';
import { sendEmailToUser } from '../utility/sendemail.utils';
import {
  addRoleToUser,
  getManagementToken,
  getUserFromManagementToken,
} from '../utility/auth.utility';
import qs from 'qs';
import {
  IEmailArc,
  ICustomerDocument,
  IEmailRequestBody,
  roleMapping,
} from './ICustomerInterface';
import dotenv from 'dotenv';
import { IUserDocument } from '../users/Iuser.interface';
import {
  findCustomerBYEmail,
  findUserByEmail,
  saveCustomer,
  saveUserToDB,
} from '../utility/findone.utils';

// Load environment variables
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const SendInvite = async (
  req: Request<{}, {}, IEmailRequestBody>,
  res: Response,
) => {
  const { useremail, sender, role } = req.body;

  if (
    !useremail ||
    !sender ||
    !sender.name ||
    !sender.email ||
    role === undefined
  ) {
    return res.status(400).json({
      status: 400,
      message: 'email sender and role information should not be empty!',
    });
  }

  const roleName: string = roleMapping[0];

  if (!roleName) {
    return res.status(400).json({
      status: 400,
      message: 'Invalid role!',
    });
  }

  const emailData: IEmailArc = {
    to: useremail,
    sender: sender,
    role: roleName,
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

  const role: string | undefined = req.query.role as string;

  // check if empty
  if (!inviteTo || !inviteFrom || role === undefined) {
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
    console.log('userExists', UserExists);
    // if user not exists
    if (UserExists.length == 0) {
      const state = JSON.stringify({ inviteTo, inviteFrom, role });

      const authUrl =
        `https://${process.env.AUTH0_SPA_DOMAIN}/authorize?` +
        qs.stringify({
          client_id: process.env.AUTH0_SPA_LIENT_ID,
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
    const auth0ExistingUser = UserExists[0];
    const existingCustomer = await findCustomerBYEmail(auth0ExistingUser.email);

    if (existingCustomer) {
      return res.redirect(`http://localhost:3000`);
    }

    const newCustomer = await saveCustomer(auth0ExistingUser, inviteFrom, role);

    // SAVE THE USER ALSO

    const existingAuth0User = await findUserByEmail(auth0ExistingUser.email);
    if (existingAuth0User) {
      return res.redirect(`http://localhost:3000`);
    }

    await saveUserToDB(auth0ExistingUser, role);

    return res.redirect(`http://localhost:3000`);
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

  const { inviteTo, inviteFrom, role } = JSON.parse(state);

  const managementToken = await getManagementToken();

  const UserFromManagementToken = await getUserFromManagementToken(
    managementToken,
    inviteTo,
  );
  const auth0User = UserFromManagementToken[0];
  console.log('auth0User', auth0User);
  const authUserId = auth0User.user_id;
  console.log('authuserId', authUserId);
  // // SAVE THAT INTO THE CUSTOMER TABLE ALSO

  // save roles to auth0 user also
  await addRoleToUser(managementToken, authUserId, role);

  // CHECK IF THE CUSTOMER ALREADY EXISTS
  const customerExists = await findCustomerBYEmail(auth0User.email);

  if (customerExists) {
    return res.redirect(
      `http://localhost:3000?email=${customerExists.email}&name=${customerExists.name}`,
    );
  }
  await saveCustomer(auth0User, inviteFrom, role);

  // CHECK FOR USER EXISTS WITH THE EMAIL FIRST
  const existingUser = await findUserByEmail(auth0User.email);

  if (existingUser) {
    return res.redirect(
      `http://localhost:3000?email=${existingUser.email}&name=${existingUser.name}`,
    );
  }

  await saveUserToDB(auth0User, role);

  return res.redirect(
    `http://localhost:3000?email=${UserFromManagementToken[0].email}&name=${UserFromManagementToken[0].name}`,
  );
};

// GET CUSTOMER BY ID
const getCustomerById = async (req: Request, res: Response) => {
  const { customerId } = req.params;

  if (!customerId) {
    return res.status(400).json({
      status: 400,
      message: 'customerIdId parameter is required!',
    });
  }

  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    return res.status(400).json({
      status: 400,
      message: 'Invalid customerId format',
    });
  }

  try {
    const customer = await Customer.findById(customerId)
      .select('-paints')
      .exec();

    if (!customer) {
      return res.status(404).json({
        status: 404,
        message: 'No Customer found for this ID',
      });
    }

    return res.status(200).json({
      status: 200,
      message: 'Customer found',
      data: customer,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: 'An error occurred while fetching the customer',
    });
  }
};

const deleteCustomerById = async (req: Request, res: Response) => {
  try {
    const { customerId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({
        status: 400,
        message: 'Invalid userId format',
      });
    }
    const deletedCustomer = await Customer.findByIdAndDelete(customerId);

    if (!deletedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json({ message: 'Customer deleted successfully', deletedCustomer });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export {
  SendInvite,
  saveTheUser,
  getAllCustomersBySender,
  getAuthorizationCode,
  getCustomerById,
  deleteCustomerById,
};
