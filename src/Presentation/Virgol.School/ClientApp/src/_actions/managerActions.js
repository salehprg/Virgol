import history from "../history";
import lms from "../apis/lms";
import { alert } from "./alertActions";
import * as Type from '../_actions/managerTypes'
import { worker } from "./workerActions";
import {START, STOP} from "./workerTypes";

export const confirmUser = (token, id) => async dispatch => {

    try {
        dispatch({ type: START })
        const response = await lms.post("/Manager/ConfirmUsers", [parseInt(id)],{
            headers: {
                authorization: `Bearer ${token}`
            }
        })

        dispatch({ type: STOP })
        dispatch({ type: Type.CONFIRM, payload: id });
        history.push('/m/students')
        window.location.reload();
        dispatch(alert.success("دانش اموز تایید شد"))

    } catch (e) {
        dispatch({ type: STOP })
        dispatch(alert.error("خطا در اتصال"))
    }
}

export const getNewUsers = token => async dispatch => {

    try {
        dispatch({ type: START })
        const response = await lms.get("/Manager/GetNewUsers", {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })
        dispatch({ type: Type.GET_NEW_USERS, payload: response.data });
    } catch (e) {
        dispatch({ type: STOP })
        dispatch(alert.error("خطا دربرقراری اتصال"))
    }

}

export const getManagerDashboardInfo = token => async dispatch => {

    try {
        const response = await lms.get("/Manager/getManagerDashboardInfo", {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: Type.getManagerDashboardInfo, payload: response.data });
    } catch (e) {
        dispatch(alert.error("خطا دربرقراری اتصال"))
    }

}

export const getAllTeachers = token => async dispatch => {

    try {
        const response = await lms.get("/Manager/TeacherList", {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: Type.GET_ALL_TEACHERS, payload: response.data });
    } catch (e) {
        dispatch(alert.error("خطا"))
    }

}

export const getAllStudents = token => async dispatch => {

    try {
        const response = await lms.get("/Manager/GetAllStudent", {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: Type.GET_ALL_STUDENTS, payload: response.data });
    } catch (e) {
        dispatch(alert.error("خطا"))
    }

}

//#region Class

export const getStudentsClass = (token , classId) => async dispatch => {

    try {
        const response = await lms.get(`/Manager/getStudentsClass?classId=${classId}`, {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: Type.getStudentsClass, payload: response.data });
    } catch (e) {
        dispatch(alert.error("خطا"))
    }

}

export const AssignUserToClass = (token , classId , userIds) => async dispatch => {

    try {
        const response = await lms.post(`/Manager/AssignUserToClass?classId=${classId}` , userIds, {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: Type.AssignUserToClass, payload: response.data });
    } catch (e) {
        dispatch(alert.error("خطا"))
    }

}

export const UnAssignUserFromClass = (token , classId , userIds) => async dispatch => {

    try {
        const response = await lms.post(`/Manager/UnAssignUserFromClass?classId=${classId}` , userIds, {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: Type.AssignUserToClass, payload: response.data });
    } catch (e) {
        dispatch(alert.error("خطا"))
    }

}

//#endregion

export const addNewTeacher = (token, formValues) => async dispatch => {

    const values = {
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        melliCode: formValues.melliCode,
        phoneNumber: formValues.phoneNumber,
        userDetail: {
            latinFirstName: formValues.latinFirstName,
            latinLastName: formValues.latinLastName
        }
    }

    try {
        const response = await lms.put("/Manager/AddNewTeacher", values ,{
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        history.push("/m/dashboard");
        dispatch(alert.success("معلم با موفقیت اضافه شد"))
        dispatch({ type: Type.ADD_NEW_TEACHER, payload: response.data });

    } catch (e) {
        console.log(e.response)
        dispatch(alert.error("خطا در افرودن معلم"))
    }

}

export const addBulkUser = (token, excel) => async dispatch => {

    try {
        const data = new FormData()
        data.append('Files', excel)
        const response = await lms.post("/Manager/AddBulkUser", data, {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: Type.ADD_BULK_USER });
        history.push("/m/dashboard")
        dispatch(alert.success("فایل آپلود شد"))
    } catch (e) {
        dispatch(alert.error("خطا"))
    }

}

export const addBulkTeacher = (token, excel) => async dispatch => {

    try {
        const data = new FormData()
        data.append('Files', excel)
        const response = await lms.post("/Manager/AddBulkTeacher", data, {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: Type.ADD_BULK_TEACHER });
        history.push("/m/dashboard")
        dispatch(alert.success("فایل اپلود شد"))

    } catch (e) {
        dispatch(alert.error("خطا"))
    }

}

export const deleteTeacher = (token, ids) => async dispatch => {

    try {
        console.log(token)
        dispatch({ type: START })
        const response = await lms.post(`/Manager/DeleteTeacher`, ids ,{
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })
        dispatch({ type: Type.DELETE_TEACHER, payload: ids})
        dispatch(alert.success("معلم حذف شد"))

    } catch (e) {
        console.log(e.response)
        dispatch({ type: STOP })
        dispatch(alert.error("خطا در حذف معلم"))
    }

}

export const editTeacher = (token, values) => async dispatch => {

    try {
        const response = await lms.post('/Manager/EditTeacher', values,{
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        history.push("/m/dashboard");
        dispatch(alert.success("معلم ویرایش گردید"))
        dispatch({ type: Type.EDIT_TEACHER, payload: response.data})

    } catch (e) {
        dispatch(alert.error("خطا در ویرایش معلم"))
    }

}

export const wipeCatInfo = () => {
    return { type: Type.WIPE_CAT_INFO }
}

export const fadeError = (message) => {
    return {
        type: 'FADE_ERROR',
        payload: message
    }
}