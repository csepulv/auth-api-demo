# Securing Microservices on AWS with Cognito, API Gateway and Lambda
## Web Setup: .env file

`sample.env` has the following
```
REACT_APP_OAUTH_DOMAIN=
REACT_APP_SIGNIN_CALLBACK=
REACT_APP_SIGNOUT_CALLBACK=
REACT_APP_REGION=
REACT_APP_IDENTITY_POOL_ID=
REACT_APP_USER_POOL_ID=
REACT_APP_CLIENT_ID=
REACT_APP_API_HOST=
REACT_APP_API_KEY=
```


`REACT_APP_OAUTH_DOMAIN=`
From the AWS setup, this is the sub domain created for the Cognito User Pool (without http://)

`REACT_APP_SIGNIN_CALLBACK=`
Host and Route for redirect after signing into Cogntio (auth). This depends on where you host. In the demo, it is `https://auth-api-demo.firebaseapp.com/authenticated`


`REACT_APP_SIGNOUT_CALLBACK=`
Host and Route for redirect after sign out. This depends on where you host. In the demo, it is `https://auth-api-demo.firebaseapp.com/signedout`

`REACT_APP_REGION=`
AWS region where you setup resources. Something like `us-west-2` or `us-east-1`

`REACT_APP_IDENTITY_POOL_ID=`
AWS Cognito Federated Identity Pool ID

`REACT_APP_USER_POOL_ID=`
AWS Cognito User Pool ID

`REACT_APP_CLIENT_ID=`
AWS Cognito User Pool, Client ID

`REACT_APP_API_HOST=`
AWS API Gateway URL

`REACT_APP_API_KEY=`
AWS API Gateway API key, as created in API Gateway plan.

