import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import history from "../history";
import AuthenticatedRoute from "./AuthenticatedRoute";
import Login from './Login';
import Dashboard from "./dashboard/teacher/Dashboard";
import StudentDashboard from "./dashboard/student/Dashboard";
import ManagerDashboard from './dashboard/admin/Dashboard';
import SignUp from "./signup/SignUp";
import Status from "./Status";
import Parsa from './Parsa';
import NoFound from "./NoFound";
import ShowCourse from "./dashboard/teacher/course/ShowCourse";
import AddTeacher from "./dashboard/teacher/teachers/AddTeacher";
import AddTeacherByExcel from "./dashboard/teacher/teachers/AddTeacherByExcel";
import TeacherInfo from "./dashboard/teacher/teachers/TeacherInfo";
import ShowCat from "./dashboard/teacher/category/ShowCat";
import StudentInfo from "./dashboard/teacher/students/StudentInfo";
import AddStudents from "./dashboard/teacher/students/AddStudents";
import Alert from "./Alert";
import {alert} from "../actions/alerts";
import Confirm from "./dashboard/teacher/home/Confirm";

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
                        <Route path="/parsa" exact component={Parsa} />
                        <AuthenticatedRoute
                            path="/a/dashboard"
                            component={Dashboard}
                            conditions={this.props.authenticated && this.props.userType === 2}
                            exact
                        />
                        <AuthenticatedRoute
                            path="/status"
                            component={Status}
                            conditions={this.props.status}
                            exact
                        />
                        <AuthenticatedRoute
                            path="/cat/:id"
                            component={ShowCat}
                            conditions={this.props.authenticated && this.props.userType === 2}
                            exact
                        />
                        <AuthenticatedRoute
                            path="/course/:id"
                            component={ShowCourse}
                            conditions={this.props.authenticated && this.props.userType === 2}
                            exact
                        />
                        <AuthenticatedRoute
                            path="/teacher/:id"
                            component={TeacherInfo}
                            conditions={this.props.authenticated && this.props.userType === 2}
                            exact
                        />
                        <AuthenticatedRoute
                            path="/addTeacher"
                            component={AddTeacher}
                            conditions={this.props.authenticated && this.props.userType === 2}
                            exact
                        />
                        <AuthenticatedRoute
                            path="/addTeacherByExcel"
                            component={AddTeacherByExcel}
                            conditions={this.props.authenticated && this.props.userType === 2}
                            exact
                        />
                        <AuthenticatedRoute
                            path="/student/:id"
                            component={StudentInfo}
                            conditions={this.props.authenticated && this.props.userType === 2}
                            exact
                        />
                        <AuthenticatedRoute
                            path="/addStudents"
                            component={AddStudents}
                            conditions={this.props.authenticated && this.props.userType === 2}
                            exact
                        />
                        <AuthenticatedRoute
                            path="/confirm/:id"
                            component={Confirm}
                            conditions={this.props.authenticated && this.props.userType === 2}
                            exact
                        />
                        <AuthenticatedRoute
                            path="/s/dashboard"
                            component={StudentDashboard}
                            conditions={this.props.authenticated && this.props.userType === 0}
                            exact
                        />
                        <AuthenticatedRoute
                            path="/m/dashboard"
                            component={ManagerDashboard}
                            conditions={this.props.authenticated && this.props.userType === 2}
                            exact
                        />
                        <Route path="" component={NoFound} />
                    </Switch>
                </Router>
            </div>
        );
    }

}

const mapStateToProps = (state) => {
    const userType = state.auth.userInfo !== null ? state.auth.userInfo.userType : -1;
    return {
        alert: state.alert,
        authenticated: state.auth.isLogged,
        userType: userType,
        status: state.auth.status
    };
}

export default connect(mapStateToProps)(App);