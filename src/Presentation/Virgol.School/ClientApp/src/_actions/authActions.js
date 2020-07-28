import lms from "../apis/lms";
import history from "../history";
import { alert } from "./alerts";
import * as Type from "../_types/authTypes";
import {START_WORKING, STOP_WORKING} from "../_types/workingTypes";

export const login = formValues => async dispatch => {

    try {
        const response = await lms.post('/Users/LoginUser', formValues);
        dispatch({ type: Type.LOGIN, payload: response.data })

        switch (response.data.userType) {
            case 0: {
                history.push('/s/dashboard');
                break;
            }
            case 2: {
                history.push('/m/dashboard');
                break;
            }
            case 3: {
                history.push('/m/dashboard');
            }
        }

    } catch (e) {

        switch (e.response.status) {
            case 401:
                dispatch(alert.error("نام کاربری یا رمز عبور اشتباه است"))
                break;

            case 423:
                dispatch({ type: Type.USER_STATUS })
                history.push('/status');
        }

    }

}

export const logout = () => {
    history.push('/')
    return { type: Type.LOGOUT }
}

export const register = formValues => async dispatch => {

    try {

        dispatch({ type: START_WORKING })
        const form = {
            userDetail: {
                fatherName: formValues.fatherName,
                fatherMelliCode: formValues.fatherMelliCode,
                motherName: formValues.motherName,
                motherMelliCode: formValues.motherMelliCode,
                baseId: formValues.baseId,
                latinFirstName: formValues.latinFirstName,
                latinLastName: formValues.latinLastName,
                fatherPhoneNumber: formValues.fatherPhoneNumber
            },
            firstName: formValues.firstName,
            lastName: formValues.lastName,
            melliCode: formValues.melliCode,
            phoneNumber: formValues.phoneNumber
        }
        const response = await lms.put('/Users/RegisterNewUser', form)

        dispatch({ type:STOP_WORKING })
        dispatch({ type: Type.REGISTER, payload: response.data });
        history.push("/");
        dispatch(alert.success("ثبت نام انجام شد"))

    } catch (e) {
        dispatch({ type:STOP_WORKING })
        dispatch(alert.error("خطا در ثبت نام"))
    }
}

export const removeStatus = () => {
    return { type: Type.REMOVE_STATUS }
}

export const sendVerificationCode = formValues => async dispatch => {

    try {
        await lms.post(`/Users/SendVerificationCode?IdNumer=${formValues.IdNumer}`);
        dispatch({ type: Type.SEND_CODE, payload: formValues.IdNumer });

    } catch (e) {
        dispatch(alert.error("خطا در برقراری اتصال"))
    }

}

export const sendCodeFade = () => {
    return { type: Type.FADE_SEND_CODE }
}

export const forgotPassword = (melliCode, verificationCode) => async dispatch => {

    try {
        const response = await lms.post(`/Users/ForgotPassword`, { melliCode, verificationCode });

        if (response.data) {
            dispatch({ type: Type.FORGOT_PASS_OK });
        } else {
            dispatch(alert.error("کد وارد شده صحیح نیست"));
        }


    } catch (e) {
        dispatch(alert.error("خطایی در برقراری اتصال رخ داد"));
    }

}

export const forgotPassFade = () => {
    return { type: Type.FORGOT_PASS_OK_FADE }
}