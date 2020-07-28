import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import history from "../history";
import {alert} from "../_actions/alerts";
import Alert from "./Alert";
import Login from './login/Login';
import SignUp from "./signup/SignUp";
import Status from "./status/Status";
import NoFound from "./NoFound";
import ManagerDashboard from "./dashboard/manager/Dashboard";
import StudentDashboard from "./dashboard/student/Dashboard";
import Working from "./Working";
import CategoryInfo from "./dashboard/manager/category/CategoryInfo";
import ShowCourse from "./dashboard/manager/course/ShowCourse";
import TeacherInfo from "./dashboard/manager/teachers/TeacherInfo";
import StudentInfo from "./dashboard/manager/students/StudentInfo";
import Confirm from "./dashboard/manager/home/Confirm";
import AddTeacher from "./dashboard/manager/teachers/AddTeacher";
import AddTeacherByExcel from "./dashboard/manager/teachers/AddTeacherByExcel";

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
            <div className="font-vr overflow-x-hidden">
                {this.props.alert.message ? <Alert fade={this.fadeAlert} type={this.props.alert.type} message={this.props.alert.message} /> : null}
                {this.props.working ? <Working /> : null}
                <Router history={history}>
                    <Switch>
                        <Route path="/" exact component={Login} />
                        <Route path="/SignUp" exact component={SignUp} />
                        <Route path="/status" exact component={Status} />
                        <Route path="/m" component={ManagerDashboard} />
                        <Route path="/category/:id" component={CategoryInfo} />
                        <Route path="/course/:id" component={ShowCourse} />
                        <Route path="/teacher/:id" component={TeacherInfo} />
                        <Route path="/student/:id" component={StudentInfo} />
                        <Route path="/confirm/:id" component={Confirm} />
                        <Route path="/addTeacher" component={AddTeacher} />
                        <Route path="/addTeacherByExcel" component={AddTeacherByExcel} />
                        <Route path="/s" component={StudentDashboard} />
                        <Route path="" component={NoFound} />
                    </Switch>
                </Router>
            </div>
        );
    }

}

const mapStateToProps = (state) => {
    return {
        alert: state.alert,
        working: state.worker.working
    };
}

export default connect(mapStateToProps)(App);