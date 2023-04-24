const express = require('express');
const AWS = require('aws-sdk');
const app = express();
const request = require('request');
const {
    clientId,clientSecret,
    cognitoDomain,region,
    port,redirectUri
  } = require("./constant");

// AWS SDK Configuration
AWS.config.update({ region });
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

// Exchange the authorization code for an access token
app.get('/api/auth-user', (req, res) => {
  const code = req.query.code;

  const options = {
    url: `https://${cognitoDomain}.auth.us-east-1.amazoncognito.com/oauth2/token`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    form: {
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code: code
    }
  };

  request.post(options, async (error, response, body) => {
    if (error) {
      console.error(error);
      res.send(error);
    } else {
      const accessToken = JSON.parse(body).access_token;
      console.log(accessToken);
    
      // Get user info
    const userInfoUrl = `https://${cognitoDomain}.auth.us-east-1.amazoncognito.com/oauth2/userInfo`;
    const userInfoResponse = request.post(userInfoUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(userInfoResponse)
    
    res.send(`userInfoResponse: ${userInfoResponse}`);
    }
  });
});


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
