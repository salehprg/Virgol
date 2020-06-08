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
import {userService} from '../_Services/UserServices'
import Card from "components/Card/Card.jsx";
import { thArray, tdArray } from "variables/Variables.jsx";
import { Link } from "react-router-dom";

class UserCourse extends Component {
  
  constructor (props){
    super(props);
    this.state = {CoursesNames : [] , CatId : props.location.CatId};
  }

  async componentDidMount(){
    try
    {
      const Courses = await userService.GetCourseIncategory(this.state.CatId);
      if(Courses != false)
      {
        this.setState({CoursesNames : Courses});
      }
      else
      {
        this.props.location.pathname = "/Users";
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
                
                title="کلاس های من"
                category="کلاس هایی که برای شما فعال میباشد"
                ctTableFullWidth
                ctTableResponsive
                content={(this.state.CoursesNames ?
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th key="1">نام درس </th>
                        <th key="2">نمره </th>
                        <th key="3">معلم </th>
                        <th key="4"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.CoursesNames.map((course) => {
                        return (
                          <tr key={course.id}>
                            <td>{course.displayname}</td>
                            <td>{course.Grade ? '-' : course.Grade}</td>
                            <td>{course.id}</td>
                            <td><a href={course.courseUrl}> شرکت در کلاس</a> </td>
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

export {UserCourse};
