import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import history from "../history";
import {alert} from "../_actions/alerts";
import protectedManager from "./protectedRoutes/protectedManager";
import protectedStatus from "./protectedRoutes/protectedStatus";
import protectedStudent from "./protectedRoutes/protectedStudent";
import protectedAdmin from "./protectedRoutes/protectedAdmin";
import Alert from "./Alert";
import Login from './login/Login';
import SignUp from "./signup/SignUp";
import Status from "./status/Status";
import NoFound from "./NoFound";
import ManagerDashboard from "./dashboard/manager/Dashboard";
import ShowCourse from "./dashboard/manager/course/ShowCourse";
import AddTeacher from "./dashboard/manager/teachers/AddTeacher";
import AddTeacherByExcel from "./dashboard/manager/teachers/AddTeacherByExcel";
import TeacherInfo from "./dashboard/manager/teachers/TeacherInfo";
import ShowCat from "./dashboard/manager/category/ShowCat";
import StudentInfo from "./dashboard/manager/students/StudentInfo";
import AddStudents from "./dashboard/manager/students/AddStudents";
import Confirm from "./dashboard/manager/home/Confirm";
import StudentDashboard from "./dashboard/student/Dashboard";
import AdminDashboard from './dashboard/admin/Dashboard';
import Loading from "./Loading";

class App extends React.Component {

    componentDidMount() {

        const { dispatch } = this.props;
        history.listen((location, action) => {
            dispatch(alert.clear());
        });

    }

    fadeAlert = () => {
        this.props.dispatch(alert.clear())
    }

    render() {
        return (
            <div className="font-vr">
                {this.props.alert.message ? <Alert fade={this.fadeAlert} type={this.props.alert.type} message={this.props.alert.message} /> : null}
                <Router history={history}>
                    <Switch>
                        <Route path="/" exact component={Login} />
                        <Route path="/SignUp" exact component={SignUp} />
                        <Route path="/status" exact component={protectedStatus(Status)} />
                        <Route path="/m" component={protectedManager(ManagerDashboard)} />
                        <Route path="/s" component={protectedStudent(StudentDashboard)} />
                        <Route path="" component={NoFound} />
                    </Switch>
                    {/*<Switch>*/}
                    {/*    <Route path="/" exact component={Login} />*/}
                    {/*    <Route path="/SignUp" exact component={SignUp} />*/}
                    {/*    <Route path="/status" exact component={protectedStatus(Status)} />*/}

                    {/*    <Route path="/m/dashboard" exact component={protectedManager(ManagerDashboard)} />*/}
                    {/*    <Route path="/m/cat/:id" exact component={protectedManager(ShowCat)} />*/}
                    {/*    <Route path="/m/course/:id" exact component={protectedManager(ShowCourse)} />*/}
                    {/*    <Route path="/m/teacher/:id" exact component={protectedManager(TeacherInfo)} />*/}
                    {/*    <Route path="/m/addTeacher" exact component={protectedManager(AddTeacher)} />*/}
                    {/*    <Route path="/m/addTeacherByExcel" exact component={protectedManager(AddTeacherByExcel)} />*/}
                    {/*    <Route path="/m/student/:id" exact component={protectedManager(StudentInfo)} />*/}
                    {/*    <Route path="/m/addStudents" exact component={protectedManager(AddStudents)} />*/}
                    {/*    <Route path="/m/confirm/:id" exact component={protectedManager(Confirm)} />*/}

                    {/*    <Route path="/s/dashboard" exact component={protectedStudent(StudentDashboard)} />*/}

                    {/*    <Route path="/a/dashboard" exact component={protectedAdmin(AdminDashboard)} />*/}

                    {/*    <Route path="" component={NoFound} />*/}
                    {/*</Switch>*/}
                </Router>
            </div>
        );
    }

}

const mapStateToProps = (state) => {
    return {
        alert: state.alert
    };
}

export default connect(mapStateToProps)(App);