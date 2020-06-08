
import React, { Component } from "react";
import { NavItem, Nav, NavDropdown, NavLink } from "react-bootstrap";
import { authenticationService } from "../../_Services/AuthenticationService";

class AdminNavbarLinks extends Component {
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
      <div>
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
          <NavLink href="#">
            <i className="fa fa-search" />
            <p className="hidden-lg hidden-md">Search</p>
          </NavLink>
        </Nav>
        <Nav>
          <NavLink href="#">
            Account
          </NavLink>
          <NavDropdown
            title="Dropdown"
            id="basic-nav-dropdown-right"
          >
            <NavDropdown.Item>Action</NavDropdown.Item>
            <NavDropdown.Item>Another action</NavDropdown.Item>
            <NavDropdown.Item>Something</NavDropdown.Item>
            <NavDropdown.Item>Another action</NavDropdown.Item>
            <NavDropdown.Item>Something</NavDropdown.Item>
            <NavDropdown.Item divider />
            <NavDropdown.Item>Separated link</NavDropdown.Item>
          </NavDropdown>
          <NavLink href="#" onClick={this.LogOut}>
            Log out
          </NavLink>
        </Nav>
      </div>
    );
  }
}

export default AdminNavbarLinks;
