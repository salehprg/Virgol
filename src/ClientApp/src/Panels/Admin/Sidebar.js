import React from "react";
import {bases, courses, headline, home, logout, students, teachers} from '../../icons';
import SidebarCard from "./SidebarCard";
import {authenticationService} from '../../_Services/AuthenticationService'
import { Button } from "react-bootstrap";

class Sidebar extends React.Component {

    state = { sidebar: true }

    logout = () =>{
        authenticationService.logout();
    }

    toggleSidebar = () => {
        this.setState({ sidebar: !this.state.sidebar });
    }

    render() {
        return (
            <div className={`bg-mbg md:w-1/6 fixed right-0 min-h-screen  ${(this.state.sidebar ? 'w-200' : 'w-0')}`}>
                <div className="flex flex-col justify-between h-screen">
                    <div className="relative">
                        <svg
                            className="absolute left-next md:hidden block"
                            onClick={this.toggleSidebar}
                            xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="#000">
                            <path d="M0 0h24v24H0V0z" fill="none"/><path d="M4 15h16v-2H4v2zm0 4h16v-2H4v2zm0-8h16V9H4v2zm0-6v2h16V5H4z"/>
                        </svg>
                        <div className={`flex flex-wrap ${(this.state.sidebar ? 'block' : 'hidden')}`}>
                            <div className="bg-box w-full flex flex-col justify-center items-center">
                                {headline('20', '12')}
                                <span className="text-white text-center text-xl md:text-2xl">سامانه مدیریت</span>
                            </div>

                            <SidebarCard
                                title="داشبورد"
                                icon={home('12', '8')}
                                onClick={this.props.toggleActive}
                                bg={(this.props.activePanel === "home") ? 'bg-pri' : ''}
                                optionKey="home"
                            />
                            <SidebarCard
                                title="لیست مقاطع تحصیلی"
                                icon={bases('12', '8')}
                                onClick={this.props.toggleActive}
                                bg={(this.props.activePanel === "bases") ? 'bg-pri' : ''}
                                optionKey="bases"
                            />
                            <SidebarCard
                                title="لیست دروس"
                                icon={courses('12', '8', '#fff')}
                                onClick={this.props.toggleActive}
                                bg={(this.props.activePanel === "courses") ? 'bg-pri' : ''}
                                optionKey="courses"
                            />
                            <SidebarCard
                                title="لیست معلمان"
                                icon={teachers('12', '8')}
                                onClick={this.props.toggleActive}
                                bg={(this.props.activePanel === "teachers") ? 'bg-pri' : ''}
                                optionKey="teachers"
                            />
                            <SidebarCard
                                title="لیست دانش آموزان"
                                icon={students('12', '8')}
                                onClick={this.props.toggleActive}
                                bg={(this.props.activePanel === "students") ? 'bg-pri' : ''}
                                optionKey="students"
                            />
                        </div>
                    </div>
                    <div className="flex justify-center pb-4 w-full">
                        <a href="#" onClick={() => this.logout()}>{logout('8', '8')}</a>
                    </div>
                </div>
            </div>
        );
    }
}

export default Sidebar;