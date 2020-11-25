import React from "react";
import { withTranslation } from 'react-i18next';
import {Switch, Route, Redirect} from 'react-router-dom';
import protectedStudent from "../../protectedRoutes/protectedStudent";
import history from "../../../history";
import Sidebar from "../sidebar/Sidebar";
import SidebarCard from "../sidebar/SidebarCard";
import {layout} from "../../../assets/icons";
import Header from "../header/Header";
import Home from './home/Home'
import Classes from "./classes/Classes";
import { connect } from "react-redux";
import ClassList from "./classes/ClassList";

class StudentDashboard extends React.Component {

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
                    logoTitle={this.props.user  ? this.props.user.userDetail.userDetail.school.schoolType : -1}
                    title={this.props.user  ? this.props.user.userDetail.userDetail.school.schoolName : null}
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
                        code="schedule"
                        title={this.props.t('schedule')}
                        icon={layout}
                        changeActive={this.changeActive}
                    />
                    <SidebarCard
                        active={this.state.active}
                        code="classes"
                        title={this.props.t('classes')}
                        icon={layout}
                        changeActive={this.changeActive}
                    />
                </Sidebar>

                <div className="lg:w-5/6 px-6 w-full min-h-screen bg-bold-blue">
                    <Header showLang={this.state.showLang} setShowLang={this.setShowLang} />

                    <Switch>
                        <Route path={this.props.match.url + "/dashboard"} component={Home}/>
                        <Route path={this.props.match.url + "/schedule"} component={Classes}/>
                        <Route path={this.props.match.url + "/classes"} component={ClassList}/>
                        <Redirect to="/404" />
                    </Switch>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {user: state.auth.userInfo  }
}
const cwrapped = connect(mapStateToProps, {})(protectedStudent(StudentDashboard));

export default withTranslation()(cwrapped);
