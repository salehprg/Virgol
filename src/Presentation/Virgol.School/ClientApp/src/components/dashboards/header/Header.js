import React from "react";
import { withTranslation } from 'react-i18next';
import { usePopper } from 'react-popper';
import ReactToolTip from 'react-tooltip';
import { connect } from 'react-redux';
import { logout } from "../../../_actions/authActions";
import Notification from "./Notification";
import { globe, headphones, log_out, mail } from "../../../assets/icons";
import ChangeLang from "./ChangeLang";

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
            <div className="tw-w-full tw-flex md:tw-flex-row-reverse tw-flex-col tw-justify-between tw-items-center">
                <ReactToolTip />
                <div className="tw-flex tw-flex-row-reverse tw-justify-start tw-items-start">
                    <Notification />

                    {/*<div className="tw-w-full tw-flex tw-flex-row-reverse tw-justify-start tw-items-center">*/}
                    {/*    <span data-tip="به زودی" className="tw-cursor-pointer tw-text-white tw-text-lg tw-mx-4">زبان</span>*/}
                    {/*    <a className="tw-text-white tw-text-lg tw-mx-4" href="mailto:support@legace.ir">پشتیبانی</a>*/}
                    {/*    <a className="tw-text-white tw-text-lg tw-mx-4" href="https://webmail.legace.ir/" target="_blank" rel="noopener noreferrer">پست الکترونیکی</a>*/}
                    {/*    <button onClick={this.props.logout} className="tw-text-white tw-text-lg tw-mx-4">خروج</button>*/}
                    {/*</div>*/}

                    <div className="tw-mr-4 tw-px-2 tw-py-1 tw-flex md:tw-flex-row-reverse tw-flex-col tw-justify-between tw-items-center tw-border-2 tw-rounded-lg tw-border-dark-blue">
                        <span className="tw-text-white tw-pt-1 tw-text-right md:tw-ml-4 tw-ml-0 md:tw-mb-0 tw-mb-2">{this.props.user.userInformation.melliCode}</span>
                        <div className="tw-flex tw-flex-row-reverse tw-items-center">
                            {/*<div data-tip="سامانه مودل" className="tw-relative tw-mx-1">*/}
                            {/*    <a target="_blank" className="tw-absolute tw-top-0 tw-bottom-0 tw-right-0 tw-left-0" href="https://moodle.legace.ir">*/}
                            {/*    </a>*/}
                            {/*    {briefcase("tw-w-6 tw-text-white tw-cursor-pointer")}*/}
                            {/*</div>*/}
                            {/*<div data-tip="سامانه بیگ بلو" className="tw-relative tw-mx-1">*/}
                            {/*    <a target="_blank" className="tw-absolute tw-top-0 tw-bottom-0 tw-right-0 tw-left-0" href="https://bbb.legace.ir/b/ldap_signin">*/}
                            {/*    </a>*/}
                            {/*    {video("tw-w-6 tw-text-white tw-cursor-pointer")}*/}
                            {/*</div>*/}
                            <ChangeLang showLang={this.props.showLang} setShowLang={this.props.setShowLang} />
                            {/* <span className={`tw-mx-2 tw-cursor-pointer ${this.props.langVis ? '' : 'hidden'} ${this.props.i18n.langauge != 'ar' ? 'tw-text-greenish' : 'tw-text-white'}`}>فارسی</span>
                            <span onClick={() => this.props.i18n.changeLanguage('ar')} className={`tw-mx-2 tw-cursor-pointer ${this.props.langVis ? '' : 'hidden'} ${this.props.i18n.langauge == 'ar' ? 'tw-text-greenish' : 'tw-text-white'}`}>العربیه</span> */}
                            <div data-tip={this.props.t('support')} className="tw-relative tw-mx-1">
                                <a className="tw-absolute tw-top-0 tw-bottom-0 tw-right-0 tw-left-0" href="mailto:support@vir-gol.ir">
                                </a>
                                {headphones("tw-w-6 tw-text-white tw-cursor-pointer")}
                            </div>
                            <div data-tip={this.props.t('webmail')} className="tw-relative tw-mx-1">
                                <a target="_blank" rel="noopener noreferrer" className="tw-absolute tw-top-0 tw-bottom-0 tw-right-0 tw-left-0" href="https://webmail.vir-gol.ir/">
                                </a>
                                {mail("tw-w-6 tw-text-white tw-cursor-pointer")}
                            </div>
                            <div data-tip={this.props.t('exit')} onClick={this.props.logout} className="tw-relative tw-mx-1">
                                {log_out("tw-w-6 tw-text-white tw-cursor-pointer")}
                            </div>
                        </div>
                    </div>
                </div>
                <span className="tw-flex-1 tw-text-white md:tw-mt-0 tw-mt-4">&nbsp;&nbsp;{this.state.dateTime}</span>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {user: state.auth.userInfo }
}

const cwrapped = connect(mapStateToProps, { logout })(Header);

export default withTranslation()(cwrapped);