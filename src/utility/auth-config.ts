import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const getAccessToken = async (): Promise<string> => {
  try {
    const response = await axios.post(
      `https://dev-42td93pl.us.auth0.com/oauth/token`,
      {
        client_id: 'NKMsawDXQWOgHxmWUVANEw4IucvPx9K2',
        client_secret:
          '3AsOYtYa_iu08XyWSNyu3OwUjo4r9VkxEtw0EFR_kfVGPQSKgBjT8l2y_zyVVZ-_',
        audience: 'https://dev-42td93pl.us.auth0.com/api/v2/',
        grant_type: 'client_credentials',
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
};

export { getAccessToken };
