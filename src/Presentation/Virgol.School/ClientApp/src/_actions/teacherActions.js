import lms from "../apis/lms";
import history from "../history";
import { alert } from "./alertActions";
import * as Type from './teachersTypes'
import { worker } from "./workerActions";
import {START, STOP} from "./workerTypes";

//#region News

export const GetClassBook = (token , lessonId) => async dispatch => {

    try {
        dispatch({ type: START })
        
        const response = await lms.get(`/Teacher/GetClassBook?lessonId=${lessonId}` , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })
        dispatch({ type: Type.GetClassBook, payload: response.data })

        return true

    } catch (e) 
    {

        console.log(e.response)
        dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))
        return false
    }

}