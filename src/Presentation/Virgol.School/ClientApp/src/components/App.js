import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import history from "../history";
import Alert from "./Alert";
import {CLEAR} from "../_actions/alertTypes";
import Working from "./Working";

import Login from "./login/Login";
import LoginSSO from "./login/LoginSSO";
import LogoutSSO from "./login/LogoutSSO";

import AdminDashboard from "./dashboards/admin/Dashboard";
import NoFound from "./NoFound";
import SchoolInfo from './dashboards/admin/schools/SchoolInfo'
import ManagerDashboard from './dashboards/manager/ManagerDashboard';
import AddSchool from './dashboards/admin/schools/addSchool/AddSchool';
import StudentDashboard from './dashboards/student/Dashboard';
import StudentCompleteProfile from './dashboards/student/CompleteProfile';
import TeacherDashboard from './dashboards/Teacher/Dashboard';
import TeacherCompleteProfile from './dashboards/Teacher/CompleteProfile';
import ClassInfo from './dashboards/manager/class/ClassInfo';
import TeacherInfo from './dashboards/manager/teachers/TeacherInfo';
import StudentInfo from './dashboards/manager/students/StudentInfo';
import AddTeacher from "./dashboards/manager/teachers/AddTeacher";
import AddStudent from "./dashboards/manager/students/AddStudent";
import AddNews from './dashboards/admin/News/AddNews';
import NewsInfo from './dashboards/admin/News/NewsInfo';

import AddNewsManager from './dashboards/manager/News/AddNews';
import ManagerNewsInfo from './dashboards/manager/News/NewsInfo';

import AddNewsTeacher from './dashboards/Teacher/News/AddNews';
import TeacherNewsInfo from './dashboards/Teacher/News/NewsInfo';

import MeetingResponse from './MeetingResponse/MeetingResponse';
import ParticipantList from './MeetingResponse/ParticipantList';
import SessionInfo from "./dashboards/Teacher/classes/SessionInfo";
import RecorededSession from './dashboards/recordedSessions/RecordedSessions';
import Copyright from "./Copyright";
import PrivateLogin from './login/PrivateLogin';
import AddGroup from './dashboards/manager/groups/AddGroup';
import Streamer from './dashboards/stream/Streamer';
import EditGroup from './dashboards/manager/groups/EditGroup';
import SessionsList from './dashboards/student/classes/SessionsList';
import EditStream from './dashboards/stream/EditStream';
import Plans from './plans/Plans';

class App extends React.Component {

    componentDidMount() {
        history.listen((location, action) => {
            this.props.dispatch({ type: CLEAR });
        });
        if (process.env.REACT_APP_RAHE_DOOR !== "true") {
            document.title = "سامانه ویرگول";
        } else {
            document.title = "سامانه آموزش از راه دور استان خراسان رضوی";
        }
    }

    fadeAlert = () => {
        this.props.dispatch({ type: CLEAR });
    }

    render() {
        return (
            <div className="font-vr overflow-x-hidden">
                {this.props.alert.message ? <Alert fade={this.fadeAlert} type={this.props.alert.type} message={this.props.alert.message} /> : null}
                {this.props.worker.status ? <Working /> : null}

                {/*<Copyright />*/}
                <Router history={history}>
                    <Switch>
                        <Route path="/" exact component={Login} />
                        <Route path="/SSO" exact component={LogoutSSO} />
                        <Route path="/SSO/:schedulId" exact component={LoginSSO} />
                        <Route path="/PrivateClass/:id" exact component={PrivateLogin} />

                        <Route path="/a" component={AdminDashboard} />  
                        <Route path="/addNews" component={AddNews} />
                        <Route path="/news/:id" component={NewsInfo} />
                        <Route path="/newSchool" component={AddSchool} />
                        <Route path="/school/:id" component={SchoolInfo} />

                        <Route path="/class/:id" component={ClassInfo} />
                        
                        <Route path="/m" component={ManagerDashboard} />
                        <Route path="/addNewsManager" component={AddNewsManager} />
                        <Route path="/managerNews/:id" component={ManagerNewsInfo} />
                        <Route path="/teacher/:id" component={TeacherInfo} />
                        <Route path="/newTeacher" component={AddTeacher} />
                        <Route path="/student/:id" component={StudentInfo} />
                        <Route path="/newStudent" component={AddStudent} />
                        <Route path="/newGroup" component={AddGroup} />
                        <Route path="/editGroup/:id" component={EditGroup} />
                        <Route path="/plans" component={Plans} />
                        
                        <Route path="/s" component={StudentDashboard} />
                        <Route path="/studentCompleteProfile" component={StudentCompleteProfile} />
                        <Route path="/sessionsList/:id" component={SessionsList} />

                        <Route path="/recordedSessions/:id" component={RecorededSession} />

                        <Route path="/t" component={TeacherDashboard} />
                        <Route path="/addNewsTeacher" component={AddNewsTeacher} />
                        <Route path="/teacherNews/:id" component={TeacherNewsInfo} />
                        <Route path="/teacherCompleteProfile" component={TeacherCompleteProfile} />
                        <Route path="/session/:id" component={SessionInfo} />

                        <Route path="/meetingResponse/:id" component={MeetingResponse} />
                        <Route path="/ParticipantInfo/:id" component={ParticipantList} />

                        <Route path="/stream" component={Streamer} />
                        <Route path="/editStream/:id" component={EditStream} />
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
        worker: state.worker
    };
}

export default connect(mapStateToProps)(App);