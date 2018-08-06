import React from "react";
import { Button, Menu, MenuItem, Popover, Position } from "@blueprintjs/core";

export const GuestButtons = ({ signIn }) => {
  return <Button icon="log-in" text="Sign In" onClick={signIn} />;
};

const UserMenuItems = ({ signOut }) => {
  return (
    <Menu>
      <MenuItem icon="log-out" text="Sign Out" onClick={signOut} />
    </Menu>
  );
};

export const AuthenticatedUserButtons = ({ signOut }) => {
  return (
    <Popover
      content={<UserMenuItems signOut={signOut} />}
      position={Position.BOTTOM}
      canEscapeKeyClose={true}
    >
      <Button icon="user" />
    </Popover>
  );
};
