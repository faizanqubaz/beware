import axios from 'axios';

const getManagementToken = async () => {
  const auth0Domain = 'dev-nl5xd2r8c23rplbr.us.auth0.com';
  const clientId = 'rtaOFio2v5h3bTG28S029HSxeu7bdAz2';
  const clientSecret =
    'Wu2ndLlM6-QPZKMrBnyHe-ciMsr8mDA5Jn6xctZtX5VlxMAofVhB3ZEMheAYapLm';
  const audience = `https://dev-nl5xd2r8c23rplbr.us.auth0.com/api/v2/`;
  const tokenEndpoint = `https://dev-nl5xd2r8c23rplbr.us.auth0.com/oauth/token`;

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

// const getTokenFromCode = async(code:any) => {
//   const tokenResponse = await axios.post(`https://dev-nl5xd2r8c23rplbr.us.auth0.com/oauth/token`, {
//     grant_type: 'authorization_code',
//     client_id: 'L3eoXDSx4mpLrxWxic528L3Rg2dEMopi',
//     client_secret: 'evpFmimHkoQrqwl4k7pIZ1cMIn1wTR6b12s-eod1cqYe0WcNHptbcBrzskm_dz9v',
//     code: code,
//     redirect_uri: 'http://localhost:5000/api/v2/customer/callback',
//     scope: 'read:users'
//   }, {
//     headers: { 'Content-Type': 'application/json' }
//   });

//   const accessToken = tokenResponse.data.access_token;
//   console.log('accessToken',accessToken)

//   // Store the access token securely (e.g., in a session)
//  return accessToken
// }

export { getManagementToken, getUserFromManagementToken };
