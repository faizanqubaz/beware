import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

interface Auth0TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

const getManagementToken = async (): Promise<string> => {
  const auth0Domain = process.env.MANAGEMENT_AUTH_DOMAIN as string;
  const clientId = process.env.MANAGEMENT_AUTH_CLIENT_ID as string;
  const clientSecret = process.env.MANAGEMENT_AUTH_CLIENT_SECRET as string;
  const audience = process.env.MANAGEMENT_AUDIENCE as string;
  const tokenEndpoint = `https://${auth0Domain}/oauth/token`;

  const response = await axios.post<Auth0TokenResponse>(
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

const getRoleByName = async (roleName: any, token: string): Promise<any> => {
  const response = await axios.get(
    `https://${process.env.MANAGEMENT_AUTH_DOMAIN}/api/v2/roles`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const role = response.data.find((role: any) => role.name === roleName);

  if (!role) {
    throw new Error(`Role not found: ${roleName}`);
  }
  return role;
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

const getAuth0UserDetails = async (auth0UserId: string, token: string) => {
  try {
    const response = await axios.get(
      `https://${process.env.MANAGEMENT_AUTH_DOMAIN}/api/v2/users/${auth0UserId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
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

const deleteAuth0User = async (auth0UserId: any, token: string) => {
  await axios.delete(
    `https://${process.env.MANAGEMENT_AUTH_DOMAIN}/api/v2/users/${auth0UserId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

const updateAuth0User = async (auth0UserId: any, data: any, token: string) => {
  try {
    const userDetails = await getAuth0UserDetails(auth0UserId, token);
    console.log('userDetails', userDetails);

    const connectionType = userDetails.identities[0].provider;

    // Define allowed attributes for different connection types
    const allowedAttributes: Record<string, string[]> = {
      auth0: ['email', 'username', 'password', 'user_metadata', 'app_metadata'],
      'google-oauth2': ['name', 'user_metadata', 'app_metadata'],
      // Add other providers as needed
    };

    // Filter data to only include allowed attributes for the connection type
    const filteredData = Object.keys(data)
      .filter((key) => allowedAttributes[connectionType]?.includes(key))
      .reduce(
        (obj, key) => {
          (obj as Record<string, any>)[key] = data[key];
          return obj;
        },
        {} as Record<string, any>,
      );

    if (Object.keys(filteredData).length === 0) {
      throw new Error(
        `No attributes allowed for update for connection type ${connectionType}`,
      );
    }

    // Update the user with filtered data
    await axios.patch(
      `https://${process.env.MANAGEMENT_AUTH_DOMAIN}/api/v2/users/${auth0UserId}`,
      filteredData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    console.log('User updated successfully');
  } catch (error) {
    console.log('error', error);
  }
};

const updateAuth0UserRole = async (
  auth0UserId: any,
  roleName: any,
  token: string,
) => {
  console.log('rolename', roleName);

  try {
    const role = await getRoleByName(roleName, token);
    console.log('role', role);
    if (!role) {
      throw new Error(`Role not found: ${role}`);
    }

    await axios.post(
      `https://${process.env.MANAGEMENT_AUTH_DOMAIN}/api/v2/users/${auth0UserId}/roles`,
      { roles: [role.id] },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    console.log(
      `Role ${roleName} assigned to user ${auth0UserId} successfully.`,
    );
  } catch (error) {
    console.log(error);
  }
};

const getAuth0Users = async (token: string) => {
  const response = await axios.get(
    `https://${process.env.MANAGEMENT_AUTH_DOMAIN}/api/v2/users`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

const getUserRolesCronJob = async (token: string, userId: string) => {
  const response = await axios.get(
    `https://${process.env.MANAGEMENT_AUTH_DOMAIN}/api/v2/users/${userId}/roles`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export {
  getManagementToken,
  getUserRolesCronJob,
  getAuth0UserDetails,
  getUserFromManagementToken,
  addRoleToUser,
  deleteAuth0User,
  updateAuth0User,
  updateAuth0UserRole,
  getAuth0Users,
};
