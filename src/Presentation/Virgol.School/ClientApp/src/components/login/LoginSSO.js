import Axios from "axios";
import { withTranslation } from 'react-i18next'
import React, { createRef } from "react";
import { connect } from "react-redux";
import lms from "../../apis/lms";
import {loading, logo} from "../../assets/icons";

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

    componentDidMount() {
        var bodyFormData = new FormData();

        this.formRef.current.submit()

        // bodyFormData.append('username', 'admin');
        // bodyFormData.append('password', 'yK!@#PwuVg2zzVv');

    }

    render() {
        return (
            <form ref={this.formRef} className="text-center" action={process.env.REACT_APP_MOODLE_URL} method="POST"  >
                <input
                    hidden="true"
                    name="username"
                    type="text"
                    placeholder={this.props.t('username')}
                    value={this.props.user.userInformation.userName}
                />
                <input
                    hidden="true"
                    name="password"
                    type="text"
                    placeholder={this.props.t('password')}
                    value={localStorage.getItem('userPassword')}
                />
            </form>
        );
    }

}

const mapStateToProps = state => {
    return {user : state.auth.userInfo}
}

const cwrapped = connect(mapStateToProps)(LoginSSO);

export default withTranslation()(cwrapped);