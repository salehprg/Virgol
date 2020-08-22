import React from "react";
import ReactToolTip from 'react-tooltip'
import { connect } from 'react-redux';
import { logout } from "../../../_actions/authActions";
import Notification from "./Notification";
import {briefcase, globe, headphones, log_out, mail, message, video} from "../../../assets/icons";
import moment from 'moment'

class Header extends React.Component {

    state = {dateTime : null}

    componentDidMount() {
        this.intervalID = setInterval(
          () => this.tick(),
          1000
        );
      }

    tick() {
    this.setState({
        dateTime: new Date().toLocaleString('fa-IR')
    });
    }

    componentWillUnmount() {
        clearInterval(this.intervalID);
    }

    render() {
        return (
            <div onClick={() => this.setState({ logoutConfirm: false })} className="w-full flex md:flex-row-reverse flex-col justify-between items-center">
                <ReactToolTip />
                <div className="flex flex-row-reverse justify-start items-start">
                    <Notification />

                    {/*<div className="w-full flex flex-row-reverse justify-start items-center">*/}
                    {/*    <span data-tip="به زودی" className="cursor-pointer text-white text-lg mx-4">زبان</span>*/}
                    {/*    <a className="text-white text-lg mx-4" href="mailto:support@legace.ir">پشتیبانی</a>*/}
                    {/*    <a className="text-white text-lg mx-4" href="https://webmail.legace.ir/" target="_blank" rel="noopener noreferrer">پست الکترونیکی</a>*/}
                    {/*    <button onClick={this.props.logout} className="text-white text-lg mx-4">خروج</button>*/}
                    {/*</div>*/}

                    <div className="mr-4 px-2 py-1 flex md:flex-row-reverse flex-col justify-between items-center border-2 rounded-lg border-dark-blue">
                        <span className="text-white text-right md:ml-4 ml-0 md:mb-0 mb-2">{this.props.user.userInformation.firstName} {this.props.user.userInformation.lastName}</span>
                        <div className="flex flex-row-reverse items-center">
                            {/*<div data-tip="سامانه مودل" className="relative mx-1">*/}
                            {/*    <a target="_blank" className="absolute top-0 bottom-0 right-0 left-0" href="https://moodle.legace.ir">*/}
                            {/*    </a>*/}
                            {/*    {briefcase("w-6 text-white cursor-pointer")}*/}
                            {/*</div>*/}
                            {/*<div data-tip="سامانه بیگ بلو" className="relative mx-1">*/}
                            {/*    <a target="_blank" className="absolute top-0 bottom-0 right-0 left-0" href="https://bbb.legace.ir/b/ldap_signin">*/}
                            {/*    </a>*/}
                            {/*    {video("w-6 text-white cursor-pointer")}*/}
                            {/*</div>*/}
                            <div data-tip="زبان - به زودی" className="relative mx-1">
                                {globe("w-6 text-white cursor-pointer")}
                            </div>
                            <div data-tip="پشتیبانی" className="relative mx-1">
                                <a className="absolute top-0 bottom-0 right-0 left-0" href="mailto:support@legace.ir">
                                </a>
                                {headphones("w-6 text-white cursor-pointer")}
                            </div>
                            <div data-tip="سامانه پست الکترونیکی" className="relative mx-1">
                                <a target="_blank" rel="noopener noreferrer" className="absolute top-0 bottom-0 right-0 left-0" href="https://webmail.legace.ir/">
                                </a>
                                {mail("w-6 text-white cursor-pointer")}
                            </div>
                            <div data-tip="خروج" onClick={this.props.logout} className="relative mx-1">
                                {log_out("w-6 text-white cursor-pointer")}
                            </div>
                        </div>
                    </div>
                </div>
                <span className="flex-1 text-white md:mt-0 mt-4">&nbsp;&nbsp;{this.state.dateTime}</span>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {user: state.auth.userInfo }
}

export default connect(mapStateToProps, { logout })(Header);