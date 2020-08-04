import React from "react";
import { connect } from 'react-redux';
import { logout } from "../../../_actions/authActions";
import Notification from "./Notification";
import {log_out} from "../../../assets/icons";

class Header extends React.Component {

    render() {
        return (
            <div onClick={() => this.setState({ logoutConfirm: false })} className="w-full flex flex-row-reverse justify-start items-center">
                <Notification />

                <div className="w-11/12 max-w-250 mr-4 px-2 py-1 flex flex-row-reverse justify-between items-center border-2 rounded-lg border-dark-blue">
                    <span className="text-white text-right">{this.props.user.userInformation.firstName} {this.props.user.userInformation.lastName}</span>
                    <div onClick={this.props.logout} className="relative">
                        {log_out("w-6 text-white cursor-pointer")}
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {user: state.auth.userInfo }
}

export default connect(mapStateToProps, { logout })(Header);