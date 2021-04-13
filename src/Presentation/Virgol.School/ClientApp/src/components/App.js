import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import history from "../history";
import Alert from "./Alert";
import {CLEAR} from "../_actions/alertTypes";
import Working from "./Working";

import LandingHome from './landing/home'

import Login from "./login/Login";
import LoginSSO from "./login/LoginSSO";
import LogoutSSO from "./login/LogoutSSO";

import AdminDashboard from "./dashboards/admin/Dashboard";
import NoFound from "./NoFound";
import SchoolInfo from './dashboards/admin/schools/SchoolInfo'
import CoManagerDashboard from './dashboards/comanager/CoManagerDashboard';
import AddCoManager from './dashboards/manager/CoManagers/AddCoManager';
import EditCoManager from './dashboards/manager/CoManagers/CoManagerInfo';

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

import AddNewsCoManager from './dashboards/comanager/News/AddNews'
import CoManagerNewsInfo from './dashboards/comanager/News/NewsInfo';

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
import PaymentDetail from './plans/PaymentDetail'
import { localizer } from '../assets/localizer';
import  AddExtraLesson from './dashboards/manager/ExtraLesson/AddExtraLesson'

import CacheBuster from './CacheBuster'
import PrincipalGuide from './dashboards/videos/PrincipalGuide';
import TeacherGuide from './dashboards/videos/TeacherGuide';
import StudentGuide from './dashboards/videos/StudentGuide';
import GuideMenu from './dashboards/videos/GuideMenu';

class App extends React.Component {

    
    componentDidMount() {
        const ele = document.getElementById('loading')
      if(ele){
        // fade out
        ele.classList.add('available')
        ele.outerHTML = ''
        // setTimeout(() => {
        //   // remove from DOM
        //   ele.outerHTML = ''
        // }, 2000)
      }
      
        history.listen((location, action) => {
            this.props.dispatch({ type: CLEAR });
        });
        // if (process.env.REACT_APP_RAHE_DOOR !== "true") {
        //     document.title = "سامانه ویرگول";
        // } else {
        //     document.title = "سامانه آموزش از راه دور استان خراسان رضوی";
        // }
        // const _desc = "Test ";
        const url = window.location.href;
        document.title = localizer.getTitle(url);
        localizer.setFavIcon(url);
        // document.querySelector('meta[name="og:title"]').setAttribute(localizer.getTitle(), _desc);
        // document.querySelector('meta[name="og:site_name"]').setAttribute(localizer.getTitle(), _desc);
        // document.querySelector('meta[name="og:image"]').setAttribute(`%PUBLIC_URL%${localizer.getLogo()}`, _desc);
        // document.querySelector('meta[name="description"]').setAttribute(localizer.getTitle(), _desc);
        
    }

    fadeAlert = () => {
        this.props.dispatch({ type: CLEAR });
    }

    render() {
        return(
            
            <CacheBuster>
                {({ loading, isLatestVersion, refreshCacheAndReload }) => {
                    if (loading) return null;
                    if (!loading && !isLatestVersion) 
                    {
                        // You can decide how and when you want to force reload
                        refreshCacheAndReload();
                    }
                    return (
                        <div className="tw-font-vr tw-overflow-x-hidden">
                            {this.props.alert.message ? <Alert fade={this.fadeAlert} type={this.props.alert.type} message={this.props.alert.message} /> : null}
                            {/* {this.props.worker.status ? <Working /> : null} */}

                            <Router history={history}>
                                <Switch>
                                    <Route path="/landing" exact component={LandingHome}/>

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

                                    <Route path="/video/principal-guide-pr" component={PrincipalGuide}/>
                                    <Route path="/video/teacher-guide-pr" component={TeacherGuide}/>
                                    <Route path="/video/student-guide-pr" component={StudentGuide}/>
                                    <Route path="/video/guide-pr" component={GuideMenu}/>
                                    
                                    <Route path="/m" component={ManagerDashboard} />
                                    <Route path="/c/:id" component={EditCoManager} />
                                    <Route path="/newCoManager" component={AddCoManager} />
                                    <Route path="/addNewsManager" component={AddNewsManager} />
                                    <Route path="/managerNews/:id" component={ManagerNewsInfo} />
                                    <Route path="/teacher/:id" component={TeacherInfo} />
                                    <Route path="/newTeacher" component={AddTeacher} />
                                    <Route path="/student/:id" component={StudentInfo} />
                                    <Route path="/newStudent" component={AddStudent} />
                                    <Route path="/newGroup" component={AddGroup} />
                                    <Route path="/addExtraLesson" component={AddExtraLesson} />

                                    <Route path="/CoManager" component={CoManagerDashboard} />
                                    <Route path="/CoManagerAddNews" component={AddNewsCoManager} />
                                    <Route path="/CoManager/News/:id" component={CoManagerNewsInfo} />
                                    
                                    <Route path="/teacher/:id" component={TeacherInfo} />
                                    <Route path="/student/:id" component={StudentInfo} />

                                    <Route path="/editGroup/:id" component={EditGroup} />
                                    <Route path="/plans" component={Plans} />
                                    <Route path="/paymentDetail/:paymentId" component={PaymentDetail} />
                                    
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
                                    {/* <Route path="" component={NoFound} /> */}
                                </Switch>
                            </Router>
                        </div>       
                    );
                }}
            </CacheBuster>
        )
    }

}

const mapStateToProps = (state) => {
    return {
        alert: state.alert,
        worker: state.worker
    };
}

export default connect(mapStateToProps)(App);