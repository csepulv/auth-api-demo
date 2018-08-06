const ApiBuilder = require("claudia-api-builder");
const api = new ApiBuilder();

api.get(
  "/no-auth",
  request => {
    return {message: "Open for All!"};
  },
  { apiKeyRequired: true }
);

api.get(
  "/require-auth",
  request => {
    return {message: "You're past the velvet rope!"};
  },
  { apiKeyRequired: true, authorizationType: "AWS_IAM" }
);

module.exports = api;
