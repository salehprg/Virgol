import React from "react";
import Table from "../../../components/Table";
import {add, edit, list, remove} from "../../../icons";
import { Modal, Button, Spinner, Container } from "react-bootstrap";
import {adminService} from '../../../_Services/AdminService'
import { Link } from "react-router-dom";
import { TextField } from "@material-ui/core";

class Bases extends React.Component {

    constructor (props){
        super(props);
        this.state = {Loading : false , ShowSuccusfulAdd : false , ShowSuccusfulDel : false
                                      , ShowAdd : false 
                                      , ShowDel : false 
                                      , IsEdit : false
                                      , CategoryNames : null , CategoryInfo : {id : 0 , name : ""}};
    
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
                              && this.setState({IsEdit : true , CategoryInfo : {id : SelectedCategory.id , name : SelectedCategory.name}})
                              ) 
        )
      }
      closeEditMode = () =>{
        this.setState({IsEdit : false , CategoryInfo : {id : 0 , name : ""}})
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
          this.setState({CategoryNames : null});
          this.setState({Loading : true});
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
        finally
        {
            this.setState({Loading : false});
        }
      }
    
      async componentDidMount(){
        this.GetCategories();
      }

    renderTable = () => {
        return (
            (this.state.Loading ? <Spinner animation="border" variant="primary" /> :
            this.state.CategoryNames ?
            <React.Fragment>
                <thead>
                    <tr className="border-b-2 border-pri">
                        <th className="py-2">نام مقطع</th>
                        <th>لینک نمایش دروس</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.CategoryNames.map((cat) => {
                        return (
                          <tr key={cat.id}>
                            {(this.state.CategoryInfo.id == cat.id && this.state.IsEdit ?
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
                                <td className="py-3">{cat.name}</td>
                                <td className="flex justify-center" >
                                    <a href="#" onClick={() => this.props.setInParent(cat , "courses")}>{list(10, 6)}</a>
                                </td>
                                <td>
                                    <div className="flex flex-row">
                                        <a href="#" onClick={() => this.openEditMode(cat)}>{edit(6, 4)}</a>
                                        <a href="#" onClick={() => this.handleShowDel(cat)}>{remove(6, 4)}</a>
                                    </div> 
                                </td>
                              </React.Fragment>
                            )}
                          </tr>
                        );
                      })}   
                </tbody>
            </React.Fragment>
            :
            "مقطع تحصیلی موجود نمی باشد"
            )
        );
    }

    render() {
        return (
            <div className="w-5/6 h-500">
                <Table
                    title="مقاطع تحصیلی"
                    minWidth="600px"
                    table={this.renderTable}
                    options={<a href="#"onClick={() => this.handleShowAdd()}> {add('8', '4', '#000')} </a>}
                />
            
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

export default Bases;