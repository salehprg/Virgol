import Axios from "axios";
import React from "react";
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

    componentDidMount() {
        var bodyFormData = new FormData();
        bodyFormData.append('username', 'admin');
        bodyFormData.append('password', 'yK!@#PwuVg2zzVv');

    }

    render() {
        return (
            <form className="text-center" action="http://vs.legace.ir/login/index.php" method="POST"  >
                <input
                    name="username"
                    type="text"
                    placeholder="نام کاربری"
                />
                <input
                    name="password"
                    type="text"
                    placeholder="رمز عبور"
                />
                <button className={`w-5/6 mx-auto flex justify-center rounded-lg py-2 focus:outline-none focus:shadow-outline my-8 bg-purplish text-white`}>
                    {this.state.logingin ? loading('w-6 text-white') : 'ورود'}
                </button>
            </form>
        );
    }

}

export default LoginSSO;