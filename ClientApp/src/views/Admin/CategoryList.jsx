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

class CategoryList extends Component {
  
  constructor (props){
    super(props);
    this.state = {CategoryNames : []};
  }

  async componentDidMount(){
    try
    {
      const Categories = await adminService.GetAllCategory();
      if(Categories != false)
      {
        console.log(Categories);
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

  render() {
    return (
      <div className="content">
        {/* <Grid fluid> */}
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
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.CategoryNames.map((cat) => {
                        return (
                          <tr key={cat.id}>
                            <td>{cat.name}</td>
                            <td><Link to={{
                              pathname : "/Admin/CourseList",
                              CatId : cat.id
                              }}> مشاهده دروس</Link> </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                 : "موجود نیست")}
              />
            </Col>
          
          </Row>
        {/* </Grid> */}
      </div>
    );
  }
}

export {CategoryList};
