import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const getAccessToken = async (): Promise<string> => {
  try {
    const response = await axios.post(
      `https://dev-nl5xd2r8c23rplbr.us.auth0.com/oauth/token`,
      {
        client_id: 'DCOJxP7M7IkKpiD6uGMBtFhSnfi7txLH',
        client_secret:
          'WKxzlh_WVGSbQ858mKySX1ORC3xLmXvR92EV7XqCR2eO3uWaR_0CrKjAGhvLjWLh',
        audience: 'https://dev-nl5xd2r8c23rplbr.us.auth0.com/api/v2/',
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
