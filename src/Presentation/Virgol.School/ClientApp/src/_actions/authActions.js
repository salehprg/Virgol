import { startsWith } from "lodash";
import lms from "../apis/lms";
import history from "../history";
import { alert } from "./alertActions";
import * as Type from './authTypes'
import { START , STOP } from "./workerTypes";

export const login = formValues => async dispatch => {

    try {
        const response = await lms.post('/Users/LoginUser', formValues)
        dispatch({ type: Type.LOGIN, payload: response.data })

        switch (response.data.userType) {
            case 1: {
                if(!response.data.completedProfile)
                {
                    history.push('/studentCompleteProfile');
                }else{
                    history.push('/s/dashboard');
                } 
                break;
            }
            case 3: {
                if(!response.data.completedProfile)
                {
                    history.push('/teacherCompleteProfile');
                }else{
                    history.push('/t/dashboard');
                } 
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

export const CompleteTeacherProfile = (token,formValues) => async dispatch => {

    try {
        dispatch({ type: START })
        const response = await lms.post(`/Users/CompleteTeacherProfile` , formValues , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });
        dispatch({ type: STOP })
        history.push('/')
        dispatch(alert.success("اطلاعات پروفایل با موفقیت تکمیل شد"))

        return true

    } catch (e) {
        dispatch({ type: STOP })
        dispatch(alert.error("مشکلی بوجود آمده است"))
        return false
    }

}

export const CompleteStudentProfile = (token,formValues) => async dispatch => {

    try {
        dispatch({ type: START })
        const response = await lms.post(`/Users/CompleteStudentProfile` , formValues , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });
        dispatch({ type: STOP })
        history.push('/')
        dispatch(alert.success("اطلاعات پروفایل با موفقیت تکمیل شد"))

        return true

    } catch (e) {
        dispatch({ type: STOP })
        dispatch(alert.error("مشکلی بوجود آمده است"))
        return false
    }

}

export const sendVerificationCode = formValues => async dispatch => {

    try {
        const response = await lms.post(`/Users/ForgotPWDCode?IdNumer=${formValues.IdNumer}&type=0`);

        return true

    } catch (e) {
        dispatch(alert.error("کد ملی وجود ندارد"))
        return false
    }

}

export const forgotPassword = (melliCode, verificationCode) => async dispatch => {

    try {
        const response = await lms.post(`/Users/ForgotPWDCode?IdNumer=${melliCode}&type=1&verificationCode=${verificationCode}`);

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

export const SendVerifyPhoneNumber = phoneNumber => async dispatch => {

    try {
        dispatch({ type: START })
        const response = await lms.post(`/Users/VerifyPhoneNumber?phoneNumber=${phoneNumber}&type=0`);
        dispatch({ type: STOP })
        dispatch(alert.success("کد تایید با موفقیت ارسال شد"))
        return true

    } catch (e) {
        dispatch({ type: STOP })
        dispatch(alert.error(e.response.data))
        return false
    }

}

export const CheckVerifyPhoneNumber = (phoneNumber, verificationCode) => async dispatch => {

    try {
        dispatch({ type: START })
        const response = await lms.post(`/Users/VerifyPhoneNumber?phoneNumber=${phoneNumber}&type=0&verificationCode=${verificationCode}`);
        dispatch({ type: STOP })

        if (response.data) {
            dispatch(alert.success("شماره تلفن با موفقیت ثبت شد"));
            return true
        } else {
            dispatch(alert.error("کد وارد شده صحیح نمیباشد"));
            return false
        }

    } catch (e) {
        dispatch({ type: STOP })
        console.log(e.response)
        dispatch(alert.error("خطایی در برقراری ارتباط رخ داد"));
        return false
    }

}

