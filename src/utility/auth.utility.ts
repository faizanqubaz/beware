import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const getManagementToken = async () => {
  const auth0Domain = process.env.MANAGEMENT_AUTH_DOMAIN;
  const clientId = process.env.MANAGEMENT_AUTH_CLIENT_ID;
  const clientSecret = process.env.MANAGEMENT_AUTH_CLIENT_SECRET;
  const audience = process.env.MANAGEMENT_AUDIENCE;
  const tokenEndpoint = `https://${auth0Domain}/oauth/token`;

  const response = await axios.post(
    tokenEndpoint,
    {
      client_id: clientId,
      client_secret: clientSecret,
      audience: audience,
      grant_type: 'client_credentials',
    },
    {
      headers: { 'Content-Type': 'application/json' },
    },
  );

  return response.data.access_token;
};

const getUserFromManagementToken = async (accesToken: any, email: string) => {
  const userResponse = await axios.get(
    `https://dev-nl5xd2r8c23rplbr.us.auth0.com/api/v2/users-by-email?email=${encodeURIComponent(email)}`,
    {
      headers: { Authorization: `Bearer ${accesToken}` },
    },
  );

  const users = userResponse.data;
  return users;
};


// const assignRoleToAUth0 = async(userId:string,managementApiToken:string,userRole:string) => {
//   try {
//       // Fetch user's current roles
//       const userRolesResponse = await axios.get(`https://${process.env.MANAGEMENT_AUTH_DOMAIN}/api/v2/users/${userId}/roles`, {
//         headers: { Authorization: `Bearer ${managementApiToken}` }
//       });
  
//       const userRoles = userRolesResponse.data;
//       const roleIds = userRoles.map((r: { id: any; }) => r.id);
  
//       // Check if the user already has the role
//       if (!roleIds.includes(userRole)) {
//         // Assign role to user
//         await axios.post(`https://${process.env.MANAGEMENT_AUTH_DOMAIN}/api/v2/users/${userId}/roles`, 
//           { roles: [userRole] },
//           { headers: { Authorization: `Bearer ${managementApiToken}` } }
//         );
//       }
//   } catch (error) {
//     console.log(error)
//   }

// }

export { getManagementToken, getUserFromManagementToken };
