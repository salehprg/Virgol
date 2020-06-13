
import React, { Component } from "react";
import { NavItem, Nav, NavDropdown, NavLink } from "react-bootstrap";
import { authenticationService } from "../../_Services/AuthenticationService";

class CommonNavbarLink extends Component {
  LogOut = () => {
    authenticationService.logout();
  }

  render() {
    const notification = (
      <div>
        <i className="fa fa-globe" />
        <b className="caret" />
        <span className="notification">5</span>
        <p className="hidden-lg hidden-md">Notification</p>
      </div>
    );
    return (
      <React.Fragment>
        <Nav>
          <NavLink href="#">
            <i className="fa fa-dashboard" />
            <p className="hidden-lg hidden-md">Dashboard</p>
          </NavLink>
          <NavDropdown
            title={notification}
            id="basic-nav-dropdown"
          >
            <NavDropdown.Item>Notification 1</NavDropdown.Item>
            <NavDropdown.Item>Notification 2</NavDropdown.Item>
            <NavDropdown.Item>Notification 3</NavDropdown.Item>
            <NavDropdown.Item>Notification 4</NavDropdown.Item>
            <NavDropdown.Item>Another notifications</NavDropdown.Item>
          </NavDropdown>
          <NavLink href="#" onClick={this.LogOut}>
            Log out
          </NavLink>
        </Nav>
      </React.Fragment>
    );
  }
}

export default CommonNavbarLink;
