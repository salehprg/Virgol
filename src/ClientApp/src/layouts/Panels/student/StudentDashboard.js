import React from "react";
import Sidebar from "./Sidebar";
import Table from "../../../components/Table";
import {courses} from "../../../icons";
import {userService} from "../../../_Services/UserServices";

class StudentDashboard extends React.Component {

    constructor (props){
        super(props);
        this.state = {CoursesNames : [] , CatId : props.location.CatId};
      }

    setCategory = (CategoryId) =>{
        this.setState({CatId : CategoryId});
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

    renderCourses = () => {
        return (
            <React.Fragment>
                <thead>
                    <tr className="border-b-2 border-pri">
                        <th className="py-2">نام درس</th>
                        <th>نام معلم</th>
                        <th>نمره</th>
                        <th><a href="#">لینک درس</a></th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.CoursesNames.map((course) => {
                        return (
                            <tr>
                                <td className="py-3">{course.displayname}</td>
                                <td className="py-3">{course.teacherName}</td>
                                <td>{course.Grade ? '-' : course.Grade}</td>
                                <td className="py-3 flex justify-center"><a href={course.courseUrl}>{courses()}</a></td>
                            </tr>
                        );
                    })}
                </tbody>
            </React.Fragment>
        );
    }

    render() {
        return (
            <div className="">
                <Sidebar
                    toggleActive={this.toggleActive}
                    setCategory={this.setCategory}
                />
                <div className="bg-mbg md:w-5/6 w-full min-h-screen">
                    <div className="flex flex-col md:flex-row justify-end items-center mb-12 mr-8 py-4">
                        <span className="text-4xl text-box">داشبورد</span>
                    </div>
                    <div className="flex justify-center items-start w-full min-h-screen">
                        <div className="h-500 w-5/6">
                            <Table
                                title="دروس"
                                minWidth="600px"
                                table={this.renderCourses}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default StudentDashboard;