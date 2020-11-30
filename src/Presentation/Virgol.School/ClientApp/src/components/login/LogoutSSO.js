import Axios from "axios";
import { withTranslation } from 'react-i18next'
import React, { createRef } from "react";
import { connect } from "react-redux";
import {loading, logo , chevrons} from "../../assets/icons";
import lms from "../../apis/lms";
import history from "../../history";

class LogoutSSO extends React.Component {

    state = {
        passVisibility: false,
        logingin: false,
        panel: 'login',
        sendingCode: false,
        reseting: false,
        IdNumer: null
    }

    componentDidMount = async () => {

        switch (this.props.user.userType) {
            case "Student": {
                history.push('/s/dashboard');
                break;
            }
            case "Teacher": {
                history.push('/t/dashboard');
                break;
            }
            case "Manager": {
                history.push('/m/dashboard');
                break;
            }
            case "Admin": {
                history.push('/a/dashboard');
                break;
            }
            case 5: {
                history.push('/sa/dashboard');
            }
        }

    }

    render() {
        return (
            <div className="w-screen min-h-screen">
                <div className="centerize flex flex-col text-center items-center">
                    {chevrons('w-24 transform rotate-180 text-dark-blue')}
                    <p>درحال انتقال به پنل ویرگول ...</p>
                    <p>این عملیات ممکن است چند ثانیه طول بکشد</p>
                    {loading('w-12 text-dark-blue')}
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {user : state.auth.userInfo}
}

const cwrapped = connect(mapStateToProps , {})(LogoutSSO);

export default withTranslation()(cwrapped);