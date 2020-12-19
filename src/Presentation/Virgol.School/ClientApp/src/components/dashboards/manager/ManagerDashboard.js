import React from "react";
import { withTranslation } from 'react-i18next';
import {Switch, Route, Redirect} from 'react-router-dom';
import history from "../../../history";
import protectedManager from "../../protectedRoutes/protectedManager";
import Sidebar from "../sidebar/Sidebar";
import SidebarCard from "../sidebar/SidebarCard";
import {layout, loading, open_book , users , bell, video} from "../../../assets/icons";
import Header from "../header/Header";
import Home from './home/Home'
import Teachers from "./teachers/Teachers";
import Students from "./students/Students";
import Grades from "./grades/Grades";
import News from "./News/News";
import { connect } from "react-redux";
import Tracker from "./tracker/Tracker";
import Groups from "./groups/Groups";
import StreamInfo from "../stream/StreamInfo";
import Payments from "../../payments/AllPayments"

class ManagerDashboard extends React.Component {

    state = {loading : false, sidebar: true, active: 'dashboard', showLang: false }

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
            if (window.innerWidth < 1024) {
                this.setState({ sidebar: false })
            }
        }
    }

    toggleSidebar = () => {
        this.setState({ sidebar: !this.state.sidebar})
    }

    changeActive = panel => {
        history.push(this.props.match.url + '/' + panel)
    }

    setShowLang = show => {
        this.setState({ showLang: show })
    }

    render() {
        if (this.state.loading) return this.props.t('loading')
        return (
            <div onClick={() => this.setState({ showLang: false })} className="w-screen min-h-screen">
                <Sidebar
                    show={this.state.sidebar}
                    toggle={this.toggleSidebar}
                    active={this.state.active}
                    logoTitle={this.props.dashboardInfo.school  ? this.props.dashboardInfo.school.schoolType : -1}
                    title={(this.props.dashboardInfo && this.props.dashboardInfo.school && this.props.user.userDetail ? 
                        `${this.props.t('school')} ${this.props.user.userDetail.schooltypeName} 
                        ${this.props.dashboardInfo.school.sexuality == 0 ? this.props.t('masculine') : this.props.t('feminine')}  
                        ${this.props.dashboardInfo.school.schoolName}`
                    : null)}
                >
                    <SidebarCard
                        active={this.state.active}
                        code="dashboard"
                        title={this.props.t('dashboard')}
                        icon={layout}
                        changeActive={this.changeActive}
                    />
                    <SidebarCard
                        active={this.state.active}
                        code="bases"
                        title={this.props.t('manageClasses')}
                        icon={bell}
                        changeActive={this.changeActive}
                    />
                    <SidebarCard
                        active={this.state.active}
                        code="groups"
                        title={this.props.t('manageGroups')}
                        icon={bell}
                        changeActive={this.changeActive}
                    />
                    <SidebarCard
                        active={this.state.active}
                        code="tracker"
                        title={this.props.t('virtualClasses')}
                        icon={open_book}
                        changeActive={this.changeActive}
                    />
                    <SidebarCard
                        active={this.state.active}
                        code="teachers"
                        title={this.props.t('teachers')}
                        icon={users}
                        changeActive={this.changeActive}
                    />
                    <SidebarCard
                        active={this.state.active}
                        code="conference"
                        title={this.props.t('conference')}
                        icon={video}
                        changeActive={this.changeActive}
                    />
                    <SidebarCard
                        active={this.state.active}
                        code="students"
                        title={this.props.t('students')}
                        icon={users}
                        changeActive={this.changeActive}
                    />
                    <SidebarCard
                        active={this.state.active}
                        code="news"
                        title={this.props.t('news')}
                        icon={open_book}
                        changeActive={this.changeActive}
                    />
                    <SidebarCard
                        active={this.state.active}
                        code="payments"
                        title={this.props.t('payments')}
                        icon={open_book}
                        changeActive={this.changeActive}
                    />
                </Sidebar>

                <div className="lg:w-5/6 px-6 w-full min-h-screen bg-bold-blue">
                    <Header showLang={this.state.showLang} setShowLang={this.setShowLang} />

                    <Switch>
                        <Route path={this.props.match.url + "/dashboard"} component={Home}/>
                        <Route path={this.props.match.url + "/teachers"} component={Teachers}/>
                        <Route path={this.props.match.url + "/bases"} component={Grades}/>
                        <Route path={this.props.match.url + "/groups"} component={Groups}/>
                        <Route path={this.props.match.url + "/students"} component={Students}/>
                        <Route path={this.props.match.url + "/conference"} component={StreamInfo}/>
                        <Route path={this.props.match.url + "/news"} component={News}/>
                        <Route path={this.props.match.url + "/tracker"} component={Tracker}/>
                        <Route path={this.props.match.url + "/payments"} component={Payments}/>

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

const cwrapped = connect(mapStateToProps)(protectedManager(ManagerDashboard))

export default withTranslation()(cwrapped);