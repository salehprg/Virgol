
import React, { Component } from "react";
import { Grid, Row, Col, Table, Button, Modal, Container, Spinner } from "react-bootstrap";
import {adminService} from '../../_Services/AdminService'
import Card from "components/Card/Card.jsx";
import { Link } from "react-router-dom";
import { TextField, InputLabel, Select, MenuItem , FormControl } from "@material-ui/core";

class CourseList extends Component {
  
  constructor (props){
    super(props);
    this.state = {CourseList : [] , CatInfo : props.location.Category , 
                  Loading : false , ShowSuccusfulAdd : false , ShowSuccusfulDel : false
                  , ShowAdd : false 
                  , ShowDel : false 
                  , CourseInfo : {id : 0 , displayname : "" , shortname : "" , TeacherName : "" , TeacherId : 0 , categoryId : props.location.Category.id }
                  , Teachers : []};

    this.handleShowDel = this.handleShowDel.bind(this);
  }

  async componentDidMount(){
    this.GetCourses();
  }

  emptyCourseInfo = () => {
    this.setState({CourseInfo : {id : 0 , displayname : "" , shortname : "" , TeacherName : "" , TeacherId : 0 , categoryId : this.state.CatInfo.id }})
  }

  handleShowAdd = async () => {
    this.setState({ShowAdd : true})
    const Teachers = await adminService.GetAllTeachers();

    this.setState({Teachers : Teachers});
  }
  handleCloseAdd = () => this.setState({ShowAdd : false})
  handleCloseSuccusfulAdd = () => {
    this.setState({ShowSuccusfulAdd : false})
    this.emptyCourseInfo();
    this.GetCourses();
  }

  handleShowDel = (Course) => {
    this.setState({ShowDel : true});
    (Course && this.setState({CourseInfo : Course}))
  }
  handleCloseDel = () => this.setState({ShowDel : false})
  handleCloseSuccusfulDel = () => {
    this.setState({ShowSuccusfulDel : false})
    this.GetCourses();
  }


  openEditMode = (SelectedCourse) => {
    (SelectedCourse != null &&
      (this.state.CourseInfo.id != SelectedCourse.id 
                          && this.setState({CourseInfo : SelectedCourse})) 
    )
  }
  closeEditMode = () =>{
    this.emptyCourseInfo();
  }

  handlEditField = (e) =>{
    console.log(e.target.value);
    let value = e.target.value;

    this.setState(prevState => ({
      CourseInfo : { 
        ...prevState.CourseInfo , shortname : value
      }
    }))
  }

  handleAddCourse = (property , value) =>{
    this.setState(prevState => ({
      CourseInfo : { 
        ...prevState.CourseInfo , [property] : value
      }
    }))
  }

