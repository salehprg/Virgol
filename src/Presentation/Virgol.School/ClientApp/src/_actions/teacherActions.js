import lms from "../apis/lms";
import history from "../history";
import { alert } from "./alertActions";
import * as Type from './teacherTypes'
import * as authType from './authTypes'
import { worker } from "./workerActions";
import {START, STOP} from "./workerTypes";


//#region Manager

export const GetMeetingList = token => async dispatch => {

    try {
        
        const response = await lms.get('/Teacher/GetMeetingList' , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: Type.GetMeetingList, payload: response.data })

        return true

    } catch (e) {

        dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))

        return false

    }

}

export const GetMeetingDetail = (token,MeetingId) => async dispatch => {

    try {
        
        const response = await lms.get(`/Teacher/GetMeetingDetail?MeetingId=${MeetingId}` , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: Type.GetMeetingDetail, payload: response.data })

        return true

    } catch (e) {

        dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))

        return false

    }

}

export const GetRecentClass = token => async dispatch => {

    try {
        
        const response = await lms.get('/Teacher/GetRecentClass' , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: Type.GetRecentClass, payload: response.data })

        return true

    } catch (e) {

        dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))

        return false

    }

}

export const StartMeeting = (token,lessonId) => async dispatch => {

    try {
        
        dispatch({ type: START })
        const response = await lms.post(`/Teacher/StartMeeting?lessonId=${lessonId}` , null , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })
        dispatch(alert.success("کلاس درس با موفقیت ایجاد شد"))
        dispatch({ type: Type.StartMeeting, payload: response.data })

        return true

    } catch (e) {

        console.log(e)
        dispatch({ type: STOP })
        dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))

        return false

    }

}

export const JoinMeeting = (token,meetingId) => async dispatch => {

    try {
        
        dispatch({ type: START })
        const response = await lms.post(`/Teacher/JoinMeeting?meetingId=${meetingId}` , null , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })
        dispatch(alert.success("درحال ورود به کلاس درس..."))
        window.open(response.data, '_blank');
        dispatch({ type: Type.JoinMeeting, payload: response.data })

        return true

    } catch (e) {

        console.log(e)
        dispatch({ type: STOP })
        dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))

        return false

    }

}

export const logout = () => {
    history.push('/')
    return { type: authType.LOGOUT }
}