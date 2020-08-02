import history from "../history";
import lms from "../apis/lms";
import { alert } from "./alerts";
import * as Type from '../_types/managerTypes'
import {START_WORKING, STOP_WORKING} from "../_types/workingTypes";

export const confirmUser = (token, id) => async dispatch => {

    try {
        dispatch({ type: START_WORKING })
        const response = await lms.post("/Manager/ConfirmUsers", [parseInt(id)],{
            headers: {
                authorization: `Bearer ${token}`
            }
        })

        dispatch({ type: STOP_WORKING })
        dispatch({ type: Type.CONFIRM, payload: id });
        history.push('/m/students')
        window.location.reload();
        dispatch(alert.success("دانش اموز تایید شد"))

    } catch (e) {
        dispatch({ type: STOP_WORKING })
        dispatch(alert.error("خطا در اتصال"))
    }
}

export const getNewUsers = token => async dispatch => {

    try {
        dispatch({ type: START_WORKING })
        const response = await lms.get("/Manager/GetNewUsers", {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP_WORKING })
        dispatch({ type: Type.GET_NEW_USERS, payload: response.data });
    } catch (e) {
        dispatch({ type: STOP_WORKING })
        dispatch(alert.error("خطا دربرقراری اتصال"))
    }

}

export const getAllGrades = token => async dispatch => {

    try {
        console.log("grades");
        const response = await lms.get("/Manager/GradesList", {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: Type.GET_ALL_GRADES, payload: response.data });
    } catch (e) {
        dispatch(alert.error("خطا دربرقراری اتصال"))
    }

}

export const getAllCategory = token => async dispatch => {

    try {
        const response = await lms.get("/Manager/GetAllCategory", {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: Type.GET_ALL_CATEGORY, payload: response.data });
    } catch (e) {
        dispatch(alert.error("خطا دربرقراری اتصال"))
    }

}

export const getAllCourses = token => async dispatch => {

    try {

        const response = await lms.get("/Manager/GetAllCourseInCat?CategoryId=-1", {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: Type.GET_ALL_COURSES, payload: response.data });
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

export const getCatCourses = (token, id) => async dispatch => {

    try {
        const response = await lms.get(`/Manager/GetAllCourseInCat?CategoryId=${id}`, {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: Type.GET_CAT_INFO, payload: response.data })
    } catch (e) {
        dispatch(alert.error("خطا"))
    }

}

export const addNewCategory = (token, formValues) => async dispatch => {

    try {
        dispatch({ type: START_WORKING })
        const response = await lms.put("/Manager/AddNewCategory", formValues ,{
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP_WORKING })
        dispatch(alert.success("مقطع جدید افزوده شد"))
        dispatch({ type: Type.ADD_NEW_CATEGORY, payload: response.data });
    } catch (e) {
        dispatch({ type: STOP_WORKING })
        dispatch(alert.error("خطا در افزودن مقطع"))
    }

}

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

export const deleteCategory = (token, id) => async dispatch => {

    try {
        dispatch({ type: START_WORKING })
        const response = await lms.post("/Manager/DeleteCategory", { id } ,{
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP_WORKING })
        dispatch(alert.success("مقطع با موفقیت حذف گردید"))
        dispatch({ type: Type.DELETE_CATEGORY, payload: id})

    } catch (e) {
        dispatch({ type: STOP_WORKING })
        dispatch(alert.error("خطا در حذف مقطع"))
    }

}

export const addNewCourse = (token, formValues) => async dispatch => {

    try {
        dispatch({ type: START_WORKING })
        const response = await lms.put("/Manager/AddNewCourse", formValues ,{
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP_WORKING })
        dispatch(alert.success("درس با موفقیت ایجاد شد"))
        dispatch({ type: Type.ADD_NEW_COURSE, payload: response.data });

    } catch (e) {
        dispatch({ type: STOP_WORKING })
        dispatch(alert.error("خطا در افزودن درس"))
    }

}

export const addCoursesToCat = (token, courses, catId) => async dispatch => {

    try {

        dispatch({ type: START_WORKING })
        const response = await lms.put(`/Manager/AddCoursesToCategory?CategoryId=${catId}`, courses ,{
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP_WORKING })
        dispatch(alert.success("دروس با موفقیت افزوده شدند"))
        dispatch({ type: Type.ADD_COURSES_TO_CAT, payload: response.data });

    } catch (e) {
        console.log(e.response)
        dispatch({ type: STOP_WORKING })
        dispatch(alert.error("خطا در افزودن درس"))
    }

}

export const deleteCourse = (token, id) => async dispatch => {

    try {

        const response = await lms.post("/Manager/DeleteCourse", { "id": id },{
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        history.push("/m/dashboard");
        dispatch(alert.success("درس حذف گردید"))
        dispatch({ type: Type.DELETE_COURSE, payload: id})
        return true;

    } catch (e) {
        dispatch(alert.error("خطا در حذف درس"))
        return false
    }

}

export const deleteCourseFromCat = (token, courseId, catId) => async dispatch => {

    try {
        dispatch({ type: START_WORKING })
        const response = await lms.post(`/Manager/RemoveCourseFromCategory?courseId=${courseId}`, courseId, {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP_WORKING })
        dispatch(alert.success("درس با موفقیت از این مقطع حذف شد"))
        dispatch({ type: Type.DELETE_COURSE_FROM_CAT, payload: courseId})
    } catch (e) {
        dispatch({ type: STOP_WORKING })
        dispatch(alert.error("خطا در حذف درس"))
    }

}

export const deleteTeacher = (token, ids) => async dispatch => {

    try {
        console.log(token)
        dispatch({ type: START_WORKING })
        const response = await lms.post(`/Manager/DeleteTeacher`, ids ,{
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({type: STOP_WORKING})
        dispatch({ type: Type.DELETE_TEACHER, payload: ids})
        dispatch(alert.success("معلم حذف شد"))

    } catch (e) {
        console.log(e.response)
        dispatch({type: STOP_WORKING})
        dispatch(alert.error("خطا در حذف معلم"))
    }

}

export const editCategory = (token, values) => async dispatch => {

    try {
        dispatch({ type: START_WORKING })
        const response = await lms.post('/Manager/EditCategory', values,{
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP_WORKING })
        dispatch({ type: Type.EDIT_CATEGORY, payload: response.data})
        dispatch(alert.success("مقطع با موفقیت ویرایش گردید"))

    } catch (e) {
        dispatch({ type: STOP_WORKING })
        dispatch(alert.error("خطا در ویرایش مقطع"))
    }

}

export const editCourse = (token, values) => async dispatch => {

    try {
        const response = await lms.post('/Manager/EditCourse', values,{
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        console.log(response.data)
        dispatch({ type: Type.EDIT_COURSE, payload: response.data})
        history.push("/m/dashboard");
        dispatch(alert.success("درس ویرایش شد"))

    } catch (e) {
        console.log(e.response)
        dispatch(alert.error("خطا در ویرایش درس"))
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