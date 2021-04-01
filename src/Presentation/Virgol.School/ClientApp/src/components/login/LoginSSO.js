import Axios from "axios";
import { withTranslation } from 'react-i18next'
import React, { createRef } from "react";
import { connect } from "react-redux";
import {MoodleSSO} from "../../_actions/classScheduleActions";
import {loading, logo , chevrons} from "../../assets/icons";
import lms from "../../apis/lms";

class LoginSSO extends React.Component {

    state = {
        passVisibility: false,
        logingin: false,
        panel: 'login',
        sendingCode: false,
        reseting: false,
        IdNumer: null
    }

    formRef = createRef();

    componentDidMount = async () => {

        const result = await this.props.MoodleSSO(this.props.user.token , this.props.match.params.schedulId , this.props.user.userSituation.substring(0,(this.props.user.userSituation.length)/2))
        var bodyFormData = new FormData();
        
        if(result)
        {
            this.formRef.current.submit()
        }

        // bodyFormData.append('username', 'admin');
        // bodyFormData.append('password', 'yK!@#PwuVg2zzVv');

    }

    render() {
        return (
            <div className="tw-w-screen tw-min-h-screen">
                <div className="centerize tw-flex tw-flex-col tw-text-center tw-items-center">
                    {chevrons('tw-w-24 tw-transform tw-rotate-180 tw-text-dark-blue')}
                    <p>در حال فرستادن شما به صفحه فعالیت های درس هستیم</p>
                    <p>این عملیات ممکن است چند ثانیه طول بکشد</p>
                    {loading('tw-w-12 tw-text-dark-blue')}
                </div>
                <form ref={this.formRef} className="tw-text-center" action={process.env.REACT_APP_MOODLE_URL} method="POST"  >
                <input
                    hidden={true}
                    name="username"
                    type="text"
                    placeholder={this.props.t('username')}
                    value={this.props.user.userInformation.userName}
                />
                <input
                    hidden={true}
                    name="password"
                    type="text"
                    placeholder={this.props.t('password')}
                    value={this.props.user.userSituation.substring(0,(this.props.user.userSituation.length)/2)}
                />
            </form>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {user : state.auth.userInfo}
}

const cwrapped = connect(mapStateToProps , {MoodleSSO})(LoginSSO);

export default withTranslation()(cwrapped);