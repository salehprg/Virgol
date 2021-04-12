import lms from "../apis/lms";
import history from "../history";
import { alert } from "./alertActions";
import * as Type from './authTypes'
import { START , STOP } from "./workerTypes";

export const login = (formValues , autoRedirect = true) => async dispatch => {
    try {

        const response = await lms.post('/Users/LoginUser', formValues)

        if(!autoRedirect)
            return response.data.token


        const decodePass = formValues.password+formValues.password
        const data = {
            ...response.data , 
            userSituation : decodePass
        }
        dispatch({ type: Type.LOGIN, payload: data })

        localStorage.setItem('userToken', response.data.token)
        localStorage.setItem('userType', response.data.userType)      

        
        switch (response.data.userType) {
            case "Student": {
                if(!response.data.completedProfile)
                {
                    history.push('/studentCompleteProfile');
                }else{
                    history.push('/s/dashboard');
                } 
                break;
            }
            case "Teacher": {
                if(!response.data.completedProfile)
                {
                    history.push('/teacherCompleteProfile');
                }else{
                    history.push('/t/dashboard');
                } 
                break;
            }
            case "Manager" : {
                history.push('/m/dashboard');
                break;
            }
            case "CoManager" : {
                history.push('/CoManager/dashboard');
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


        return true

    } catch(e) {

        if(e.response)
        {
            switch (e.response.status) {
                
                case 423:
                    dispatch(alert.error(e.response.data))
                    dispatch({type : Type.INCREASE_EFFORT , payload : 1})
                    break;

                case 401:
                    dispatch({type : Type.INCREASE_EFFORT , payload : 1})
                    dispatch(alert.error("نام کاربری یا گذرواژه اشتباه است"))

                    break;

                default:
                    dispatch({type : Type.INCREASE_EFFORT , payload : 1})
                    dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))
            }
        }
        else
        {
            dispatch({type : Type.INCREASE_EFFORT , payload : 1})
            dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))
        }

        return false

    }

}

export const logout = () => {
    history.push('/')
    // console.log(localStorage.getItem('remember'))
    const lang = localStorage.getItem('prefLang')
    const remember = localStorage.getItem('remember')

    localStorage.clear()
    
    localStorage.setItem('remember' , remember)

    if(lang === null){
        localStorage.setItem('prefLang' , 'fa')
    }
    else{
        localStorage.setItem('prefLang' , lang)
    }
    

    

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
        dispatch(alert.error(e.response.data))
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
        dispatch(alert.error(e.response.data))
        return false
    }

}

export const sendVerificationCode = formValues => async dispatch => {

    try {
        const response = await lms.post(`/Users/ForgotPWDCode?idNumber=${formValues.IdNumer}&type=0`);

        return true

    } catch (e) {
        dispatch(alert.error(e.response.data))
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
        dispatch(alert.error("خطایی در برقراری ارتباط رخ داد"));
        return false
    }

}

export const ChangePassword = (melliCode, verificationCode , newPassword) => async dispatch => {

    try {
        const response = await lms.post(`/Users/ChangePassword?idNumber=${melliCode}&verificationCode=${verificationCode}&newPassword=${newPassword}`);

        if (response.data) {
            dispatch(alert.success("رمز عبور با موفقیت تغییر یافت"));
            return true
        } else {
            dispatch(alert.error("کد تایید اشتباه است"));
            return false
        }

    } catch (e) {
        dispatch(alert.error("خطایی در برقراری ارتباط رخ داد"));
        return false
    }

}

export const SendVerifyPhoneNumber = (phoneNumber,token,IsFatherCode) => async dispatch => {

    try {
        dispatch({ type: START })
        const response = await lms.post(`/Users/VerifyPhoneNumber?phoneNumber=${phoneNumber}&type=0&fatherCode=${IsFatherCode}` , null , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });
        dispatch({ type: STOP })
        dispatch(alert.success("کد تایید با موفقیت ارسال شد"))
        return true

    } catch (e) {
        dispatch({ type: STOP })
        dispatch(alert.error(e.response.data))
        return false
    }

}

export const CheckVerifyPhoneNumber = (phoneNumber, verificationCode , token , IsFatherCode) => async dispatch => {

    try {
        dispatch({ type: START })
        const response = await lms.post(`/Users/VerifyPhoneNumber?phoneNumber=${phoneNumber}&type=1&verificationCode=${verificationCode}&fatherCode=${IsFatherCode}` , null , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });
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
        dispatch(alert.error(e.response.data));
        return false
    }

}

export const UploadDocuments = (token, documemt , docType) => async dispatch => {

    try {
        const data = new FormData()
        data.append('Files', documemt)

        dispatch({ type: START })
        const response = await lms.post(`/Users/UploadDocuments?docType=${docType}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })

        dispatch(alert.success(`مدرک با موفقیت آپلود شد`))

        return true
    } catch (e) {
        dispatch({ type: STOP })
        dispatch(alert.error(e.response.data))

        return false
    }

}

