import React from "react";
import Table from "../../../components/Table";
import {add, courses} from "../../../icons";
import AddTeacher from "./AddTeacher";
import AddStudents from "./AddStudents";
import { adminService } from "../../../_Services/AdminService";
import { Spinner } from "react-bootstrap";

class Students extends React.Component {

    constructor(props){
        super(props);

        this.state = { Loading : false , Students : []};
    }

    getUsers = async () => {
        this.setState({Loading : true});

        const Students = await adminService.GetAllStudent();
        this.setState({Students : Students});

        this.setState({Loading : false});
    }
    
    async componentDidMount() {
        this.setState({Loading : true})
        await this.getUsers();
        this.setState({Loading : false})
    }

    renderTable = () => {
        return (
            <React.Fragment>
                <thead>
                <tr className="border-b-2 border-pri">
                    <th className="py-2">نام</th>
                    <th>نام خانوادگی</th>
                    <th>کد ملی</th>
                    <th>مقطع</th>
                </tr>
                </thead>
                <tbody>
                {(this.state.Students ?
                    this.state.Students.map((user) => {
                        return (
                        <tr>
                            <td className="py-3"><a href="#">{user.firstName}</a></td>
                            <td>{user.lastName}</td>
                            <td>{user.melliCode}</td>
                            <td>نهم</td>
                        </tr>
                        )
                    })
                :
                    (this.state.Loading ?
                        <Spinner animation="border" variant="primary" />
                    :
                    "لیست دانش آموزان خالی است"
                    )
                )}
                </tbody>
            </React.Fragment>
        );
    }

    render() {
        return (
            <div className="w-full flex md:flex-row flex-col md:justify-evenly items-center">
                <div className="md:w-3/5 w-5/6 h-500 md:order-2 order-1">
                    <Table
                        title="دانش آموزان"
                        minWidth="600px"
                        table={this.renderTable}
                    />
                </div>
                <AddStudents />
            </div>
        );
    }

}

export default Students;