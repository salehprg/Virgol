/*!

=========================================================
* Light Bootstrap Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { Component } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";
import {adminService} from '../../_Services/AdminService'
import Card from "components/Card/Card.jsx";
import { Link } from "react-router-dom";

class UserIdentityDoc extends Component {
  
  constructor (props){
    super(props);
    this.state = {UserId : props.userId};
  }

  async ConfirmUser(){
    try
    {
      const result = await adminService.ConfirmUser(this.state.UserId);
      if(result != false)
      {
        console.log("Succuseful!");
      }
      else
      {
        console.log("false happen")
      }
    }
    catch(e)
    {
      console.log(e);
    } 
  }

  render() {
    return (
      <div className="content">
        مدارک کاربر با ایدی {this.state.UserId}
      </div>
    );
  }
}

export {UserIdentityDoc};
