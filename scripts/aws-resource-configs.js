function forUserPool(name) {
  return {
    PoolName: name,
    AdminCreateUserConfig: {
      AllowAdminCreateUserOnly: false
    },
    AliasAttributes: ["email", "preferred_username"],
    DeviceConfiguration: {
      ChallengeRequiredOnNewDevice: false,
      DeviceOnlyRememberedOnUserPrompt: true
    },
    MfaConfiguration: "OFF",
    Policies: {
      PasswordPolicy: {
        MinimumLength: 8,
        RequireLowercase: true,
        RequireNumbers: true,
        RequireSymbols: false,
        RequireUppercase: true
      }
    }
  };
}

function forAppClient(name, userPoolId) {
  return {
    ClientName: name,
    UserPoolId: userPoolId,
    AllowedOAuthFlows: ["code"],
    AllowedOAuthFlowsUserPoolClient: true,
    AllowedOAuthScopes: ["phone", "email", "openid", "profile"],
    CallbackURLs: ["http://localhost:3000/authenticated"],
    DefaultRedirectURI: "http://localhost:3000/authenticated",
    GenerateSecret: false,
    LogoutURLs: ["http://localhost:3000/signedout"]
  };
}

function forIdentityPool(name, region, userPoolId, appClientId) {
  return {
    IdentityPoolName: name,
    AllowUnauthenticatedIdentities: true,
    CognitoIdentityProviders: [
      {
        ProviderName: `cognito-idp.${region}.amazonaws.com/${userPoolId}`,
        ClientId: appClientId,
        ServerSideTokenCheck: false
      }
    ]
  };
}

function forIdentityPoolRoles(
  identityPoolId,
  authenticatedArn,
  unauthenticatedArn
) {
  return {
    IdentityPoolId: identityPoolId,
    Roles: {
      authenticated: authenticatedArn,
      unauthenticated: unauthenticatedArn
    }
  };
}

function createCognitoIamTrustPolicy(identityPoolId, authenticated) {
  return {
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Principal: { Federated: "cognito-identity.amazonaws.com" },
        Action: "sts:AssumeRoleWithWebIdentity",
        Condition: {
          StringEquals: {
            "cognito-identity.amazonaws.com:aud": identityPoolId
          },
          "ForAnyValue:StringLike": {
            "cognito-identity.amazonaws.com:amr": authenticated
              ? "authenticated"
              : "unauthenticated"
          }
        }
      }
    ]
  };
}

function forNewIamRole(name, identityPoolId, authenticated) {
  return {
    AssumeRolePolicyDocument: JSON.stringify(
      createCognitoIamTrustPolicy(identityPoolId, authenticated)
    ),
    Path: "/",
    RoleName: name
  };
}

function forApiInvokePolicy(roleName, apiArn) {
  const policy = {
    Version: "2012-10-17",
    Statement: [
      {
        Action: ["execute-api:Invoke"],
        Resource: apiArn,
        Effect: "Allow"
      }
    ]
  };
  return {
    PolicyDocument: JSON.stringify(policy),
    PolicyName: "InvokeApi",
    RoleName: roleName
  };
}

const AwsResourceConfigs = {
  forUserPool,
  forAppClient,
  forIdentityPool,
  forIdentityPoolRoles,
  forNewIamRole,
  forApiInvokePolicy
};
module.exports = AwsResourceConfigs;
