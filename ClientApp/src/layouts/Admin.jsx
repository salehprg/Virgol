
import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import NotificationSystem from "react-notification-system";

import AdminNavbar from "components/Navbars/AdminNavbar";
import Footer from "components/Footer/Footer";
import SidebarAdmin from "components/Sidebar/SidebarAdmin";
import FixedPlugin from "components/FixedPlugin/FixedPlugin.jsx";

import image from "assets/img/sidebar-3.jpg";

import {NewUsers} from "../views/Admin/NewUsers";
import {CategoryList} from "../views/Admin/CategoryList";
import {CourseList} from "../views/Admin/CourseList";
import {UserIdentityDoc} from "../views/Admin/UserIdentityDoc";

import 'bootstrap/dist/css/bootstrap.min.css';

class Admin extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      _notificationSystem: null,
      image: image,
      color: "black",
      hasImage: true,
      fixedClasses: "dropdown show-dropdown open"
    };
  }
  
  componentDidMount() {
  }

  componentDidUpdate(e) {
    if (
      window.innerWidth < 993 &&
      e.history.location.pathname !== e.location.pathname &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
    }
    if (e.history.action === "PUSH") {
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
      this.refs.mainPanel.scrollTop = 0;
    }
  }

  render() {
    return (
      <div className="wrapper" style={{textAlign : "right" , direction : "rtl"}}>

        <SidebarAdmin {...this.props} image={this.state.image}
        color={this.state.color}
        hasImage={this.state.hasImage}/>

        <div id="main-panel" className="main-panel" ref="mainPanel">

          <AdminNavbar
            {...this.props}
            brandText="LMS Admin"
          />
          
          <Switch>
            <Route exact path="/Admin" component= {NewUsers}/>
            <Route path="/Admin/UserIdentityDoc" component= {UserIdentityDoc} />
            <Route path="/Admin/CategoryList" component= {CategoryList} />
            <Route path="/Admin/CourseList" component= {CourseList} />
          </Switch>

          <Footer />
        </div>
      </div>
    );
  }
}

export {Admin}
