import lms from "../apis/lms";
import history from "../history";
import { alert } from "./alertActions";
import * as Type from './authTypes'

export const login = formValues => async dispatch => {

    try {
        const response = await lms.post('/Users/LoginUser', formValues)
        dispatch({ type: Type.LOGIN, payload: response.data })

        switch (response.data.userType) {
            case 1: {
                history.push('/s/dashboard');
                break;
            }
            case 3: {
                history.push('/t/dashboard');
                break;
            }
            case 2: {
                history.push('/m/dashboard');
                break;
            }
            case 4: {
                history.push('/a/dashboard');
                break;
            }
            case 5: {
                history.push('/sa/dashboard');
            }
        }

        return true

    } catch(e) {

        if(e.response)
        {
            switch (e.response.status) {
                
                case 423:
                    dispatch(alert.error(e.response.data))
                    break;

                case 401:
                    dispatch(alert.error("نام کاربری یا گذرواژه اشتباه است"))
                    break;

                default:
                    dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))
            }
        }
        else
        {
            dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))
        }

        return false

    }

}

export const logout = () => {
    history.push('/')
    return { type: Type.LOGOUT }
}

export const sendVerificationCode = formValues => async dispatch => {

    try {
        const response = await lms.post(`/Users/SendVerificationCode?IdNumer=${formValues.IdNumer}`);

        return true

    } catch (e) {
        dispatch(alert.error("کد ملی وجود ندارد"))
        return false
    }

}

export const forgotPassword = (melliCode, verificationCode) => async dispatch => {

    try {
        const response = await lms.post(`/Users/ForgotPassword`, { melliCode, verificationCode });

        if (response.data) {
            dispatch(alert.success("رمز عبور به کد ملی شما تغییر یافت"));
            return true
        } else {
            dispatch(alert.error("کد وارد شده اشتباه است"));
            return false
        }

    } catch (e) {
        console.log(e.response)
        dispatch(alert.error("خطایی در برقراری ارتباط رخ داد"));
        return false
    }

}

