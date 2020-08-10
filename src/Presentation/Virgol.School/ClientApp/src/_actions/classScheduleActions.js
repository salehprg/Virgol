import history from "../history";
import lms from "../apis/lms";
import { alert } from "./alertActions";
import * as Type from './classScheduleTypes'
import { worker } from "./workerActions";

export const getClassSchedule = (token, classId) => async dispatch => {

    try {
        dispatch(worker.start)
        const response = await lms.get(`/ClassSchedule/getClassSchedule?classId=${classId}`,{
            headers: {
                authorization: `Bearer ${token}`
            }
        })

        dispatch(worker.stop)
        dispatch({ type: Type.getClassSchedule, payload: response.data });

    } catch (e) {
        dispatch(worker.stop)
        dispatch(alert.error("خطا در اتصال"))
    }
}

export const getClassLessons = (token, classId) => async dispatch => {

    try {
        dispatch(worker.start)
        const response = await lms.get(`/ClassSchedule/getClassLessons?classId=${classId}`,{
            headers: {
                authorization: `Bearer ${token}`
            }
        })

        dispatch(worker.stop)
        dispatch({ type: Type.getClassLessons, payload: response.data });

    } catch (e) {
        dispatch(worker.stop)
        dispatch(alert.error("خطا در اتصال"))
    }
}

export const getTeacherSchedule = (token) => async dispatch => {

    try {
        dispatch(worker.start)
        const response = await lms.get("/ClassSchedule/getClassSchedule",{
            headers: {
                authorization: `Bearer ${token}`
            }
        })

        dispatch(worker.stop)
        dispatch({ type: Type.getTeacherSchedule, payload: response.data });

    } catch (e) {
        dispatch(worker.stop)
        dispatch(alert.error("خطا در اتصال"))
    }
}

export const AddClassSchedule = (token, formValues) => async dispatch => {

    try {
        console.log(formValues)
        const response = await lms.put("/ClassSchedule/AddClassSchedule", formValues ,{
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch(alert.success("ساعت درسی با موفقیت اضافه شد"))
        dispatch({ type: Type.AddClassSchedule, payload: response.data });

    } catch (e) {
        console.log(e.response)
        dispatch(alert.error("خطا در افرودن ساعت درسی"))
    }

}

export const EditClassSchedule = (token, values) => async dispatch => {

    try {
        const response = await lms.post('/ClassSchedule/EditClassSchedule', values,{
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch(alert.success("ساعت درسی ویرایش گردید"))
        dispatch({ type: Type.EditClassSchedule, payload: response.data})

    } catch (e) {
        dispatch(alert.error("خطا در ویرایش معلم"))
    }

}

export const DeleteClassSchedule = (token, classId) => async dispatch => {

    try {

        dispatch(worker.start)
        const response = await lms.post(`/Manager/DeleteClassSchedule?classId=${classId}` ,{
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch(worker.stop)
        dispatch({ type: Type.DeleteClassSchedule, payload: classId})
        dispatch(alert.success("ساعت درسی حذف شد"))

    } catch (e) {
        console.log(e.response)
        dispatch(worker.stop)
        dispatch(alert.error("خطا در حذف ساعت درسی"))
    }

}



// export const wipeCatInfo = () => {
//     return { type: Type.WIPE_CAT_INFO }
// }
