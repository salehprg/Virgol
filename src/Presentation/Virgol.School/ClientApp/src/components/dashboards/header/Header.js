import React from "react";
import ReactToolTip from 'react-tooltip'
import { connect } from 'react-redux';
import { logout } from "../../../_actions/authActions";
import Notification from "./Notification";
import {briefcase, log_out, message, video} from "../../../assets/icons";

class Header extends React.Component {

    render() {
        return (
            <div onClick={() => this.setState({ logoutConfirm: false })} className="w-full flex flex-row-reverse justify-start items-center">
                <Notification />
                <ReactToolTip />

                <div className="w-11/12 max-w-350 mr-4 px-2 py-1 flex flex-row-reverse justify-between items-center border-2 rounded-lg border-dark-blue">
                    <span className="text-white text-right">{this.props.user.userInformation.firstName} {this.props.user.userInformation.lastName}</span>
                    <div className="flex flex-row-reverse items-center">
                        <div data-tip="سامانه مودل" className="relative mx-1">
                            <a className="absolute top-0 bottom-0 right-0 left-0" href="https://moodle.legace.ir">
                            </a>
                            {briefcase("w-6 text-white cursor-pointer")}
                        </div>
                        <div data-tip="سامانه بیگ بلو" className="relative mx-1">
                            <a className="absolute top-0 bottom-0 right-0 left-0" href="https://bbb.legace.ir/b/ldap_signin">
                            </a>
                            {video("w-6 text-white cursor-pointer")}
                        </div>
                        <div data-tip="سامانه وبمیل" className="relative mx-1">
                            <a className="absolute top-0 bottom-0 right-0 left-0" href="https://webmail.legace.ir/">
                            </a>
                            {message("w-6 text-white cursor-pointer")}
                        </div>
                        <div data-tip="خروج" onClick={this.props.logout} className="relative mx-1">
                            {log_out("w-6 text-white cursor-pointer")}
                        </div>
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