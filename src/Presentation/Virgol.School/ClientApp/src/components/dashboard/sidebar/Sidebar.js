import React from 'react';
import { connect } from 'react-redux';
import { logout } from "../../../_actions/authActions";
import { clear, headline, logoutIcon, settings } from "../../../assets/icons";
import SidebarJumbotron from "./SidebarJumbotron";
import ReactTooltip from "react-tooltip";

class Sidebar extends React.Component {

    render() {
        return (
            <div className={`xl:w-1/6 z-40 ${this.props.showSidebar ? 'w-5/6' : 'w-0'} xl:max-w-full max-w-250 h-screen fixed top-0 right-0 transition-all duration-700 ease-in-out bg-white`}>
                <div onClick={this.props.toggle} className="xl:hidden block absolute show-sidebar-pos cursor-pointer">
                    {this.props.showSidebar ? clear('w-8') : headline("w-8")}
                </div>

                <div className="w-full h-full overflow-hidden flex flex-col justify-around items-center">
                    <div className="w-2/5 flex flex-row-reverse justify-evenly items-center">
                        <img className="w-1/3" src="/logo192.png" alt="logo" />
                        <span className="font-vb text-2xl text-green">ویرگول</span>
                    </div>

                    <div className="w-2/3 flex flex-col items-end min-h-50">
                        {this.props.children}
                    </div>

                    <SidebarJumbotron />

                    <div className="w-full flex flex-row-reverse justify-center items-center">
                        <div onClick={() => this.props.logout()}>
                            {logoutIcon("w-8 mx-1 cursor-pointer text-grayish")}
                        </div>
                        <div>
                            {settings("w-8 mx-1 cursor-pointer text-grayish")}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default connect(null, { logout })(Sidebar);