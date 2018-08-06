import React, { Component } from "react";
import { Router, Switch, Route, Redirect } from "react-router-dom";
import Home from "./Home";
import AuthStore from "./auth-store";
import createBrowserHistory from "history/createBrowserHistory";

const SignedoutCallback = () => {
  return <Redirect to="/" />;
};

const history = createBrowserHistory();
const authStore = new AuthStore(history);

const HomeWithAuthStore = () => {
  return <Home authStore={authStore} />;
};

class Routes extends Component {
  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route path="/signedout" component={SignedoutCallback} />
          <Route path="/" component={HomeWithAuthStore} />
        </Switch>
      </Router>
    );
  }
}

export default Routes;
