import React from "react";
import Sidebar from "../Sidebar";
import {clear, headline} from "../../../assets/icons";
import Home from "./Home";
import Base from "./category/Base";
import Course from "./course/Course";
import Teachers from './teachers/Teachers';
import Students from "./students/Students";

class Dashboard extends React.Component {

    state = { sidebarIsActive: false, activePanel: 'home' }

    componentDidMount() {
        if (window.innerWidth > 768) {
            this.setState({ sidebarIsActive: true})
        }
    }

    onActivePanelChange = (active) => {
        this.setState({ activePanel: active })
        if (window.innerWidth < 768) {
            this.setState({ sidebarIsActive: false})
        }
    }

    toggleSidebar = () => {
        this.setState({ sidebarIsActive: !this.state.sidebarIsActive })
    }

    renderSidebarIcon = () => {
        if (this.state.sidebarIsActive) {
            return clear('w-8 h-8 text-white test cursor-pointer');
        } else {
            return headline('w-8 h-8 text-dark-green test cursor-pointer');
        }
    }

    renderPanel = () => {
        switch (this.state.activePanel) {
            case "home": return <Home />
            case "base": return <Base />
            case "course": return <Course />
            case "teacher": return <Teachers />
            case "student": return <Students />
        }
    }

    render() {
        return (
            <div className="bg-light-white min-h-screen flex md:flex-row flex-col">
                <div className="fixed test z-30 md:hidden block" onClick={this.toggleSidebar}>
                    {this.renderSidebarIcon()}
                </div>
                <div className={`md:static fixed md:bg-transparent order-2 bg-dark-blue fixed md:w-1/6 w-full transform origin-top duration-200 ease-in-out ${this.state.sidebarIsActive ? 'scale-y-100' : 'scale-y-0'}`}>
                    <Sidebar
                        active={this.state.activePanel}
                        isActive={this.state.sidebarIsActive}
                        onOptionChange={this.onActivePanelChange}
                    />
                </div>
                <div className="md:w-5/6 w-full order-1">
                    {this.renderPanel()}
                </div>
            </div>
        );
    }

}

export default Dashboard;