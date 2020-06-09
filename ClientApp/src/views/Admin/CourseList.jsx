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

class CourseList extends Component {
  
  constructor (props){
    super(props);
    this.state = {CourseList : [] , CatId : props.location.CatId};
  }

  async componentDidMount(){
    try
    {
      const Courses = await adminService.GetAllCourseIncat(this.state.CatId);
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
        {/* <Grid fluid> */}
          <Row>
            <Col md={12}>
              <Card
                
                title="دوره های من"
                category="دوره هایی که برای شما فعال میباشد"
                ctTableFullWidth
                ctTableResponsive
                content={(this.state.CourseList ?
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th key="1">نام درس</th>
                        <th key="2">نام معلم </th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.CourseList.map((Course) => {
                        return (
                          <tr key={Course.id}>
                            <td>{Course.shortname}</td>
                            <td>{Course.Grade ? '-' : Course.Grade}</td>
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

export {CourseList};
