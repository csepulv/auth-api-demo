import Amplify from "aws-amplify";
//Amplify.Logger.LOG_LEVEL = 'VERBOSE';

const oauth = {
  domain: process.env.REACT_APP_OAUTH_DOMAIN,
  scope: [
    "phone",
    "email",
    "profile",
    "openid",
    "aws.cognito.signin.user.admin"
  ],
  redirectSignIn: process.env.REACT_APP_SIGNIN_CALLBACK,
  redirectSignOut: process.env.REACT_APP_SIGNOUT_CALLBACK,
  responseType: "code"
};

export const awsConfig = {
  Analytics: {
    disabled: true
  },
  Auth: {
    oauth: oauth,
    region: process.env.REACT_APP_REGION,
    identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
    userPoolId: process.env.REACT_APP_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_CLIENT_ID
  }
};

function configureAmplify(){
  Amplify.configure(awsConfig);
}

export const signInUrl=`https://${
  awsConfig.Auth.oauth.domain
  }/login?redirect_uri=${awsConfig.Auth.oauth.redirectSignIn}&response_type=${
  awsConfig.Auth.oauth.responseType
  }&client_id=${awsConfig.Auth.userPoolWebClientId}`;


export default configureAmplify;