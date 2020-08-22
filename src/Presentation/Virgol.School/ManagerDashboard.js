import React from "react";
import {Switch, Route, Redirect} from 'react-router-dom';
import history from "./ClientApp/src/history";
import protectedManager from "./ClientApp/src/components/protectedRoutes/protectedManager";
import Sidebar from "./ClientApp/src/components/dashboards/sidebar/Sidebar";
import SidebarCard from "./ClientApp/src/components/dashboards/sidebar/SidebarCard";
import {layout, loading, open_book , users , bell} from "./ClientApp/src/assets/icons";
import Header from "./ClientApp/src/components/dashboards/header/Header";
import Home from './ClientApp/src/components/dashboards/manager/home/Home'
import Teachers from "./ClientApp/src/components/dashboards/manager/teachers/Teachers";
import Students from "./ClientApp/src/components/dashboards/manager/students/Students";
import Grades from "./ClientApp/src/components/dashboards/manager/grades/Grades";
import News from "./ClientApp/src/components/dashboards/manager/News/News";
import { connect } from "react-redux";
import Tracker from "./ClientApp/src/components/dashboards/manager/tracker/Tracker";

class ManagerDashboard extends React.Component {

    state = {loading : false, sidebar: true, active: 'dashboard' }

    componentDidMount = async () => {
        this.setState({ active: this.props.location.pathname.split('/')[2] })
        if (window.innerWidth < 1024) this.setState({ sidebar: false })

        window.$crisp = [];
        window.CRISP_WEBSITE_ID = "4ede6290-1f82-45d7-81ff-1ea74b2afc00";

        (function() {
            var d = document;
            var s = d.createElement("script");

            s.src = "https://client.crisp.chat/l.js";
            s.async = 1;
            d.getElementsByTagName("head")[0].appendChild(s);
        })();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.active !== this.props.location.pathname.split('/')[2]) {
            this.setState({ active: this.props.location.pathname.split('/')[2] })
        }
    }

    toggleSidebar = () => {
        this.setState({ sidebar: !this.state.sidebar})
    }

    changeActive = panel => {
        history.push(this.props.match.url + '/' + panel)
    }

    render() {
        if (this.state.loading) return "درحال بارگذاری اطلاعات"
        return (
            <div className="w-screen min-h-screen">
                <Sidebar
                    show={this.state.sidebar}
                    toggle={this.toggleSidebar}
                    active={this.state.active}
                    title={(this.props.dashboardInfo && this.props.dashboardInfo.school && this.props.user.userDetail ? 
                        `مدرسه ${this.props.user.userDetail.schooltypeName} 
                        ${this.props.dashboardInfo.school.sexuality == 0 ? "دخترانه" : "پسرانه"}  
                        ${this.props.dashboardInfo.school.schoolName}`
                    : null)}
                >
                    <SidebarCard
                        active={this.state.active}
                        code="dashboard"
                        title="پیشخوان"
                        icon={layout}
                        changeActive={this.changeActive}
                    />
                    <SidebarCard
                        active={this.state.active}
                        code="bases"
                        title="مدیریت کلاس"
                        icon={bell}
                        changeActive={this.changeActive}
                    />
                    <SidebarCard
                        active={this.state.active}
                        code="teachers"
                        title="معلمان"
                        icon={users}
                        changeActive={this.changeActive}
                    />
                    <SidebarCard
                        active={this.state.active}
                        code="students"
                        title="دانش آموزان"
                        icon={users}
                        changeActive={this.changeActive}
                    />
                    <SidebarCard
                        active={this.state.active}
                        code="news"
                        title="اخبار من"
                        icon={open_book}
                        changeActive={this.changeActive}
                    />
                </Sidebar>

                <div className="lg:w-5/6 px-6 w-full min-h-screen bg-bold-blue">
                    <Header />

                    <Switch>
                        <Route path={this.props.match.url + "/dashboard"} component={Home}/>
                        <Route path={this.props.match.url + "/teachers"} component={Teachers}/>
                        <Route path={this.props.match.url + "/bases"} component={Grades}/>
                        <Route path={this.props.match.url + "/students"} component={Students}/>
                        <Route path={this.props.match.url + "/news"} component={News}/>
                        <Route path={this.props.match.url + "/bb"} component={Tracker}/>
                        <Redirect to="/404" />
                    </Switch>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {user: state.auth.userInfo , dashboardInfo : state.managerData.dashboardInfo}
}

export default connect(mapStateToProps)(protectedManager(ManagerDashboard))