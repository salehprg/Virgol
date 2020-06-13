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
import { Grid, Row, Col, Table, Modal, Button, Spinner } from "react-bootstrap";
import {adminService} from '../../_Services/AdminService'
import Card from "components/Card/Card.jsx";
import { Link } from "react-router-dom";

class NewUsers extends Component {
  
  constructor (props){
    super(props);
    this.state = {Loading : false ,  NewUsers : [] , Show : false , ShowSuccusful : false , SelectedUser : -1 , MelliCode : 0};
  }

  handleClose = () => this.setState({Show : false});
  handleShow = (id , melliCode) => {
    this.setState({Show : true , SelectedUser : id , MelliCode : melliCode})
  };

  handleCloseSuccusful = () => {
    this.setState({ShowSuccusful : false})
    this.GetUser();
  }

  async GetUser(){
    try
    {
      const NewUsers = await adminService.GetNewUsers();
      if(NewUsers != false)
      {
        console.log(NewUsers);
        this.setState({NewUsers : NewUsers});
      }
      else
      {
        this.setState({NewUsers : null});
      }
    }
    catch(e)
    {
      console.log(e);
    } 
  }

  async componentDidMount(){
    this.GetUser();
  }
  
  async ConfirmUser () {
    try
    {
      this.setState({Loading : true})

      const result = await adminService.ConfirmUser(this.state.SelectedUser);
      console.log(result);
      
      if(result != false)
      {
        this.handleClose();
        this.setState({ShowSuccusful : true});
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
    finally
    {
      this.setState({Loading : false})
    }
  }

  render() {
    return (
      <div className="content">
          <Row>
            <Col md={12}>
              <Card
                
                title="کاربران جدید"
                useregory="کاربران جدید که ثبت نام اولیه نموده اند"
                ctTableFullWidth
                ctTableResponsive
                content={(this.state.NewUsers ?
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th key="1">نام </th>
                        <th key="2">نام خانوادگی </th>
                        <th key="3">کد ملی</th>
                        <th key="4"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.NewUsers.map((user) => {
                        return (
                          <tr key={user.id}>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.melliCode}</td>
                            <td><Link to={{
                              pathname : "/Admin/UserIdentityDoc",
                              userId : user.id
                              }}> مشاهده مدارک </Link> </td>
                            <td><Link onClick={() => this.handleShow(user.id , user.melliCode)}> تایید </Link> </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                 : "کاربر جدیدی موجود نمیباشد")}
              />
            </Col>
          </Row>

          <Modal show={this.state.Show} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>تایید کاربر</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            {(this.state.Loading ? <Spinner animation="border" variant="primary" /> :
              "آیا از تایید کاربر با کد ملی" + this.state.MelliCode + "مطمئن هستید ؟"
              )}
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={() => this.handleClose()}>
                بستن
              </Button>
              <Button variant="primary" onClick={() => this.ConfirmUser()}>
                تایید
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal show={this.state.ShowSuccusful} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>تایید کاربر</Modal.Title>
            </Modal.Header>
            <Modal.Body>کاربر با کد ملی {this.state.MelliCode} با موفقیت تایید شد</Modal.Body>
            <Modal.Footer>
              <Button variant="info" onClick={() => this.handleCloseSuccusful()}>
                بستن
              </Button>
            </Modal.Footer>
          </Modal>
        
      </div>
    );
  }
}

export {NewUsers};
