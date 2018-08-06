import Amplify, { Auth, Hub } from "aws-amplify";
import { awsConfig, signInUrl } from "./auth-config";

class AuthStore {
  constructor(history) {
    this.history = history;
    this.registerHubListener();
    Amplify.configure(awsConfig);
  }

  subscribe = subscriber => {
    this.subscriber = subscriber;
  };
  unsubscribe = () => {
    this.subscriber = null;
  };

  notify = authenticated => {
    if (this.subscriber) this.subscriber(authenticated);
  };
  isAuthenticated = () => {
    return Boolean(Auth.userPool.getCurrentUser());
  };

  getCredentials = async () => {
    try {
      const credentials = await Auth.currentCredentials();
      this.notify(credentials.authenticated);
      return credentials;

    } catch (err) {
      this.notify(false);
    }
  };

  registerHubListener = () => {
    const self = this;
    const hubListener = {
      onHubCapsule: async capsule => {
        if (capsule.payload.event === "configured") {
          self.notify(self.isAuthenticated());
        }
        if (capsule.payload.event === "cognitoHostedUI") {
          self.notify(self.isAuthenticated());
          self.history.push("/");
        }
      }
    };
    Hub.listen("auth", hubListener);
  };

  signIn = () => {
    window.location.assign(signInUrl);
  };

  signOut = async () => {
    try {
      await Auth.signOut();
    } catch (err) {
      console.error(err);
    }
  };
}

export default AuthStore;
