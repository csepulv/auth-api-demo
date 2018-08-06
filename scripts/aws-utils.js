const AWS = require('aws-sdk');
const ResourceConfigs = require('./aws-resource-configs');

async function createUserPoolWithClientAndDomain(resourceNames) {
  const cognito = new AWS.CognitoIdentityServiceProvider();

  const userPoolSettings = ResourceConfigs.forUserPool(resourceNames.userPool);
  const userPoolResult = await cognito.createUserPool(userPoolSettings).promise();
  console.log(`Created User Pool:${JSON.stringify(userPoolResult)}`);

  const userPoolId = userPoolResult.UserPool.Id;

  const appClientSettings = ResourceConfigs.forAppClient(resourceNames.appClient, userPoolId);
  const appClientResult = await cognito.createUserPoolClient(appClientSettings).promise();
  console.log(`Created App Client:${JSON.stringify(appClientResult)}`);

  const userPoolDomainSettings = {
    Domain: resourceNames.userPoolDomain,
    UserPoolId: userPoolId
  };
  const domainResult = await cognito.createUserPoolDomain(userPoolDomainSettings).promise();
  console.log(`Created User Pool Domain:${JSON.stringify(domainResult)}`);

  const clientId = appClientResult.UserPoolClient.ClientId;

  return { userPoolId, clientId };
}

async function createIdentityPool(resourceNames, region, userPoolId, appClientId) {
  const cognito = new AWS.CognitoIdentity();

  const poolSettings = ResourceConfigs.forIdentityPool(
    resourceNames.identityPool,
    region,
    userPoolId,
    appClientId
  );
  const identityPoolResult = await cognito.createIdentityPool(poolSettings).promise();
  console.log(`Created Identity Pool:${JSON.stringify(identityPoolResult)}`);

  return { identityPoolId: identityPoolResult.IdentityPoolId };
}

async function assignAuthRolesToIdentityPool(identityPoolId, authArn, unauthArn) {
  const cognito = new AWS.CognitoIdentity();

  const rolesSettings = ResourceConfigs.forIdentityPoolRoles(identityPoolId, authArn, unauthArn);
  const rolesResult = await cognito.setIdentityPoolRoles(rolesSettings).promise();
  console.log(`Set Identity Pool Roles:${JSON.stringify(rolesResult)}`);
}

async function createIamRolesForIdentityPool(
  resourceNames,
  region,
  awsAccountId,
  apiId,
  identityPoolId
) {
  const iam = new AWS.IAM();
  const authRoleSettings = ResourceConfigs.forNewIamRole(
    resourceNames.authenticatedRole,
    identityPoolId,
    true
  );
  const authRoleResult = await iam.createRole(authRoleSettings).promise();
  console.log(`Created auth role:${JSON.stringify(authRoleResult)}`);

  const policySettings = ResourceConfigs.forApiInvokePolicy(
    resourceNames.authenticatedRole,
    `arn:aws:execute-api:${region}:${awsAccountId}:${apiId}/*/*/*`
  );
  const policyResult = await iam.putRolePolicy(policySettings).promise();
  console.log(`Put auth role api invoke policy:${JSON.stringify(policyResult)}`);

  const unauthRoleSettings = ResourceConfigs.forNewIamRole(
    resourceNames.unauthenticatedRole,
    identityPoolId,
    false
  );
  const unauthRoleResult = await iam.createRole(unauthRoleSettings).promise();
  console.log(`Created unauth role:${JSON.stringify(unauthRoleResult)}`);

  return {
    authArn: authRoleResult.Role.Arn,
    unauthArn: unauthRoleResult.Role.Arn
  };
}

async function setupAws(resourceNames, region, awsAccountId, apiId) {
  AWS.config.credentials = new AWS.SharedIniFileCredentials({
    profile: process.env.AWS_PROFILE
  });
  AWS.config.update({ region: region });

  const userPoolInfo = await createUserPoolWithClientAndDomain(resourceNames);
  const identityPoolInfo = await createIdentityPool(
    resourceNames,
    region,
    userPoolInfo.userPoolId,
    userPoolInfo.clientId
  );

  const apiRoleInfo = await createIamRolesForIdentityPool(
    resourceNames,
    region,
    awsAccountId,
    apiId,
    identityPoolInfo.identityPoolId
  );

  await assignAuthRolesToIdentityPool(
    identityPoolInfo.identityPoolId,
    apiRoleInfo.authArn,
    apiRoleInfo.unauthArn
  );

  return { ...userPoolInfo, identityPoolInfo, apiRoleInfo };
}

module.exports = {
  setupAws
};
