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

        const response = await lms.get("/Manager/GetNewUsers", {
            headers: {
                authorization: `Bearer ${token}`
            }
        });
        
        dispatch({ type: Type.GET_NEW_USERS, payload: response.data });
    } catch (e) {
        
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

export const getCoManagerDashboardInfo = token => async dispatch => {

    try {
        const response = await lms.get("/CoManager/getCoManagerDashboardInfo", {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: Type.getManagerDashboardInfo, payload: response.data });
    } catch (e) {
        dispatch(alert.error("خطا دربرقراری اتصال"))
    }

}

//#region Students


export const getAllStudents = (token,isForAssign = 'false' , includeTeacher = false) => async dispatch => {

    try {
        const response = await lms.get(`/Manager/GetAllStudent?IsForAssign=${isForAssign}&IncludeTeacher=${includeTeacher}`, {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: Type.GET_ALL_STUDENTS, payload: response.data });
    } catch (e) {
        dispatch(alert.error("خطا"))
    }

}

export const addBulkUser = (token, excel) => async dispatch => {

    try {
        const data = new FormData()
        data.append('Files', excel)

        dispatch({ type: START })
        const response = await lms.post("/Manager/AddBulkUser", data, {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })
        dispatch({ type: Type.ADD_BULK_USER });
        history.push("/m/students")
        dispatch(alert.success(`لیست دانش آموزان اضافه شد \n : تعداد کل ${response.data.allCount} \n جدید : ${response.data.newCount} \n تکراری : ${response.data.duplicateCount}  \n ناقص : ${response.data.badDataCount}`))
    } catch (e) {
        dispatch({ type: STOP })
        dispatch(alert.error(e.response.data))
    }

}

export const AddNewStudent = (token, formValues) => async dispatch => {

    try {
        dispatch({type : START})
        const response = await lms.put("/Manager/AddNewStudent", formValues ,{
            headers: {
                authorization: `Bearer ${token}`
            }
        });
        dispatch({type : STOP})

        history.push("/m/students");
        dispatch(alert.success("دانش آموز با موفقیت اضافه شد"))
        dispatch({ type: Type.AddNewStudent, payload: response.data });

    } catch (e) {
        dispatch({type : STOP})
        dispatch(alert.error(e.response.data))
    }

}

export const DeleteStudents = (token, ids) => async dispatch => {

    try {
        
        dispatch({ type: START })
        const response = await lms.post(`/Manager/DeleteStudents` , ids ,{
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })
        dispatch({ type: Type.DeleteStudents, payload: ids})
        dispatch(alert.success("دانش آموز حذف شد"))

    } catch (e) {
        dispatch({ type: STOP })
        dispatch(alert.error("خطا در حذف معلم"))
    }

}

//#endregion

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

export const AssignUserListToClass = (token , formValue , classId , freeClass = false ) => async dispatch => {

    try {

        dispatch({ type: START })

        const response = await lms.post(`/Manager/AssignUserListToClass?classId=${classId}` , formValue, {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })

        if(!freeClass)
            dispatch(alert.success(`لیست دانش آموزان به کلاس اضافه شد `))
        else
            dispatch(alert.success(`لیست شرکت کنندگان به اتاق اضافه شد `))
        
        dispatch({ type: Type.AssignUserListToClass, payload: response.data });
    } catch (e) {
        dispatch({ type: STOP })
        dispatch(alert.error("خطا"))
    }

}

export const AssignUserToClass = (token , classId , excelData) => async dispatch => {

    try {
        const formData = new FormData();
        formData.append('file', excelData);

        dispatch({ type: START })

        const response = await lms.post(`/Manager/AssignUserToClass?classId=${classId}` , formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })

        dispatch(alert.success(`لیست دانش آموزان به کلاس اضافه شد \n : تعداد کل ${response.data.allCount} \n جدید : ${response.data.newCount} \n تکراری : ${response.data.duplicateCount}`
        ))
        dispatch({ type: Type.AssignUserToClass, payload: response.data });
    } catch (e) {
        dispatch({ type: STOP })
        dispatch(alert.error("خطا"))
    }

}

export const UnAssignUserFromClass = (token , classId , userIds) => async dispatch => {

    try {
        dispatch({ type: START })

        const response = await lms.post(`/Manager/UnAssignUserFromClass?classId=${classId}` , userIds, {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })

        dispatch({ type: Type.AssignUserToClass, payload: response.data });

        return true;

    } catch (e) {
        dispatch({ type: STOP })
        dispatch(alert.error("خطا"))


        return false
    }

}

export const GetExtraLessons = (token ) => async dispatch => {

    try {
        dispatch({ type: START })

        const response = await lms.get(`/Manager/GetExtraLessons` , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })

        dispatch({ type: Type.GetExtraLessons, payload: response.data });

    } catch (e) {
        dispatch({ type: STOP })
        dispatch(alert.error("خطا"))
    }

}

