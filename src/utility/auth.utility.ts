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

const addRoleToUser = async (
  token: string,
  userId: string,
  roleName: string,
) => {
  try {
    // Check if the role already exists
    const rolesOptions = {
      method: 'GET',
      url: `https://${process.env.MANAGEMENT_AUTH_DOMAIN}/api/v2/roles`,
      headers: { authorization: `Bearer ${token}` },
    };

    const rolesResponse = await axios(rolesOptions);
    let role = rolesResponse.data.find((role: any) => role.name === roleName);
    console.log('role', role);
    // If the role doesn't exist, create it
    if (!role) {
      const createRoleOptions = {
        method: 'POST',
        url: `https://${process.env.MANAGEMENT_AUTH_DOMAIN}/api/v2/roles`,
        headers: {
          authorization: `Bearer ${token}`,
          'content-type': 'application/json',
        },
        data: { name: roleName, description: `Role for ${roleName}` },
      };

      const createRoleResponse = await axios(createRoleOptions);
      role = createRoleResponse.data;
    }
    // // Check if the user already has the role
    const userRolesOptions = {
      method: 'GET',
      url: `https://${process.env.MANAGEMENT_AUTH_DOMAIN}/api/v2/users/${userId}/roles`,
      headers: { authorization: `Bearer ${token}` },
    };

    const userRolesResponse = await axios(userRolesOptions);
    const userRoles = userRolesResponse.data;
    const hasRole = userRoles.some((userRole: any) => userRole.id === role.id);

    if (!hasRole) {
      // Assign the role to the user
      const assignRoleOptions = {
        method: 'POST',
        url: `https://${process.env.MANAGEMENT_AUTH_DOMAIN}/api/v2/users/${userId}/roles`,
        headers: {
          authorization: `Bearer ${token}`,
          'content-type': 'application/json',
        },
        data: {
          roles: [role.id],
        },
      };

      await axios(assignRoleOptions);
    }
  } catch (error) {
    console.error('Error adding role to user:', error);
    throw error;
  }
};

export { getManagementToken, getUserFromManagementToken, addRoleToUser };
