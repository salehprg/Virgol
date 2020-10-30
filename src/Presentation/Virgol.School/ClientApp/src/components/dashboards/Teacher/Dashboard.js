import React from "react";
import { withTranslation } from 'react-i18next';
import {Switch, Route, Redirect} from 'react-router-dom';
import history from "../../../history";
import protectedTeacher from "../../protectedRoutes/protectedTeacher";
import Sidebar from "../sidebar/Sidebar";
import SidebarCard from "../sidebar/SidebarCard";
import {layout , bell , open_book} from "../../../assets/icons";
import Header from "../header/Header";
import Home from './home/Home'
import Classes from "./classes/ClassSchedule";
import News from "./News";
import MyNews from "./News/News";
import ClassList from "./classes/ClassList";

class TeacherDashboard extends React.Component {

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
                        icon={bell}
                        changeActive={this.changeActive}
                    />
                    <SidebarCard
                        active={this.state.active}
                        code="classes"
                        title={this.props.t('classes')}
                        icon={bell}
                        changeActive={this.changeActive}
                    />
                    {/*<SidebarCard*/}
                    {/*    active={this.state.active}*/}
                    {/*    code="news"*/}
                    {/*    title="اخبار"*/}
                    {/*    icon={open_book}*/}
                    {/*    changeActive={this.changeActive}*/}
                    {/*/>*/}
                    <SidebarCard
                        active={this.state.active}
                        code="myNews"
                        title={this.props.t('studentNews')}
                        icon={open_book}
                        changeActive={this.changeActive}
                    />
                </Sidebar>

                <div className="lg:w-5/6 px-6 w-full min-h-screen bg-bold-blue">
                    <Header showLang={this.state.showLang} setShowLang={this.setShowLang} />

                    <Switch>
                        <Route path={this.props.match.url + "/dashboard"} component={Home}/>
                        <Route path={this.props.match.url + "/schedule"} component={Classes}/>
                        <Route path={this.props.match.url + "/classes"} component={ClassList}/>
                        {/*<Route path={this.props.match.url + "/news"} component={News}/>*/}
                        <Route path={this.props.match.url + "/myNews"} component={MyNews}/>
                        <Redirect to="/404" />
                    </Switch>
                </div>
            </div>
        );
    }

}

export default withTranslation()(protectedTeacher(TeacherDashboard))
