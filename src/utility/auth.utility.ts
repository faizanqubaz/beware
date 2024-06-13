import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const getManagementToken = async () => {
  const auth0Domain = process.env.MANAGEMENT_AUTH_DOMAIN;
  const clientId = process.env.MANAGEMENT_AUTH_CLIENT_ID;
  const clientSecret = process.env.MANAGEMENT_AUTH_CLIENT_SECRET;
  const audience = process.env.MANAGEMENT_AUDIENCE;
  const tokenEndpoint = `https://${process.env.MANAGEMENT_AUTH_DOMAIN}/oauth/token`;

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

export { getManagementToken, getUserFromManagementToken };
