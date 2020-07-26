import React from "react";
import { connect } from 'react-redux';
import Sidebar from "../sidebar/Sidebar";
import { Route } from 'react-router-dom';
import { courses, dashboard, group, teach, teachers } from "../../../assets/icons";
import Home from "./home/Home";
import protectedManager from "../../protectedRoutes/protectedManager";
import SidebarOption from "../sidebar/SidebarOption";
import history from "../../../history";
import Header from "../Header";

class Dashboard extends React.Component {

    state = { showSidebar: false, active: 'dashboard' }

    componentDidMount() {
        if (window.innerWidth > 1280) this.setState({ showSidebar: true })
        this.setState({ active: this.props.location.pathname.split('/')[2] })
    }

    toggle = () => {
        this.setState({ showSidebar: !this.state.showSidebar})
    }

    changePanel = panel => {
        history.push(this.props.match.url + '/' + panel)
    }

    render() {
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
                        title="مقاطع"
                        icon={group}
                        changePanel={this.changePanel}
                        term="categories"
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
                        title="معلمان"
                        icon={teach}
                        changePanel={this.changePanel}
                        term="teachers"
                        active={this.state.active}
                    />

                    <SidebarOption
                        title="دانش آموزان"
                        icon={teachers}
                        changePanel={this.changePanel}
                        term="students"
                        active={this.state.active}
                    />
                </Sidebar>

                <div className="xl:w-5/6 w-full xl:px-8 px-4">
                    <Header user={this.props.user.userInformation} />

                    <Route path={this.props.match.url + "/dashboard"} component={protectedManager(Home)} />
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return { user: state.auth.userInfo }
}

export default connect(mapStateToProps)(Dashboard);