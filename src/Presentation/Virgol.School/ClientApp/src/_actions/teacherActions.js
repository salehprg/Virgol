import lms from "../apis/lms";
import history from "../history";
import { alert } from "./alertActions";
import * as Type from './teachersTypes'
import { worker } from "./workerActions";
import {START, STOP} from "./workerTypes";

//#region News

export const SetMeetingService = (token , serviceName) => async dispatch => {

    try {
        dispatch({ type: START })
        
        const response = await lms.post(`/Teacher/SetMeetingService?serviceName=${serviceName}` , null , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })
        dispatch({ type: Type.SetMeetingService, payload: serviceName })
        dispatch(alert.success(response.data))

        return true

    } catch (e) 
    {
        dispatch({ type: STOP })
        dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))
        return false
    }

}

export const GetSchoolList = (token) => async dispatch => {

    try {
        dispatch({ type: START })
        
        const response = await lms.get(`/Teacher/GetSchoolList` , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })
        dispatch({ type: Type.GetSchoolList, payload: response.data })

        return true

    } catch (e) 
    {

        dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))
        return false
    }

}

export const GetClassBook = (token , scheduleId) => async dispatch => {

    try {
        dispatch({ type: START })
        
        const response = await lms.get(`/Teacher/GetClassBook?scheduleId=${scheduleId}` , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })
        dispatch({ type: Type.GetClassBook, payload: response.data })

        return true

    } catch (e) 
    {

        dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))
        return false
    }

}


