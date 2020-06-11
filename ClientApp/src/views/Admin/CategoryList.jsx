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
import { Grid, Row, Col, Table, Container, Modal, Button, Spinner, Form } from "react-bootstrap";
import {adminService} from '../../_Services/AdminService'
import Card from "components/Card/Card.jsx";
import { Link } from "react-router-dom";
import { TextField, Input } from "@material-ui/core";

class CategoryList extends Component {
  
  constructor (props){
    super(props);
    this.state = {Loading : false , ShowSuccusfulAdd : false , ShowSuccusfulDel : false
                                  , ShowAdd : false 
                                  , ShowDel : false 
                                  , CategoryNames : [] , CategoryInfo : {id : 0 , name : ""}};

    this.handleShowDel = this.handleShowDel.bind(this);
  }

  handleShowAdd = () => this.setState({ShowAdd : true})
  handleCloseAdd = () => this.setState({ShowAdd : false})
  handleCloseSuccusfulAdd = () => {
    this.setState({ShowSuccusfulAdd : false})
    this.setState({CategoryInfo : {id : 0 , name : ""}})
    this.GetCategories();
  }

  handleShowDel = (Category) => {
    this.setState({ShowDel : true});
    (Category && this.setState({CategoryInfo : {id : Category.id , name : Category.name}}))

  }
  handleCloseDel = () => this.setState({ShowDel : false})
  handleCloseSuccusfulDel = () => {
    this.setState({ShowSuccusfulDel : false})
    this.GetCategories();
  }


  openEditMode = (SelectedCategory) => {
    (SelectedCategory != null &&
      (this.state.CategoryInfo.id != SelectedCategory.id 
                          && this.setState({CategoryInfo : {id : SelectedCategory.id , name : SelectedCategory.name}})) 
    )
  }
  closeEditMode = () =>{
    this.setState({CategoryInfo : {id : 0 , name : ""}})
  }

  handlEditField = (e) =>{
    console.log(e.target.value);
    let CatId = this.state.CategoryInfo.id;

    this.setState(
        { 
          CategoryInfo : {id : CatId , name : e.target.value}
        }
      )
  }

  async AddCategory () {
    try
    {
      this.setState({Loading : true});
      const result = await adminService.AddCategory(this.state.CategoryInfo);
      console.log(result);
      
      if(result != false)
      {
        this.handleCloseAdd();
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
      this.setState({Loading : false});
    }
  }

  async DeleteCategory () {
    try
    {
      this.setState({Loading : true});
      const result = await adminService.DeleteCategory(this.state.CategoryInfo);
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

  async EditCategory () {
    try
    {
      this.setState({Loading : true});
      const result = await adminService.EditCategory(this.state.CategoryInfo);
      console.log(result);
      
      if(result != false)
      {
        this.closeEditMode();
        this.GetCategories();
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

  async GetCategories(){
    try
    {
      const Categories = await adminService.GetAllCategory();
      if(Categories != false)
      {
        this.setState({CategoryNames : Categories});
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

  async componentDidMount(){
    this.GetCategories();
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
                title="لیست مقاطع تحصیلی"
                category="مقاطع تحصیلی"
                ctTableFullWidth
                ctTableResponsive
                content={(this.state.CategoryNames ?
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th key="1">نام مقطع </th>
                        <th key="4"></th>
                        <th key="5"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.CategoryNames.map((cat) => {
                        return (
                          <tr key={cat.id}>
                            {(this.state.CategoryInfo.id == cat.id ?
                              <React.Fragment>
                                <td>
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        name="CatName"
                                        label="نام"
                                        id="Name"
                                        autoComplete="CategoryName"
                                        defaultValue={this.state.CategoryInfo.name}
                                        onChange = {e => this.handlEditField(e)}
                                        />
                                </td>
                                <td><Button variant="primary" onClick={() => this.EditCategory()}> تایید</Button> </td>
                                <td><Button variant="danger" onClick={() => this.closeEditMode()}> بستن</Button> </td>
                              </React.Fragment>                              
                              : 
                              <React.Fragment>
                                <td onClick={() => this.openEditMode(cat)}>{cat.name}</td>
                                <td><Link to={{
                                  pathname : "/Admin/CourseList",
                                  Category : cat
                                  }}> مشاهده دروس</Link> </td>
                                <td><Button variant="danger" onClick={() => this.handleShowDel(cat)}> حذف</Button></td>
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


 {/* NewCategory */}

          <Modal show={this.state.ShowAdd} onHide={this.handleCloseAdd}>
            <Modal.Header closeButton>
              <Modal.Title>اضافه کردن مقطع جدید</Modal.Title>
            </Modal.Header>
            <Modal.Body>
             <Container>
                {(this.state.Loading ? <Spinner animation="border" variant="primary" /> :
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="CatName"
                  label="نام"
                  id="Name"
                  autoComplete="CategoryName"
                  onChange = { e => this.setState({CategoryInfo : { Name : e.target.value }})}
                />
                )}
             </Container>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => this.handleCloseAdd()}>
                بستن
              </Button>
              <Button variant="primary" onClick={() => this.AddCategory()}>
                تایید
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal show={this.state.ShowSuccusfulAdd} onHide={this.handleCloseSuccusfulAdd}>
            <Modal.Header closeButton>
              <Modal.Title>مقطع جدید</Modal.Title>
            </Modal.Header>
            <Modal.Body>مقطع {this.state.CategoryInfo.Name} با موفقیت اضافه شد </Modal.Body>
            <Modal.Footer>
              <Button variant="info" onClick={() => this.handleCloseSuccusfulAdd()}>
                بستن
              </Button>
            </Modal.Footer>
          </Modal>
      
 {/* ------------ */}

  {/* DeleteCategory */}
 
      <Modal show={this.state.ShowDel} onHide={this.handleCloseDel}>
            <Modal.Header closeButton>
              <Modal.Title>آیا از حذف کردن مقطع {this.state.CategoryInfo.Name} مطمعن هستید ؟ </Modal.Title>
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
              <Button variant="primary" onClick={() => this.DeleteCategory()}>
                تایید
              </Button>
            </Modal.Footer>
          </Modal>

      <Modal show={this.state.ShowSuccusfulDel} onHide={this.handleCloseSuccusfulDel}>
            <Modal.Header closeButton>
              <Modal.Title>مقطع جدید</Modal.Title>
            </Modal.Header>
            <Modal.Body>مقطع {this.state.CategoryInfo.Name} با موفقیت حذف شد </Modal.Body>
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

export {CategoryList};
