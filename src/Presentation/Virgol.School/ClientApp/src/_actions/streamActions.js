import lms from "../apis/lms";
import history from "../history";
import { alert } from "./alertActions";
import * as Type from './streamTypes'
import * as authType from './authTypes'
import { worker } from "./workerActions";
import { START, STOP } from "./workerTypes";
import { config } from "../config";

//#region Schools

export const GetRoles = (token) => async dispatch => {

    try {
        const response = await lms.get(`/Stream/GetRoles` , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: Type.GetRoles, payload: response.data })

    } catch (e) {
        dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))
    }

}

export const GetActiveStream = (token) => async dispatch => {

    try {
        dispatch({ type: START })
        const response = await lms.get(`/Stream/GetActiveStream` , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });
        dispatch({ type: STOP })
        dispatch({ type: Type.GetActiveStream, payload: response.data })

    } catch (e) {
        dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))
    }

}

export const GetCurrentStream = (token) => async dispatch => {

    try {
        dispatch({ type: START })
        const response = await lms.get(`/Stream/GetCurrentStream` , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });
        dispatch({ type: STOP })
        dispatch({ type: Type.GetCurrentStream, payload: response.data })

    } catch (e) {
        dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))
    }

}

export const GetFutureStreams = (token) => async dispatch => {

    try {
        dispatch({ type: START })

        const response = await lms.get(`/Stream/GetFutureStreams` , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });
        dispatch({ type: STOP })

        dispatch({ type: Type.GetFutureStreams, payload: response.data })

    } catch (e) {
        dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))
    }

}

export const GetEndedStreams = (token) => async dispatch => {

    try {
        dispatch({ type: START })

        const response = await lms.get(`/Stream/GetEndedStreams` , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })
        dispatch({ type: Type.GetEndedStreams, payload: response.data })

    } catch (e) {
        dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))
    }

}

export const ReserveStream = (token, formValues) => async dispatch => {

    try {
        dispatch({ type: START })
        const response = await lms.post(`/Stream/ReserveStream`, formValues ,{
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })
        dispatch(alert.success(response.data))
        dispatch({ type: Type.ReserveStream, payload: response.data });

    } catch (e) {

        dispatch({ type: STOP })
        dispatch(alert.error(e.response.data))
    }

}

export const EditReservedStream = (token, formValues) => async dispatch => {

    try {
        dispatch({ type: START })
        const response = await lms.post(`/Stream/EditReservedStream`, formValues ,{
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })
        dispatch(alert.success(response.data))

    } catch (e) {

        dispatch({ type: STOP })
        dispatch(alert.error(e.response.data))
    }

}

export const StartStream = (token , streamId) => async dispatch => {

    try {
        dispatch({ type: START })
        const response = await lms.post(`/Stream/StartStream?streamId=${streamId}` ,{
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })
        dispatch(alert.success("کلاس جدید افزوده شد"))
        dispatch({ type: Type.StartStream, payload: response.data });
        
    } catch (e) {
        dispatch({ type: STOP })
        dispatch(alert.error("خطا در افزودن کلاس"))
    }

}

export const JoinStream = (token , streamId) => async dispatch => {

    try {
        dispatch({ type: START })
        const response = await lms.get(`/Stream/JoinStream?streamId=${streamId}` ,{
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })
        dispatch(alert.success("کلاس جدید افزوده شد"))
        dispatch({ type: Type.JoinStream, payload: response.data });
        
    } catch (e) {
        dispatch({ type: STOP })
        dispatch(alert.error("خطا در افزودن کلاس"))
    }

}

export const RemoveStream = (token , streamId) => async dispatch => {

    try {
        dispatch({ type: START })
        const response = await lms.delete(`/Stream/RemoveStream?streamId=${streamId}` ,{
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })
        dispatch(alert.success("همایش با موفقیت حذف شد"))
        
    } catch (e) {
        dispatch({ type: STOP })
        dispatch(alert.error("خطا در حذف همایش"))
    }

}

