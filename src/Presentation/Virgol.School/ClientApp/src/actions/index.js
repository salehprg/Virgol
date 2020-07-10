import history from "../history";
import lms from "../apis/lms";

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
	console.log(e.response);
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
        const response = await lms.put('/api/Users/RegisterNewUser?password=s.shaffaf2', {
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

export const confirmUser = (token, id) => async dispatch => {

    try {

        dispatch({ type: 'CONFIRM_LOADING' });
        const response = await lms.post("/api/Admin/ConfirmUsers", [id],{
            headers: {
                authorization: `Bearer ${token}`
            }
        })

        dispatch({ type: 'CONFIRM', payload: id });
        dispatch({ type: 'FADE_LOADING' });

    } catch (e) {
        dispatch({ type: 'CONFIRM_FAILED', payload: 'خطا' });
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

        console.log(response.data)
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

export const getCatCourses = (token, id) => async dispatch => {

    try {

        dispatch({ type: 'GET_CAT_COURSES_LOADING' });
        const response = await lms.get(`/api/Admin/GetAllCourseInCat?CategoryId=${id}`, {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: 'GET_CAT_INFO', payload: response.data })
        dispatch({ type: 'FADE_LOADING' });

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

        dispatch({ type: 'ADD_NEW_CATEGORY', payload: response.data });
        dispatch({ type: 'FADE_LOADING' });

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
        dispatch({ type: 'ADDED_BULK_USER' });

        setTimeout(() => {
            dispatch({ type: 'ADDED_BULK_USER_SUCCESS_FADE' });
        }, 3000);

    } catch (e) {
        dispatch({ type: 'FADE_LOADING' });
        dispatch({ type: 'ERROR_ADDING_BULK_USER', payload: 'add bulk user error' });

        setTimeout(() => {
            dispatch({ type: 'FADE_ERROR' });
        }, 2000);
    }

}

export const addBulkTeacher = (token, excel) => async dispatch => {

    try {

        dispatch({ type: 'ADD_BULK_TEACHER_LOADING' });

        const data = new FormData()
        data.append('Files', excel)
        const response = await lms.post("/api/Admin/AddBulkTeacher", data, {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: 'FADE_LOADING' });
        dispatch({ type: 'ADDED_BULK_TEACHER' });

    } catch (e) {
        dispatch({ type: 'FADE_LOADING' });
        dispatch({ type: 'ERROR_ADDING_BULK_USER', payload: 'add bulk user error' });
    }

}

export const deleteCategory = (token, values) => async dispatch => {

    try {
        dispatch({ type: 'DELETE_CATEGORY_LOADING' });
        const response = await lms.post("/api/Admin/DeleteCategory", values ,{
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: 'DELETE_CATEGORY', payload: values.id})
        dispatch({ type: 'FADE_LOADING' });

    } catch (e) {
        console.log(e.response)
        dispatch({ type: 'FADE_LOADING' });
    }

}

export const removeStatus = () => {
    return { type: 'REMOVE_STATUS' }
}

export const addNewCourse = (token, formValues) => async dispatch => {

    try {

        dispatch({ type: 'ADD_NEW_COURSE_LOADING' });
        const response = await lms.put("/api/Admin/AddNewCourse", formValues ,{
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        console.log(response.data)

        dispatch({ type: 'ADD_NEW_COURSE', payload: response.data });
        dispatch({ type: 'FADE_LOADING' });

    } catch (e) {
        console.log(e.response)
        dispatch({ type: 'FADE_LOADING' });
        dispatch({ type: 'ERROR_ADDING_NEW_COURSE', payload: 'add new course error' });
    }

}

export const addCoursesToCat = (token, courses) => async dispatch => {

    try {

        dispatch({ type: 'ADD_COURSES_TO_CAT_LOADING' });
        const response = await lms.put("/api/Admin/AddCoursesToCategory", courses ,{
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: 'ADD_COURSES_TO_CAT', payload: response.data });
        dispatch({ type: 'FADE_LOADING' });

    } catch (e) {
        dispatch({ type: 'FADE_LOADING' });
        dispatch({ type: 'ERROR_ADDING_COURSES', payload: 'add courses error' });
    }

}

export const deleteCourse = (token, id) => async dispatch => {

    try {

        dispatch({ type: 'DELETE_COURSE_LOADING', payload: id });
        const response = await lms.post("/api/Admin/DeleteCourse", { "id": id },{
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: 'DELETE_COURSE', payload: id})
        dispatch({ type: 'FADE_LOADING' });

    } catch (e) {
        console.log(e.response)
        dispatch({ type: 'FADE_LOADING' });
    }

}

export const deleteCourseFromCat = (token, courseId, catId) => async dispatch => {

    try {

        const body = {
            "id" : courseId,
            "courseId" : catId
        }

        dispatch({ type: 'DELETE_COURSE_FROM_CAT_LOADING', payload: catId });
        const response = await lms.post("/api/Admin/DeleteCourseFromCat", { body },{
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: 'DELETE_COURSE', payload: catId})
        dispatch({ type: 'FADE_LOADING' });

    } catch (e) {
        dispatch({ type: 'FADE_LOADING' });
    }

}

export const deleteTeacher = (token, id) => async dispatch => {

    try {
        dispatch({ type: 'DELETE_TEACHER_LOADING', payload: id });
        const response = await lms.delete(`/api/Admin/DeleteTeacher?teacherId=${id}` ,{
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: 'DELETE_TEACHER', payload: id})
        dispatch({ type: 'FADE_LOADING' });

    } catch (e) {
        dispatch({ type: 'FADE_LOADING' });
    }

}

export const editCategory = (token, values) => async dispatch => {

    try {
        dispatch({ type: 'EDIT_CAT_LOADING' });
        const response = await lms.post('/api/Admin/EditCategory', values,{
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: 'EDIT_CATEGORY', payload: response.data})
        dispatch({ type: 'FADE_LOADING' });
        history.push("/a/dashboard");

    } catch (e) {
        dispatch({ type: 'FADE_LOADING' });
    }

}

export const editCourse = (token, values) => async dispatch => {

    try {
        dispatch({ type: 'EDIT_COURSE_LOADING' });
        const response = await lms.post('/api/Admin/EditCourse', values,{
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        console.log(response.data)

        dispatch({ type: 'EDIT_COURSE', payload: response.data})
        dispatch({ type: 'FADE_LOADING' });

    } catch (e) {
        console.log(e.response)
        dispatch({ type: 'FADE_LOADING' });
    }

}

export const editTeacher = (token, values) => async dispatch => {

    try {
        dispatch({ type: 'EDIT_TEACHER_LOADING' });
        const response = await lms.post('​/api/Admin/EditTeacher', values,{
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: 'EDIT_TEACHER', payload: response.data})
        dispatch({ type: 'FADE_LOADING' });

    } catch (e) {
        console.log(e.response)
        dispatch({ type: 'FADE_LOADING' });
    }

}

export const wipeCatInfo = () => {
    return {type: 'WIPE_CAT_INFO'}
}

export const fadeError = (message) => {
    return {
        type: 'FADE_ERROR',
        payload: message
    }
}