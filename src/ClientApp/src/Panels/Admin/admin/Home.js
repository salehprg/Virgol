import React from "react";
import Table from "./Table";
import {adminService} from '../../../_Services/AdminService'
import { Modal, Button, Spinner  } from "react-bootstrap";
import { Link } from "react-router-dom";

class Home extends React.Component {

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
        await this.GetUser();
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

    toggleActive = (option) => {
        this.setState({ activePanel: option });
    }

    renderTable = () => {
        return (
              this.state.NewUsers ?
                <React.Fragment>
                  <thead>
                      <tr className="border-b-2 border-pri">
                          <th className="py-2">نام</th>
                          <th>نام خانوادگی</th>
                          <th>شماره ملی</th>
                          <th></th>
                          <th></th>
                      </tr>
                  </thead>
                  <tbody>
                      
                          {this.state.NewUsers.map((user) => {
                              return (
                              <tr key={user.id}>
                                  <td className="py-3">{user.firstName}</td>
                                  <td>{user.lastName}</td>
                                  <td>{user.melliCode}</td>
                                  <td><Link to={{
                                  pathname : "/Admin/UserIdentityDoc",
                                  userId : user.id
                                  }}> مشاهده مدارک </Link> </td>
                                  <td><a href="#" onClick={() => this.handleShow(user.id , user.melliCode)}> تایید </a> </td>
                              </tr>
                              );
                          })
                      } 
                  </tbody>
              </React.Fragment>
            :
            "دانش آموز جدیدی ثبت نام نکرده است"
        );
    }

    render() {
        return (
            <React.Fragment>
                <div className="w-5/6 h-500">
                    <Table
                        title="دانش آموزان جدید"
                        minWidth="600px"
                        table={this.renderTable}
                    />
                </div>

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
            </React.Fragment>
        );
    }

}

export default Home;