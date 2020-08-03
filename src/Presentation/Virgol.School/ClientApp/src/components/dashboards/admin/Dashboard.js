import React from "react";
import { Switch, Route } from 'react-router-dom';
import history from "../../../history";
import Sidebar from "../sidebar/Sidebar";
import SidebarCard from "../sidebar/SidebarCard";
import {layout, open_book} from "../../../assets/icons";
import Header from "../header/Header";
import Home from "./home/Home";
import Schools from "./schools/Schools";

class Dashboard extends React.Component {

    state = { sidebar: true, active: 'dashboard' }

    componentDidMount() {
        if (window.innerWidth < 1024) this.setState({ sidebar: false })
        if (this.props.history.action === 'POP') {
            // api calls
        }
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
                </Sidebar>

                <div className="lg:w-5/6 px-6 w-full min-h-screen bg-bold-blue">
                    <Header />

                    <Switch>
                        <Route path={this.props.match.url + "/dashboard"} component={Home} />
                        <Route path={this.props.match.url + "/schools"} component={Schools} />
                    </Switch>
                </div>
            </div>
        );
    }

}

export default Dashboard;