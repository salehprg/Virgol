
import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import NotificationSystem from "react-notification-system";

import AdminNavbar from "components/Navbars/AdminNavbar";
import Footer from "components/Footer/Footer";
import Sidebar from "components/Sidebar/Sidebar";
import FixedPlugin from "components/FixedPlugin/FixedPlugin.jsx";

import image from "assets/img/sidebar-3.jpg";
import {UserCategory} from "../views/UserCategory";
import {UserCourse} from "../views/UserCourse";
import {userService} from "../_Services/UserServices";

import 'bootstrap/dist/css/bootstrap.min.css';

class User extends Component {
  
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
    userService.GetUserCategory();
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

        <Sidebar {...this.props} image={this.state.image}
        color={this.state.color}
        hasImage={this.state.hasImage}/>

        <div id="main-panel" className="main-panel" ref="mainPanel">
          {/* <AdminNavbar
            {...this.props}
            brandText={this.getBrandText(this.props.location.pathname)}
          /> */}

          <AdminNavbar
            {...this.props}
            brandText="LMS"
          />
          
          <Switch>
            <Route exact path="/User" component= {UserCategory}/>
            <Route path="/User/Courses" component= {UserCourse} />
          </Switch>

          <Footer />
        </div>
      </div>
    );
  }
}

export {User}
