import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import Sidebar from "../sidebar/Sidebar";
import history from "../../../history";
import Home from "./home/Home";
import SidebarOption from "../sidebar/SidebarOption";
import {bell, calendar, chart, classPlan, courses, dashboard, quizPlan} from "../../../assets/icons";
import Courses from "./courses/Courses";
import protectedStudent from "../../protectedRoutes/protectedStudent";
import Header from "../header/Header";
import Pending from "../Pending";

class Dashboard extends React.Component {

    state = { showSidebar: false, active: 'dashboard' }

    componentDidMount() {
        if (window.innerWidth > 1280) this.setState({ showSidebar: true })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.active !== this.props.location.pathname.split('/')[2]) {
            this.setState({ active: this.props.location.pathname.split('/')[2] })
        }
    }

    toggle = () => {
        this.setState({ showSidebar: !this.state.showSidebar})
    }

    changePanel = panel => {
        history.push(this.props.match.url + '/' + panel)
    }

    render() {
        const { userInformation } = this.props.user
        return (
            <div className="w-screen min-h-screen bg-light-white">
                <Sidebar
                    showSidebar={this.state.showSidebar}
                    toggle={this.toggle}
                    changePanel={this.changePanel}
                    active={this.state.active}
                >
                    <SidebarOption
                        title="داشبورد"
                        icon={dashboard}
                        changePanel={this.changePanel}
                        term="dashboard"
                        active={this.state.active}
                    />

                    <SidebarOption
                        title="دروس"
                        icon={courses}
                        changePanel={this.changePanel}
                        term="courses"
                        active={this.state.active}
                    />

                    <SidebarOption
                        title="گزارش"
                        icon={chart}
                        changePanel={this.changePanel}
                        term="report"
                        active={this.state.active}
                    />

                    <SidebarOption
                        title="برنامه کلاسی"
                        icon={classPlan}
                        changePanel={this.changePanel}
                        term="courseSchedule"
                        active={this.state.active}
                    />

                    <SidebarOption
                        title="برنامه امتحانی"
                        icon={quizPlan}
                        changePanel={this.changePanel}
                        term="examSchedule"
                        active={this.state.active}
                    />

                    <SidebarOption
                        title="تقویم"
                        icon={calendar}
                        changePanel={this.changePanel}
                        term="calendar"
                        active={this.state.active}
                    />
                </Sidebar>

                <div className="xl:w-5/6 w-full xl:px-8 px-4">
                    <Header user={this.props.user.userInformation} />

                    <Switch>
                        <Route path={this.props.match.url  + '/dashboard'} component={protectedStudent(Home)} />
                        <Route path={this.props.match.url  + '/courses'} component={protectedStudent(Courses)} />
                        <Route path={this.props.match.url} component={protectedStudent(Pending)} />
                    </Switch>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        user: state.auth.userInfo
    }
}

const authWrapped = protectedStudent(Dashboard)
export default connect(mapStateToProps)(authWrapped);