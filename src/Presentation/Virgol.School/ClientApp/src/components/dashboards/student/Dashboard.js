import React from "react";
import { Switch, Route } from 'react-router-dom';
import history from "../../../history";
import Sidebar from "../sidebar/Sidebar";
import SidebarCard from "../sidebar/SidebarCard";
import {layout} from "../../../assets/icons";
import Header from "../header/Header";
import Home from './home/Home'
import Classes from "./classes/Classes";

class StudentDashboard extends React.Component {

    state = {loading : false, sidebar: true, active: 'dashboard' }

    componentDidMount = async () => {
        this.setState({ active: this.props.location.pathname.split('/')[2] })
        if (window.innerWidth < 1024) this.setState({ sidebar: false })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.active !== this.props.location.pathname.split('/')[2]) {
            console.log("wh");
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
                        code="classes"
                        title="برنامه کلاسی"
                        icon={layout}
                        changeActive={this.changeActive}
                    />
                </Sidebar>

                <div className="lg:w-5/6 px-6 w-full min-h-screen bg-bold-blue">
                    <Header />

                    <Switch>
                        <Route path={this.props.match.url + "/dashboard"} component={Home}/>
                        <Route path={this.props.match.url + "/classes"} component={Classes}/>
                    </Switch>
                </div>
            </div>
        );
    }

}

export default StudentDashboard
