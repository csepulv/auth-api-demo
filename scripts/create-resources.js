const fetch = require('node-fetch');
const fs = require('fs');
const dotenv = require('dotenv');
const AwsUtils = require('./aws-utils');

dotenv.load();
global.fetch = fetch;

function writeEnvFile(resourceNames, resourceIds) {
  const lines = [];
  const add = (key, value) => lines.push(`REACT_APP_${key}=${value}`);

  add('OAUTH_DOMAIN', `https://${resourceNames.userPoolDomain}.auth.${region}.amazoncognito.com`);
  add('SIGNIN_CALLBACK', 'http://localhost:3000/authenticated');
  add('SIGNOUT_CALLBACK', 'http://localhost:3000/signedout');
  add('REGION', region);
  add('IDENTITY_POOL_ID', resourceIds.identityPoolId);
  add('USER_POOL_ID', resourceIds.userPoolId);
  add('CLIENT_ID', resourceIds.clientId);
  add('API_HOST', `${apiId}.execute-api.${region}.amazonaws.com`);
  add('API_KEY', resourceIds.apiKey);

  fs.writeFileSync('./web-ui.env', lines.join('\n'));
}

const region = process.env.AWS_REGION;
const awsAccountId = process.env.AWS_ACCOUNT_ID;
const apiId = process.env.API_ID;
const baseName = process.env.BASE_NAME;

const resourceNames = {
  userPool: `${baseName}_user_pool`,
  appClient: `${baseName}_client`,
  userPoolDomain: `${baseName.toLowerCase()}`,
  identityPool: `${baseName}_identity_pool`,
  authenticatedRole: `Cognito_${baseName}_AuthRole`,
  unauthenticatedRole: `Cognito_${baseName}_UnauthRole`
};

AwsUtils.setupAws(resourceNames, region, awsAccountId, apiId)
  .then(resourceIds => {
    console.log('Done setting up AWS.');
    writeEnvFile(resourceNames, resourceIds);
    console.log('Wrote web-ui.env file');
    process.exit(0);
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
