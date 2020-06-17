import React from "react";
import Table from "../../../components/Table";
import {add , edit , remove, courses} from "../../../icons";
import { Modal, Container, Spinner, Button, Form } from "react-bootstrap";
import {adminService} from '../../../_Services/AdminService'
import { TextField, MenuItem , FormControl, Select, InputLabel } from "@material-ui/core";

class Teachers extends React.Component {

    state = {  }
    constructor (props){
        super(props);
        this.state = {showCourses: null , 
                      Loading : false , ShowSuccusfulAdd : false , ShowSuccusfulEdit : false , ShowSuccusfulDel : false
                      , ShowAdd : false , ShowEdit : false , ShowDel : false 
                      , TeacherInfo : null
                      , Teachers : []};
    
        this.handleShowDel = this.handleShowDel.bind(this);
      }
    
      emptyTeacherInfo = () => {
        this.setState({TeacherInfo : null})
      }

      handleShowAdd = async () => this.setState({ShowAdd : true})
      handleCloseAdd = () => this.setState({ShowAdd : false})
      handleCloseSuccusfulAdd = () => {
        this.setState({ShowSuccusfulAdd : false})
        this.emptyTeacherInfo();
        this.GetTeachersList();
      }
    
      handleShowDel = (Teacher) => {
        this.setState({ShowDel : true});
        (Teacher && this.setState({TeacherInfo : Teacher}))
      }
      handleCloseDel = () => this.setState({ShowDel : false})
      handleCloseSuccusfulDel = () => {
        this.setState({ShowSuccusfulDel : false})
        this.GetTeachersList();
      }

      //#region EditTeacher

      handleShowEdit = async () => this.setState({ShowEdit : true})
      handleCloseEdit = () => this.setState({ShowEdit : false})
      handleCloseSuccusfulEdit = () => {
        this.setState({ShowSuccusfulEdit : false})
        this.emptyTeacherInfo();
        this.GetTeachersList();
      }

      //#endregion

      handleInputAddTeacher = (property , value) =>{
        this.setState(prevState => ({
            TeacherInfo : { 
            ...prevState.TeacherInfo , [property] : value
          }
        }))
      }

      openEditMode = (SelectedTeacher) => {
        (SelectedTeacher != null && this.setState({TeacherInfo : SelectedTeacher}))
        this.handleShowEdit();
      }

