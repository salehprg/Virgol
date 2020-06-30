import history from "../history";
import lms from "../apis/lms";

export const login = formValues => async dispatch => {

    try {

        dispatch({ type: 'LOGIN_LOADING' });
        const response = await lms.post('/api/Users/LoginUser', formValues);
        dispatch({ type: 'LOGIN', payload: response.data });
        dispatch({ type: 'FADE_LOADING' });
        history.push("/t/dashboard");

    } catch (e) {
        dispatch({ type: 'LOGIN_FAILED', payload: 'نام کاربری یا رمز عبور اشتباه است' });
        dispatch({ type: 'FADE_LOADING' });
    }

}

export const register = formValues => async dispatch => {

    // const response = await lms.post('/api/Users/LoginUser', formValues);
    //
    // dispatch({ type: 'LOGIN', payload: response.data });
    // history.push("/teacher/dashboard");

    dispatch({ type: 'REGISTER_FAILED', payload: 'Register Failed!!!' });
}

export const getNewUsers = token => async dispatch => {

    try {

        const response = await lms.get("/api/Admin/GetNewUsers", {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        console.log(response.data);
        dispatch({ type: 'GET_NEW_USERS', payload: response.data });

    } catch (e) {

    }

}

export const getAllCategory = token => async dispatch => {

    try {

        const response = await lms.get("/api/Admin/GetAllCategory", {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: 'GET_ALL_CATEGORY', payload: response.data });

    } catch (e) {

    }

}

export const getAllCourses = token => async dispatch => {

    try {

        const response = await lms.get("/api/Admin/GetAllCourseInCat?CategoryId=-1", {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: 'GET_ALL_COURSES', payload: response.data });

    } catch (e) {

    }

}

export const getAllTeachers = token => async dispatch => {

    try {

        const response = await lms.get("/api/Admin/TeacherList", {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: 'GET_ALL_TEACHERS', payload: response.data });

    } catch (e) {

    }

}

export const getAllStudents = token => async dispatch => {

    try {

        const response = await lms.get("/api/Admin/GetAllStudent", {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: 'GET_ALL_STUDENTS', payload: response.data });

    } catch (e) {

    }

}

export const fadeError = (message) => {
    return {
        type: 'FADE_ERROR',
        payload: message
    }
}