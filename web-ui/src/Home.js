import React, { Component } from "react";
import {
  Alignment,
  Button,
  Intent,
  Navbar,
  NavbarGroup,
  NavbarHeading,
  Position,
  Toaster
} from "@blueprintjs/core";
import { AuthenticatedUserButtons, GuestButtons } from "./UserButtons";

import { authenticatedCall, noAuthCall } from "./api-client";

const toaster = Toaster.create({ position: Position.TOP });

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { authenticated: this.props.authStore.isAuthenticated() };
  }

  handleAuthChange = authenticated => {
    this.setState({ authenticated: authenticated });
  };

  componentWillMount() {
    this.props.authStore.subscribe(this.handleAuthChange);
  }
  componentWillUnmount() {
    this.props.authStore.unsubscribe();
  }

  invokeApi = async call => {
    try {
      const response = await call(this.props.authStore);
      toaster.show({ message: response.message, intent: Intent.SUCCESS });
    } catch (err) {
      toaster.show({ message: err.message, intent: Intent.DANGER });
    }
  };

  render() {
    return (
      <div>
        <Navbar>
          <NavbarGroup align={Alignment.LEFT}>
            <NavbarHeading>API Auth Demo</NavbarHeading>
          </NavbarGroup>
          <NavbarGroup align={Alignment.RIGHT} style={{ marginRight: 30 }}>
            {this.state.authenticated && (
              <AuthenticatedUserButtons
                signOut={this.props.authStore.signOut}
              />
            )}
            {!this.state.authenticated && (
              <GuestButtons signIn={this.props.authStore.signIn} />
            )}
          </NavbarGroup>
        </Navbar>
        <div className="center">
          <Button
            intent="success"
            text="No Auth"
            onClick={() => this.invokeApi(noAuthCall)}
          />
          <Button
            intent={this.state.authenticated ? "success" : "danger"}
            text="Req. Auth"
            onClick={() => this.invokeApi(authenticatedCall)}
          />
        </div>
      </div>
    );
  }
}

export default Home;
