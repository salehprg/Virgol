import React from "react";
import { Switch, Route } from 'react-router-dom';
import history from "../../../history";
import Sidebar from "../sidebar/Sidebar";
import SidebarCard from "../sidebar/SidebarCard";
import {layout, loading, open_book} from "../../../assets/icons";
import Header from "../header/Header";
import Home from "./home/Home";
import Schools from "./schools/Schools";
import adminTeachers from "./Teachers/adminTeachers";
import adminStudents from "./Students/adminStudents";
import { connect } from "react-redux";
import protectedAdmin from "../../protectedRoutes/protectedAdmin";


class Dashboard extends React.Component {

    state = {loading : false, sidebar: true, active: 'dashboard' }

    componentDidMount = async () => {
        this.setState({ active: this.props.location.pathname.split('/')[2] })
        if (window.innerWidth < 1024) this.setState({ sidebar: false })
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
        if (this.state.loading) return loading('w-10 text-grayish centerize')
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
                        title="داشبورد"
                        icon={layout}
                        changeActive={this.changeActive}
                    />
                    <SidebarCard
                        active={this.state.active}
                        code="schools"
                        title="مدارس"
                        icon={open_book}
                        changeActive={this.changeActive}
                    />
                    <SidebarCard
                        active={this.state.active}
                        code="teachers"
                        title="معلم ها"
                        icon={open_book}
                        changeActive={this.changeActive}
                    />
                    <SidebarCard
                        active={this.state.active}
                        code="students"
                        title="دانش آموزان"
                        icon={open_book}
                        changeActive={this.changeActive}
                    />
                </Sidebar>

                <div className="lg:w-5/6 px-6 w-full min-h-screen bg-bold-blue">
                    <Header />

                    <Switch>
                        <Route path={this.props.match.url + "/dashboard"} component={Home}/>
                        <Route path={this.props.match.url + "/teachers"} component={adminTeachers}/>
                        <Route path={this.props.match.url + "/students"} component={adminStudents}/>
                        <Route path={this.props.match.url + "/schools"} component={Schools} />
                    </Switch>
                </div>
            </div>
        );
    }

}

export default Dashboard
