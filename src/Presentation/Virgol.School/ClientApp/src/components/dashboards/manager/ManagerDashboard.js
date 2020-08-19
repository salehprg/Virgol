import React from "react";
import { Switch, Route } from 'react-router-dom';
import history from "../../../history";
import protectedManager from "../../protectedRoutes/protectedManager";
import Sidebar from "../sidebar/Sidebar";
import SidebarCard from "../sidebar/SidebarCard";
import {layout, loading, open_book , users , bell} from "../../../assets/icons";
import Header from "../header/Header";
import Home from './home/Home'
import Teachers from "./teachers/Teachers";
import Students from "./students/Students";
import Grades from "./grades/Grades";
import News from "./News/News";

class ManagerDashboard extends React.Component {

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
                    </Switch>
                </div>
            </div>
        );
    }

}

export default protectedManager(ManagerDashboard)
