import lms from "../apis/lms";
import { alert } from "./alertActions";
import * as Type from './classScheduleTypes'
import {START, STOP} from "./workerTypes";

export const getClassSchedule = (token, classId) => async dispatch => {

    try {
        const response = await lms.get(`/ClassSchedule/getClassSchedule?classId=${classId}`,{
            headers: {
                authorization: `Bearer ${token}`
            }
        })

        dispatch({ type: Type.getClassSchedule, payload: response.data });

    } catch (e) {
        dispatch(alert.error("خطا در اتصال"))
    }
}

export const GetGroupedSchedule = (token , classId = 0) => async dispatch => {

    try {
        dispatch({ type: START })
        
        const response = await lms.get(`/ClassSchedule/GetGroupedSchedule?classId=${classId}` , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })
        dispatch({ type: Type.GetGroupedSchedule, payload: response.data })

        return true

    } catch (e) 
    {

        dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))
        return false
    }

}


export const getClassLessons = (token, classId) => async dispatch => {

    try {
        const response = await lms.get(`/ClassSchedule/getClassLessons?classId=${classId}`,{
            headers: {
                authorization: `Bearer ${token}`
            }
        })

        dispatch({ type: Type.getClassLessons, payload: response.data });

    } catch (e) {
        dispatch(alert.error("خطا در اتصال"))
    }
}

export const getTeacherSchedule = (token) => async dispatch => {

    try {

        const response = await lms.get("/ClassSchedule/getTeacherSchedule",{
            headers: {
                authorization: `Bearer ${token}`
            }
        })


        dispatch({ type: Type.getTeacherSchedule, payload: response.data });

    } catch (e) {

        dispatch(alert.error("خطا در اتصال"))
    }
}

export const AddClassSchedule = (token, formValues) => async dispatch => {

    try {
        dispatch({ type: START })
        const response = await lms.put("/ClassSchedule/AddClassSchedule", formValues ,{
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })
        dispatch(alert.success("ساعت درسی با موفقیت اضافه شد."))
        dispatch({ type: Type.AddClassSchedule, payload: response.data });

    } catch (e) {
        dispatch({ type: STOP })
        dispatch(alert.error(e.response.data))
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

export const DeleteClassSchedule = (token, scheduleId) => async dispatch => {

    try {

        dispatch({ type: START })
        const response = await lms.delete(`/ClassSchedule/DeleteClassSchedule?scheduleId=${scheduleId}` ,{
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })
        dispatch({ type: Type.DeleteClassSchedule, payload: scheduleId})
        dispatch(alert.success("ساعت درسی حذف شد"))

    } catch (e) {
        dispatch({ type: STOP })
        dispatch(alert.error("خطا در حذف ساعت درسی"))
    }

}


export const MoodleSSO = (token, scheduleId , VirgoolBetaVersion) => async dispatch => {

    try {
        const response = await lms.post(`/ClassSchedule/MoodleSSO?scheduleId=${scheduleId}&VirgoolBetaVersion=${VirgoolBetaVersion}`, null ,{
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch(alert.success("هم اکنون منتقل میشوید ..."))

        return true

    } catch (e) {
        dispatch({ type: STOP })
        dispatch(alert.error(e.response.data))

        return false
    }

}

//#region Mixed Schedules

export const GetMixedSchedules = (token) => async dispatch => {

    try {

        const response = await lms.get("/ClassSchedule/GetMixedSchedules",{
            headers: {
                authorization: `Bearer ${token}`
            }
        })


        dispatch({ type: Type.GetMixedSchedules, payload: response.data });

    } catch (e) {

        dispatch(alert.error("خطا در اتصال"))
    }
}

export const AddMixedClassSchedule = (token, formValues) => async dispatch => {

    try {
        dispatch({ type: START })
        const response = await lms.put("/ClassSchedule/AddMixedClassSchedule", formValues ,{
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })
        dispatch(alert.success("ساعت درسی با موفقیت اضافه شد. لطفا رفرش کنید"))

    } catch (e) {
        dispatch({ type: STOP })
        dispatch(alert.error(e.response.data))
    }

}

export const DeleteMixedClassSchedule = (token, mixedId) => async dispatch => {

    try {
        dispatch({ type: START })
        const response = await lms.delete("/ClassSchedule/DeleteMixedClassSchedule?mixedId=" + mixedId ,{
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })
        dispatch(alert.success("کلاس تجمیعی با موفقیت حذف شد"))

    } catch (e) {
        dispatch({ type: STOP })
        dispatch(alert.error(e.response.data))
    }

}



//#endregion

// export const wipeCatInfo = () => {
//     return { type: Type.WIPE_CAT_INFO }
// }
