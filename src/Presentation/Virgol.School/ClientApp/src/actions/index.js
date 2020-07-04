import history from "../history";
import lms from "../apis/lms";
import {config} from "../assets/constants";

export const login = formValues => async dispatch => {

    try {

        dispatch({ type: 'LOGIN_LOADING' });
        const response = await lms.post('/api/Users/LoginUser', formValues);
        dispatch({ type: 'FADE_LOADING' });

        dispatch({ type: 'LOGIN', payload: response.data })
        switch (response.data.userType) {
            case 2:
                history.push('/a/dashboard');
        }


    } catch (e) {
        switch (e.response.status) {
            case 401:
                dispatch({ type: 'LOGIN_FAILED', payload: 'نام کاربری یا رمز عبور اشتباه است' });
                break;

            case 423:
                dispatch({ type: 'USER_STATUS' })
                history.push('/status');
        }

        dispatch({ type: 'FADE_LOADING' });
    }

}

export const logout = () => async dispatch => {
    dispatch({ type: 'LOGOUT' })
    history.push('/');
}

export const register = formValues => async dispatch => {

    try {

        dispatch({ type: 'REGISTER_LOADING' });
        const response = await lms.post('/api/Users/RegisterNewUser', {
            firstName: formValues.firstName,
            lastName: formValues.lastName,
            melliCode: formValues.melliCode
        })

        dispatch({ type: 'REGISTER', payload: response.data });
        dispatch({ type: 'FADE_LOADING' });
        history.push("/");

    } catch (e) {
        dispatch({ type: 'REGISTER_FAILED', payload: 'ارور در ثبت نام' });
        dispatch({ type: 'FADE_LOADING' });
    }
}

export const sendVerificationCode = formValues => async dispatch => {

    try {
        dispatch({ type: 'SEND_CODE_LOADING' });
        const response = await lms.post(`/api/Users/SendVerificationCode?IdNumer=${formValues.IdNumer}`);
        dispatch({ type: 'SEND_CODE', payload: formValues.IdNumer });
        dispatch({ type: 'FADE_LOADING' });

    } catch (e) {
        dispatch({ type: 'SEND_CODE_FAILED', payload: 'خطایی در برقراری ارتباط رخ داد' });
        dispatch({ type: 'FADE_LOADING' });
    }

}

export const forgotPassword = (melliCode, verificationCode) => async dispatch => {

    try {
        dispatch({ type: 'FORGOT_PASS_LOADING' });
        const response = await lms.post(`/api/Users/SendVerificationCode`, { melliCode, verificationCode });

        if (response.data) {
            dispatch({ type: 'FORGOT_PASS_OK' });
        } else {
            dispatch({ type: 'WRONG_CODE_ERROR', payload: 'کد وارد شده اشتباه است' });
        }

        dispatch({ type: 'FADE_LOADING' });

    } catch (e) {
        dispatch({ type: 'FORGOT_PASS_FAILED', payload: 'خطایی در برقراری ارتباط رخ داد' });
        dispatch({ type: 'FADE_LOADING' });
    }

}

export const forgotPassFade = () => {
    return { type: 'FORGOT_PASS_OK_FADE' }
}

export const sendCodeFade = () => {
    return { type: 'FADE_SEND_CODE' }
}

export const getNewUsers = token => async dispatch => {

    try {

        dispatch({ type: 'GET_NEW_USERS_LOADING' });
        const response = await lms.get("/api/Admin/GetNewUsers", {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: 'FADE_LOADING' });
        dispatch({ type: 'GET_NEW_USERS', payload: response.data });

    } catch (e) {
        dispatch({ type: 'FADE_LOADING' });
    }

}

export const getAllCategory = token => async dispatch => {

    try {

        dispatch({ type: 'GET_ALL_CATEGORY_LOADING' });
        const response = await lms.get("/api/Admin/GetAllCategory", {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: 'FADE_LOADING' });
        dispatch({ type: 'GET_ALL_CATEGORY', payload: response.data });

    } catch (e) {
        dispatch({ type: 'FADE_LOADING' });
    }

}

export const getAllCourses = token => async dispatch => {

    try {

        dispatch({ type: 'GET_ALL_COURSES_LOADING' });
        const response = await lms.get("/api/Admin/GetAllCourseInCat?CategoryId=-1", {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: 'FADE_LOADING' });
        dispatch({ type: 'GET_ALL_COURSES', payload: response.data });

    } catch (e) {
        dispatch({ type: 'FADE_LOADING' });
    }

}

export const getAllTeachers = token => async dispatch => {

    try {

        dispatch({ type: 'GET_ALL_TEACHERS_LOADING' });
        const response = await lms.get("/api/Admin/TeacherList", {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: 'FADE_LOADING' });
        dispatch({ type: 'GET_ALL_TEACHERS', payload: response.data });

    } catch (e) {
        dispatch({ type: 'FADE_LOADING' });
    }

}

export const getAllStudents = token => async dispatch => {

    try {

        dispatch({ type: 'GET_ALL_STUDENTS_LOADING' });
        const response = await lms.get("/api/Admin/GetAllStudent", {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: 'FADE_LOADING' });
        dispatch({ type: 'GET_ALL_STUDENTS', payload: response.data });

    } catch (e) {
        dispatch({ type: 'FADE_LOADING' });
    }

}

export const addNewCategory = (token, formValues) => async dispatch => {

    try {

        dispatch({ type: 'ADD_NEW_CATEGORY_LOADING' });
        const response = await lms.put("/api/Admin/AddNewCategory", formValues ,{
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: 'FADE_LOADING' });
        dispatch({ type: 'ADD_NEW_CATEGORY', payload: response.data });

    } catch (e) {
        dispatch({ type: 'FADE_LOADING' });
        dispatch({ type: 'ERROR_ADDING_NEW_CATEGORY', payload: 'add new category error' });
    }

}

export const addNewTeacher = (token, formValues) => async dispatch => {

    try {

        dispatch({ type: 'ADD_NEW_TEACHER_LOADING' });
        const response = await lms.put("/api/Admin/AddNewTeacher", formValues ,{
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: 'FADE_LOADING' });
        dispatch({ type: 'ADD_NEW_TEACHER', payload: response.data });

    } catch (e) {
        dispatch({ type: 'FADE_LOADING' });
        dispatch({ type: 'ERROR_ADDING_NEW_TEACHER', payload: 'add new teacher error' });
    }

}

export const addBulkUser = (token, excel) => async dispatch => {

    try {

        dispatch({ type: 'ADD_BULK_USER_LOADING' });

        const data = new FormData()
        data.append('Files', excel)
        const response = await lms.post("/api/Admin/AddBulkUser", data, {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: 'FADE_LOADING' });
        // dispatch({ type: 'ADD_NEW_TEACHER', payload: response.data });

    } catch (e) {
        dispatch({ type: 'FADE_LOADING' });
        dispatch({ type: 'ERROR_ADDING_NEW_TEACHER', payload: 'add new teacher error' });
    }

}

export const deleteCategory = (token, id) => async dispatch => {

    try {

        dispatch({ type: 'DELETE_CATEGORY_LOADING', payload: id });
        const response = await lms.post("/api/Admin/DeleteCategory", {"id": id} ,{
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: 'DELETE_CATEGORY', payload: id})
        dispatch({ type: 'FADE_LOADING' });

    } catch (e) {
        dispatch({ type: 'FADE_LOADING' });
    }

}

export const removeStatus = () => {
    return { type: 'REMOVE_STATUS' }
}

export const fadeError = (message) => {
    return {
        type: 'FADE_ERROR',
        payload: message
    }
}