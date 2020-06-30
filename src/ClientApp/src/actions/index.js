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

        console.log(response.data)

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

        const response = await lms.post("/api/Admin/DeleteCategory", {"id": id} ,{
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: 'DELETE_CATEGORY', payload: id})

    } catch (e) {

    }

}

export const fadeError = (message) => {
    return {
        type: 'FADE_ERROR',
        payload: message
    }
}