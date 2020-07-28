import lms from "../apis/lms";
import {alert} from "./alerts";
import {GET_CAT_FOR_SIGNUP, GET_COURSES_IN_CAT, GET_STUDENT_CATEGORY} from "../_types/userTypes";

export const getCatsForSignUp = () => async dispatch => {

    try {
        const response = await lms.get(`/Users/GetAllCategory`);
        dispatch({ type: GET_CAT_FOR_SIGNUP, payload: response.data });

    } catch (e) {
        dispatch(alert.error("خطا در برقراری ارتباط"))
    }

}

export const getUserCat = (token) => async dispatch => {

    try {
        const response = await lms.get('/Users/GetCetegoryNames', {
            headers: {
                authorization: `Bearer ${token}`
            }
        });
        dispatch({ type: GET_STUDENT_CATEGORY, payload: response.data });
        return true;
    } catch (e) {
        dispatch(alert.error("خطا در برقراری ارتباط"))
        return false
    }

}

export const getCoursesInCat = (token, id) => async dispatch => {

    try {
        const response = await lms.get(`/Users/GetCoursesInCategory?CategoryId=${id}`, {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        console.log(response.data)
        if (!response.data[0]) {
            dispatch({ type: 'ERROR_GETTING_USER_INFO' })
        } else {
            dispatch({ type: GET_COURSES_IN_CAT, payload: { courses: response.data, id } });
        }

    } catch (e) {
        dispatch({ type: 'ERROR_GETTING_USER_INFO' })
    }

}

export const getCatError = () => {
    return alert.error("خطا در برقراری اتصال")
}