export const AssignUserToLesson = (token , formValue , userId) => async dispatch => {

    try {
        dispatch({ type: START })

        const response = await lms.post(`/Manager/AssignUserToLesson?userId=${userId}` , formValue, {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })

        dispatch(alert.success(response.data))

        dispatch({ type: Type.AssignUserToClass, payload: response.data });
        history.goBack()

    } catch (e) {
        dispatch({ type: STOP })
        dispatch(alert.error(e.response.data))
    }

}

export const UnAssignUserFromLesson = (token , extralLessonId , userId) => async dispatch => {

    try {
        dispatch({ type: START })

        const response = await lms.delete(`/Manager/UnAssignUserFromLesson?extralLessonId=${extralLessonId}&userId=${userId}` , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })

        dispatch(alert.success(response.data))

        return true;

    } catch (e) {
        dispatch({ type: STOP })
        dispatch(alert.error(e.response.data))


        return false
    }

}

//#endregion

//#region Teacher

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

export const EmptyUserInfo = () => async dispatch => {

    try {
        dispatch({ type: Type.EmptyUserInfo, payload: null });
    } catch (e) {
        dispatch(alert.error("خطا"))
    }

}

export const GetUserInfo = (token,userId) => async dispatch => {

    try {
        const response = await lms.get(`/Manager/GetUserInfo?userId=${userId}`, {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: Type.GetUserInfo, payload: response.data });
    } catch (e) {
        dispatch(alert.error("خطا"))
    }

}

export const CheckNewTeacher = (token, MelliCode) => async dispatch => {


    try {
        dispatch({type : START})

        const response = await lms.post(`/Manager/CheckNewTeacher?MelliCode=${MelliCode}` ,{
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({type : STOP})

        dispatch({ type: Type.CheckNewTeacher, payload: response.data });

        return true

    } catch (e) {
        dispatch({type : STOP})
        dispatch(alert.error(e.response.data))

        return false
    }

}

export const addNewTeacher = (token, formValues) => async dispatch => {


    try {
        dispatch({type : START})

        const response = await lms.put("/Manager/AddNewTeacher", formValues ,{
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({type : STOP})

        history.push("/m/teachers");
        dispatch(alert.success("معلم با موفقیت اضافه شد"))
        dispatch({ type: Type.ADD_NEW_TEACHER, payload: response.data });

    } catch (e) {
        dispatch({type : STOP})
        dispatch(alert.error(e.response.data))
    }

}

export const addBulkTeacher = (token, excel) => async dispatch => {

    try {
        const data = new FormData()
        data.append('Files', excel)

        dispatch({ type: START })
        const response = await lms.post("/Manager/AddBulkTeacher", data, {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })
        dispatch({ type: Type.ADD_BULK_TEACHER });
        history.push("/m/teachers")
        dispatch(alert.success(`لیست معلمان اضافه شد \n : تعداد کل ${response.data.allCount} \n جدید : ${response.data.newCount} \n تکراری : ${response.data.duplicateCount} \n ناقص : ${response.data.badDataCount}`))

    } catch (e) {
        dispatch({ type: STOP })
        dispatch(alert.error(e.response.data))
    }

}

export const deleteTeacher = (token, ids) => async dispatch => {

    try {
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
        dispatch({ type: STOP })
        dispatch(alert.error(e.response.data))
    }

}

export const editTeacher = (token, values) => async dispatch => {

    try {
        dispatch({type : START})
        const response = await lms.post('/Manager/EditTeacher', values,{
            headers: {
                authorization: `Bearer ${token}`
            }
        });
        dispatch({type : STOP})

        history.push("/m/teachers");
        dispatch(alert.success("معلم ویرایش گردید"))
        dispatch({ type: Type.EDIT_TEACHER, payload: response.data})

    } catch (e) {
        dispatch({type : STOP})
        dispatch(alert.error(e.response.data))
    }

}

export const EditStudent = (token, values) => async dispatch => {

    try {
        dispatch({type : START})
        const response = await lms.post('/Manager/EditStudent', values,{
            headers: {
                authorization: `Bearer ${token}`
            }
        });
        dispatch({type : STOP})

        history.push("/m/students");
        dispatch(alert.success("دانش آموز ویرایش گردید"))
        dispatch({ type: Type.EditStudent, payload: response.data})

    } catch (e) {
        dispatch({type : STOP})
        dispatch(alert.error(e.response.data))
    }

}
//#endregion

export const wipeCatInfo = () => {
    return { type: Type.WIPE_CAT_INFO }
}

export const fadeError = (message) => {
    return {
        type: 'FADE_ERROR',
        payload: message
    }
}