  async AddCourse () {
    try
    {
      this.setState({Loading : true});
      const result = await adminService.AddCourse(this.state.CourseInfo);
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

  async DeleteCourse () {
    try
    {
      this.setState({Loading : true});
      const result = await adminService.DeleteCourse(this.state.CourseInfo);
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

  async EditCourse () {
    try
    {
      this.setState({Loading : true});
      const result = await adminService.EditCourse(this.state.CourseInfo);
      console.log(result);
      
      if(result != false)
      {
        this.closeEditMode();
        this.GetCourses();
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

  async GetCourses(){
    try
    {
      const Courses = await adminService.GetAllCourseInCat((this.state.CatInfo != null ? this.state.CatInfo.id : -1));
      if(Courses != false)
      {
        console.log(Courses);
        this.setState({CourseList : Courses});
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
        <Row>
          <Col md={"6"}>
              <Button variant="success" onClick={() => this.handleShowAdd()}>
                +
              </Button>
          </Col>
        </Row>

          <Row>
            <Col md={12}>
              <Card  
                title={(this.state.CatInfo != null ? " لیست دروس مقطع " + this.state.CatInfo.name : "لیست دروس")}
                category="مقاطع تحصیلی"
                ctTableFullWidth
                ctTableResponsive
                content={(this.state.CourseList ?
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th key="1">نام درس </th>
                        <th key="4">نام معلم</th>
                        <th key="5"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.CourseList.map((Course) => {
                        return (
                          <tr key={Course.id}>
                            {(this.state.CourseInfo.id == Course.id ?
                              <React.Fragment>
                                <td>
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        name="CourseName"
                                        label="نام"
                                        id="Name"
                                        autoComplete="CourseName"
                                        defaultValue={this.state.CourseInfo.shortname}
                                        onChange = {e => this.handlEditField(e)}
                                        />
                                </td>
                                <td><Button variant="primary" onClick={() => this.EditCourse()}> تایید</Button> </td>
                                <td><Button variant="danger" onClick={() => this.closeEditMode()}> بستن</Button> </td>
                              </React.Fragment>                              
                              : 
                              <React.Fragment>
                                <td onClick={() => this.openEditMode(Course)}>{Course.displayname}</td>
                                <td>{Course.TeacherName}</td>
                                <td><Button variant="danger" onClick={() => this.handleShowDel(Course)}> حذف</Button></td>
                              </React.Fragment>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                 : "موجود نیست")}
              />
            </Col>
          </Row>


 {/* NewCourse */}

          <Modal show={this.state.ShowAdd} onHide={this.handleCloseDel}>
            <Modal.Header closeButton>
              <Modal.Title>اضافه کردن درس جدید</Modal.Title>
            </Modal.Header>
            <Modal.Body>
             <Container>
                {(this.state.Loading ? <Spinner animation="border" variant="primary" /> :
                <React.Fragment>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    name="CatName"
                    label="نام درس"
                    id="shortname"
                    autoComplete="CourseName"
                    onChange = { e => this.handleAddCourse(e.target.id , e.target.value)}
                  />
                  {(this.state.Teachers != null ? 
                    <FormControl className="col-12">
                      <InputLabel id="CategoryList">نام معلم</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="TeacherId"
                        value={this.state.CourseInfo.TeacherId}
                        onChange={e => (this.handleAddCourse("TeacherId" , e.target.value))}
                      >
                      {this.state.Teachers.map((teacher) => {
                        return (
                        <MenuItem value={teacher.id}>{teacher.firstName} {teacher.lastName}</MenuItem>
                        )
                      })}
                      </Select>
                    </FormControl>
                  
                  :
                  "درحال بارگذاری...."
                  )}
                </React.Fragment>
                )}
             </Container>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => this.handleCloseAdd()}>
                بستن
              </Button>
              <Button variant="primary" onClick={() => this.AddCourse()}>
                تایید
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal show={this.state.ShowSuccusfulAdd} onHide={this.handleCloseSuccusfulDel}>
            <Modal.Header closeButton>
              <Modal.Title>مقطع جدید</Modal.Title>
            </Modal.Header>
            <Modal.Body>مقطع {this.state.CourseInfo.Name} با موفقیت اضافه شد </Modal.Body>
            <Modal.Footer>
              <Button variant="info" onClick={() => this.handleCloseSuccusfulAdd()}>
                بستن
              </Button>
            </Modal.Footer>
          </Modal>
      
 {/* ------------ */}

  {/* DeleteCourse */}
 
      <Modal show={this.state.ShowDel} onHide={this.handleCloseDel}>
            <Modal.Header closeButton>
              <Modal.Title>آیا از حذف کردن مقطع {this.state.CourseInfo.Name} مطمعن هستید ؟ </Modal.Title>
            </Modal.Header>
            <Modal.Body>
             <Container>
                {(this.state.Loading && <Spinner animation="border" variant="primary" />)}
              </Container>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => this.handleCloseDel()}>
                بستن
              </Button>
              <Button variant="primary" onClick={() => this.DeleteCourse()}>
                تایید
              </Button>
            </Modal.Footer>
          </Modal>

      <Modal show={this.state.ShowSuccusfulDel} onHide={this.handleCloseSuccusfulDel}>
            <Modal.Header closeButton>
              <Modal.Title>مقطع جدید</Modal.Title>
            </Modal.Header>
            <Modal.Body>مقطع {this.state.CourseInfo.Name} با موفقیت حذف شد </Modal.Body>
            <Modal.Footer>
              <Button variant="info" onClick={() => this.handleCloseSuccusfulDel()}>
                بستن
              </Button>
            </Modal.Footer>
          </Modal>
      
 {/* ------------ */}


      </div>
    );
  }
}
export {CourseList};