      async AddTeacher () {
        try
        {
          this.setState({Loading : true});
          const result = await adminService.AddTeacher(this.state.TeacherInfo);
          console.log(result);
          
          if(result != false)
          {
            this.handleCloseAdd();
            this.setState({ShowSuccusfulAdd : true});
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
          this.setState({Loading : false});
        }
      }
    
      async DeleteTeacher () {
        try
        {
          this.setState({Loading : true});
          const result = await adminService.DeleteTeacher(this.state.TeacherInfo);
          console.log(result);
          
          if(result != false)
          {
            this.handleCloseDel();
            this.setState({ShowSuccusfulDel : true});
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
          this.setState({Loading : false});
        }
      }
    
      async EditTeacher () {
        try
        {
          this.setState({Loading : true});
          const result = await adminService.EditTeacher(this.state.TeacherInfo);
          
          
          if(result)
          {
            console.log("Succusful");
            this.handleCloseEdit();
            this.setState({ShowSuccusfulEdit : true});
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
          this.setState({Loading : false});
        }
      }
    
      async GetTeachersList(){
        try
        {
            this.setState({Loading : true});
          const TeachersList = await adminService.GetAllTeachers();
          if(TeachersList != false)
          {
            console.log(TeachersList);
            this.setState({Teachers : TeachersList});
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
            this.setState({Loading : false});
        }
      }
    
      async componentDidMount(){
        this.GetTeachersList();
      }

    showCourses = (key) => {
        this.setState({ showCourses: key });
    }

    hideCourses = () => {
        this.setState({ showCourses: null });
    }

    renderTable = () => {
        return (
            (this.state.Loading ? <Spinner animation="border" variant="primary" /> :
            <React.Fragment>
                <thead>
                <tr className="border-b-2 border-pri">
                    <th className="py-2">نام</th>
                    <th>کد ملی</th>
                    <th>دروس مورد تدریس</th>
                    <th></th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {this.state.Teachers.map((teacher) => {
                    return(
                    <tr>
                        <td className="py-3"><a href="#">{teacher.firstName}</a></td>
                        <td>{teacher.melliCode}</td>
                        <td>
                            <div
                                onClick={(e) => e.stopPropagation()}
                                className="flex flex-col justify-center items-center">
                                <div
                                    className={`${this.state.showCourses === 1 ? 'hidden' : 'block'}`}
                                    onClick={() => this.showCourses(1)}>
                                    {courses('6', '4', '#000')}
                                </div>
                                <div
                                    className={`flex flex-col ${this.state.showCourses === 1 ? 'block' : 'hidden'}`}>
                                    <span>فارسی</span>
                                    <span>دینی</span>
                                    <span>علوم</span>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div className="flex flex-row">
                                <a href="#" onClick={() => this.openEditMode(teacher)}>{edit(6, 4)}</a>
                                <a href="#" onClick={() => this.handleShowDel(teacher)}>{remove(6, 4)}</a>
                            </div>
                        </td>
                    </tr>
                    )}
                )}
                </tbody>
            </React.Fragment>
            )
        );
    }

    render() {
        return (
            <div
                className="w-5/6 h-500"
                onClick={() => {this.hideCourses()}}
            >
                <Table
                    title="معلمان"
                    minWidth="600px"
                    table={this.renderTable}
                    options={<a href="#" onClick={() => this.handleShowAdd()}> {add('8', '4', '#000')} </a>}
                />

                {this.state.TeacherInfo && 
                    <React.Fragment> 
                        {/* NewTeacher */}

                        <Modal show={this.state.ShowAdd} onHide={this.handleCloseAdd}>
                            <Modal.Header closeButton>
                            <Modal.Title>اضافه کردن معلم جدید</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                            <Container>
                                {(this.state.Loading ? <Spinner animation="border" variant="primary" /> :
                                <Form.Group>

                                    <Form.Control size="sm" type="text" placeholder="نام" 
                                        id="FirstName" onChange = { e => this.handleInputAddTeacher(e.target.id , e.target.value)}/>
                                    <Form.Control size="sm" type="text" placeholder="نام خانوادگی" 
                                        id="LastName" onChange = { e => this.handleInputAddTeacher(e.target.id , e.target.value)}/>
                                    <Form.Control size="sm" type="text" placeholder="شماره همراه" 
                                        id="PhoneNumber" onChange = { e => this.handleInputAddTeacher(e.target.id , e.target.value)}/>
                                    <Form.Control size="sm" type="text" placeholder="کد ملی" 
                                        id="MelliCode" onChange = { e => this.handleInputAddTeacher(e.target.id , e.target.value)}/>
                                
                                </Form.Group>
                                )}
                            </Container>
                            </Modal.Body>
                            <Modal.Footer>
                            <Button variant="secondary" onClick={() => this.handleCloseAdd()}>
                                بستن
                            </Button>
                            <Button variant="primary" onClick={() => this.AddTeacher()}>
                                تایید
                            </Button>
                            </Modal.Footer>
                        </Modal>

                        <Modal show={this.state.ShowSuccusfulAdd} onHide={this.handleCloseSuccusfulAddS}>
                            <Modal.Header closeButton>
                            <Modal.Title>معلم جدید</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>معلم با موفقیت اضافه شد </Modal.Body>
                            <Modal.Footer>
                            <Button variant="info" onClick={() => this.handleCloseSuccusfulAdd()}>
                                بستن
                            </Button>
                            </Modal.Footer>
                        </Modal>
                    
                        {/* ------------ */}

                        {/* EditTeacher */}

                        <Modal show={this.state.ShowEdit} onHide={this.handleCloseEdit}>
                            <Modal.Header closeButton>
                            <Modal.Title>ویرایش معلم </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                            <Container>
                                {(this.state.Loading ? <Spinner animation="border" variant="primary" /> :
                                <Form.Group>

                                    <Form.Control size="sm" type="text" placeholder="نام" 
                                        id="FirstName" defaultValue={this.state.TeacherInfo.firstName} onChange = { e => this.handleInputAddTeacher(e.target.id , e.target.value)}/>

                                    <Form.Control size="sm" defaultValue={this.state.TeacherInfo.lastName} type="text" placeholder="نام خانوادگی" 
                                        id="LastName" onChange = { e => this.handleInputAddTeacher(e.target.id , e.target.value)}/>

                                    <Form.Control size="sm" defaultValue={this.state.TeacherInfo.phoneNumber} type="text" placeholder="شماره همراه" 
                                        id="PhoneNumber" onChange = { e => this.handleInputAddTeacher(e.target.id , e.target.value)}/>

                                    <Form.Control size="sm" defaultValue={this.state.TeacherInfo.melliCode} type="text" placeholder="کد ملی" 
                                        id="MelliCode" onChange = { e => this.handleInputAddTeacher(e.target.id , e.target.value)}/>
                                
                                </Form.Group>
                                )}
                            </Container>
                            </Modal.Body>
                            <Modal.Footer>
                            <Button variant="secondary" onClick={() => this.handleCloseEdit()}>
                                بستن
                            </Button>
                            <Button variant="primary" onClick={() => this.EditTeacher()}>
                                تایید
                            </Button>
                            </Modal.Footer>
                        </Modal>

                        <Modal show={this.state.ShowSuccusfulEdit} onHide={this.handleCloseEdit}>
                            <Modal.Header closeButton>
                            <Modal.Title>ویرایش معلم</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>معلم با موفقیت ویرایش شد </Modal.Body>
                            <Modal.Footer>
                            <Button variant="info" onClick={() => this.handleCloseSuccusfulEdit()}>
                                بستن
                            </Button>
                            </Modal.Footer>
                        </Modal>
                    
                        {/* ------------ */}
                    </React.Fragment>
                }
            </div>
        );
    }

}

export default Teachers;