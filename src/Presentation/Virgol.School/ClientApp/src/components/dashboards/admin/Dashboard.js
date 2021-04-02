import React from "react";
import { withTranslation } from 'react-i18next';
import { Switch, Route, Redirect } from 'react-router-dom';
import history from "../../../history";
import Sidebar from "../sidebar/Sidebar";
import SidebarCard from "../sidebar/SidebarCard";
import {layout, loading, open_book , users , user , bell, video, home, airplay, message} from "../../../assets/icons";
import Header from "../header/Header";
import Home from "./home/Home";
import Schools from "./schools/Schools";
import News from "./News/News";
import adminTeachers from "./Teachers/adminTeachers";
import adminStudents from "./Students/adminStudents";
import protectedAdmin from "../../protectedRoutes/protectedAdmin";
import { connect } from "react-redux";
import StreamInfo from "../stream/StreamInfo";

class Dashboard extends React.Component {

    state = {loading : false, sidebar: true, active: 'dashboard', showLang: false }

    componentDidMount = async () => {
        this.setState({ active: this.props.location.pathname.split('/')[2] })
        if (window.innerWidth < 1024) this.setState({ sidebar: false })

        // window.$crisp = [];
        // window.CRISP_WEBSITE_ID = "4ede6290-1f82-45d7-81ff-1ea74b2afc00";

        // (function() {
        //     var d = document;
        //     var s = d.createElement("script");

        //     s.src = "https://client.crisp.chat/l.js";
        //     s.async = 1;
        //     d.getElementsByTagName("head")[0].appendChild(s);
        // })();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.active !== this.props.location.pathname.split('/')[2]) {
            this.setState({ active: this.props.location.pathname.split('/')[2] })
            if (window.innerWidth < 1024) {
                this.setState({ sidebar: false })
            }
        }

        window.onresize = () => {
            if(window.innerWidth >= 1024){
                this.setState({sidebar : true})
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
        if (this.state.loading) return loading('tw-w-10 tw-text-grayish centerize')
        return (
            <div onClick={() => this.setState({ showLang: false })} className="tw-w-screen tw-min-h-screen">
                <Sidebar
                    show={this.state.sidebar}
                    toggle={this.toggleSidebar}
                    active={this.state.active}
                    logoTitle={this.props.dashboardInfo.adminDetail  ? this.props.dashboardInfo.adminDetail.schoolsType : -1}
                    title={"ویرگول"}
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
                        code="schools"
                        title={this.props.t('schools')}
                        icon={home}
                        changeActive={this.changeActive}
                    />
                    <SidebarCard
                        active={this.state.active}
                        code="conference"
                        title={this.props.t('conference')}
                        icon={airplay}
                        changeActive={this.changeActive}
                    />
                    <SidebarCard
                        active={this.state.active}
                        code="teachers"
                        title={this.props.t('teachers')}
                        icon={user}
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
                        icon={message}
                        changeActive={this.changeActive}
                    />
                </Sidebar>

                <div className="lg:tw-w-5/6 tw-px-6 tw-w-full tw-min-h-screen tw-bg-bold-blue">
                    <Header showLang={this.state.showLang} setShowLang={this.setShowLang} />

                    <Switch>
                        <Route path={this.props.match.url + "/dashboard"} component={Home}/>
                        <Route path={this.props.match.url + "/teachers"} component={adminTeachers}/>
                        <Route path={this.props.match.url + "/students"} component={adminStudents}/>
                        <Route path={this.props.match.url + "/schools"} component={Schools} />
                        <Route path={this.props.match.url + "/conference"} component={StreamInfo} />
                        <Route path={this.props.match.url + "/news"} component={News} />
                        <Redirect to="/404" />
                    </Switch>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {user: state.auth.userInfo , dashboardInfo: state.adminData.dashboardInfo }
}

const cwrapped = connect(mapStateToProps , {})(protectedAdmin(Dashboard))

export default withTranslation()(cwrapped);
