import lms from "../apis/lms";
import history from "../history";
import { alert } from "./alertActions";
import * as Type from './meetingTypes'
import * as authType from './authTypes'
import { worker } from "./workerActions";
import {START, STOP} from "./workerTypes";

export const GetAllActiveMeeting = token => async dispatch => {

    try {
        dispatch({ type: START })
        const response = await lms.get("/Meeting/GetAllActiveMeeting", {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })
        dispatch({ type: Type.GetAllActiveMeeting, payload: response.data });
    } catch (e) {
        dispatch({ type: STOP })
        dispatch(alert.error("خطا دربرقراری اتصال"))
    }

}

export const SetPresentStatus = (token , students) => async dispatch => {

    try {
        
        const response = await lms.post('/Meeting/SetPresentStatus' , students , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        if(response.data)
        {
            dispatch(alert.success("لیست حضور و غیاب با موفقیت ثبت شد"))
            history.push("/t/dashboard")
            return true
        }
        else
        {
            return false
        }

    } catch (e) {

        dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))

        return false

    }

}

export const GetParticipantList = (token , meetingId) => async dispatch => {

    try {
        
        dispatch({ type: Type.GetParticipantList, payload: null })

        const response = await lms.get(`/Meeting/GetParticipantList?meetingId=${meetingId}` , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: Type.GetParticipantList, payload: response.data })

    } catch (e) {

        dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))

        return false

    }

}

export const GetMeetingList = token => async dispatch => {

    try {
        
        const response = await lms.get('/Meeting/GetMeetingList' , {
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
        
        const response = await lms.get(`/Meeting/GetMeetingDetail?MeetingId=${MeetingId}` , {
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
        
        const response = await lms.get('/Meeting/GetRecentClass' , {
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

export const GetRecordList = (token , scheduleId) => async dispatch => {

    try {
        
        const response = await lms.get(`/Meeting/GetRecordList?scheduleId=${scheduleId}` , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: Type.GetRecordList, payload: response.data })

        return true

    } catch (e) {
        dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))

        return false

    }

}

export const CreatePrivateRoom = (token , roomName , schoolId = 0) => async dispatch => {

    try {
        
        dispatch({ type: START })
        const response = await lms.put(`/Meeting/CreatePrivateRoom?roomName=${roomName}&schoolId=${schoolId}` , null , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        // console.log(response);

        dispatch({ type: STOP })
        dispatch(alert.success("کلاس خصوصی با موفقیت ایجاد شد"))
        dispatch({ type: Type.StartMeeting, payload: response.data })

        return true

    } catch (e) {
        //console.log(e);
        dispatch({ type: STOP })
        dispatch(alert.error(e.response.data))

        return false

    }

}

export const StartMeeting = (token,lessonId) => async dispatch => {

    try {
        
        dispatch({ type: START })
        const response = await lms.post(`/Meeting/StartMeeting?lessonId=${lessonId}` , null , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })
        dispatch(alert.success("کلاس درس با موفقیت ایجاد شد"))
        dispatch({ type: Type.StartMeeting, payload: response.data })

        return true

    } catch (e) {

        dispatch({ type: STOP })
        dispatch(alert.error(e.response.data))

        return false

    }

}

export const EndMeeting = (token,bbbMeetingId) => async dispatch => {

    try {
        
        dispatch({ type: START })
        const response = await lms.post(`/Meeting/EndMeeting?bbbMeetingId=${bbbMeetingId}` , null , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })
        dispatch(alert.success("کلاس درس با موفقیت پایان یافت"))
        dispatch({ type: Type.EndMeeting, payload: response.data })

        return true

    } catch (e) {

        dispatch({ type: STOP })
        dispatch(alert.error(e.response.data))

        return false

    }

}

export const JoinPrivateRoom = (token,roomGUID) => async dispatch => {

    try {
        
        dispatch({ type: START })
        const response = await lms.post(`/Meeting/JoinPrivateRoom?roomGUID=${roomGUID}` , null , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })
        dispatch(alert.success("درحال ورود به کلاس خصوصی..."))
        dispatch(alert.success("درصورتی که به کلاس وارد نشدید <<پاپ آپ>> مرورگر خودرا فعال کنید.  - تنها مرورگر قابل استفاده در دستگاه های اپل ، سافاری و مرورگر پیشنهادی در سایر دستگاه ها گوگل کروم میباشد"))
        window.open(response.data, '_blank');
        dispatch({ type: Type.JoinMeeting, payload: response.data })

        return true

    } catch (e) {

        dispatch({ type: STOP })
        dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))

        return false

    }

}

export const JoinMeeting = (token,meetingId) => async dispatch => {

    try {
        
        dispatch({ type: START })
        const response = await lms.post(`/Meeting/JoinMeeting?meetingId=${meetingId}` , null , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })
        dispatch(alert.success("درحال ورود به کلاس درس..."))
        dispatch(alert.success("درصورتی که به کلاس وارد نشدید <<پاپ آپ>> مرورگر خودرا فعال کنید.  - تنها مرورگر قابل استفاده در دستگاه های اپل ، سافاری و مرورگر پیشنهادی در سایر دستگاه ها گوگل کروم میباشد"))
        window.open(response.data, '_blank');
        dispatch({ type: Type.JoinMeeting, payload: response.data })

        return true

    } catch (e) {

        dispatch({ type: STOP })
        dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))

        return false

    }

}

export const logout = () => {
    history.push('/')
    return { type: authType.LOGOUT }
}