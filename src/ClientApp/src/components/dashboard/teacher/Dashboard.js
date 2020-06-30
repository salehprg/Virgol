import React from "react";
import Sidebar from "../Sidebar";
import {clear, headline} from "../../../assets/icons";
import Home from "./Home";
import Base from "./Base";
import Course from "./Course";
import Teachers from './Teachers';
import Students from "./Students";

class Dashboard extends React.Component {

    state = { sidebarIsActive: true, activePanel: 'home' }

    onActivePanelChange = (active) => {
        this.setState({ activePanel: active })
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
                <div className={`md:static md:bg-transparent bg-dark-blue fixed md:w-1/6 w-full transform origin-top duration-200 ease-in-out ${this.state.sidebarIsActive ? 'scale-y-100' : 'scale-y-0'}`}>
                    <Sidebar
                        active={this.state.activePanel}
                        isActive={this.state.sidebarIsActive}
                        onOptionChange={this.onActivePanelChange}
                    />
                </div>
                <div className="md:w-5/6 w-full">
                    {this.renderPanel()}
                </div>
            </div>
        );
    }

}

export default Dashboard;