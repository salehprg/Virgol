import history from "../history";
import lms from "../apis/lms";
import { alert } from "./alertActions";
import * as Type from './coManagerTypes'
import { worker } from "./workerActions";
import {START, STOP} from "./workerTypes";


export const GetCoManagers = (token) => async dispatch => {

    try {
        const response = await lms.get(`/CoManager/GetCoManagers`, {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: Type.GetCoManagers, payload: response.data });
    } catch (e) {
        dispatch(alert.error(e.response.data))
    }

}

export const FindCoManager = (id) => async dispatch => {

    try {
        dispatch({ type: Type.FindCoManager, payload: id });
    } catch (e) {
        dispatch(alert.error(e.response.data))
    }

}

export const AddNewCoManager = (token, formValues) => async dispatch => {

    try {
        dispatch({type : START})
        const response = await lms.put("/CoManager/AddNewCoManager", formValues ,{
            headers: {
                authorization: `Bearer ${token}`
            }
        });
        dispatch({type : STOP})

        history.push("/m/coManagers");
        dispatch(alert.success("معاون با موفقیت اضافه شد"))
        dispatch({ type: Type.AddNewCoManager, payload: response.data });

    } catch (e) {
        dispatch({type : STOP})
        dispatch(alert.error(e.response.data))
    }

}

export const EditCoManager = (token, values) => async dispatch => {

    try {
        dispatch({type : START})
        const response = await lms.post('/CoManager/EditCoManager', values,{
            headers: {
                authorization: `Bearer ${token}`
            }
        });
        dispatch({type : STOP})

        history.push("/m/coManagers");
        dispatch(alert.success("معاون با موفقیت ویرایش گردید"))
        dispatch({ type: Type.EditCoManager, payload: response.data})

    } catch (e) {
        dispatch({type : STOP})
        dispatch(alert.error(e.response.data))
    }

}

export const RemoveCoManager = (token, id) => async dispatch => {

    try {
        
        dispatch({ type: START })
        const response = await lms.delete(`/CoManager/RemoveCoManager?coManagerId=${id}` ,{
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })
        dispatch(alert.success("معاون با موفقیت حذف شد"))
        dispatch({ type: Type.RemoveCoManager, payload: id})
        

    } catch (e) {
        // console.log(e)
        dispatch({ type: STOP })
        dispatch(alert.error("خطا در حذف معاون"))
    }

}

export const fadeError = (message) => {
    return {
        type: 'FADE_ERROR',
        payload: message
    }
}