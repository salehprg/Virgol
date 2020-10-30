import lms from "../apis/lms";
import history from "../history";
import { alert } from "./alertActions";
import * as Type from './newsTypes'
import * as authType from './authTypes'
import { worker } from "./workerActions";
import {START, STOP} from "./workerTypes";

//#region News

export const GetNewsDetail = (newsDetail) => async dispatch => {

    try {
    
            dispatch({ type: Type.GetNewsDetail, payload: newsDetail })

        return true

    } catch (e) {

        return false

    }

}


export const GetMyNews = token => async dispatch => {

    try {
        dispatch({ type: START })
        
        const response = await lms.get('/News/GetMyNews' , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })
        dispatch({ type: Type.GetMyNews, payload: response.data })

        return true

    } catch (e) {

        switch (e.response.status) {
            case 401:
                dispatch(alert.error("اجازه دسترسی به این صفحه را ندارید"))
                history.push('/')
                break;

            default:
                dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))
        }

        return false

    }

}

export const GetIncommingNews = token => async dispatch => {

    try {
        dispatch({ type: START })
        
        const response = await lms.get('/News/GetIncommingNews' , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })


        dispatch({ type: Type.GetIncommingNews, payload: response.data })

        return true

    } catch (e) {

        switch (e.response.status) {
            case 401:
                dispatch(alert.error("اجازه دسترسی به این صفحه را ندارید"))
                history.push('/')
                break;

            default:
                dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))
        }

        return false

    }

}

export const GetAccessRoleIds = token => async dispatch => {

    try {
        dispatch({ type: START })
        
        const response = await lms.get('/News/GetAccessRoleIds' , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })


        dispatch({ type: Type.GetAccessRoleIds, payload: response.data })

        return true

    } catch (e) {

        switch (e.response.status) {
            case 401:
                dispatch(alert.error("اجازه دسترسی به این صفحه را ندارید"))
                history.push('/')
                break;

            default:
                dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))
        }

        return false

    }

}

export const ShowError = (message) => async dispatch => {

    try {

        dispatch(alert.error(message))

        return true

    } catch (e) {

        switch (e.response.status) {
            case 401:
                dispatch(alert.error("اجازه دسترسی به این صفحه را ندارید"))
                history.push('/')
                break;

            default:
                dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))
        }

        return false

    }

}

export const CreateNews = (token ,formvalue ,returnUrl) => async dispatch => {

    try {
        dispatch({ type: START })
        
        const response = await lms.put('/News/CreateNews' , formvalue , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })
        dispatch(alert.success(`خبر مورد نظر با موفقیت افزوده شد `))
        history.push(returnUrl)
        dispatch({ type: Type.CreateNews, payload: response.data })

        return true

    } catch (e) {

        switch (e.response.status) {
            case 401:
                dispatch(alert.error("اجازه دسترسی به این صفحه را ندارید"))
                history.push('/')
                break;

            default:
                dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))
        }

        return false

    }

}

export const EditNews = (token ,formvalue) => async dispatch => {

    try {
        dispatch({ type: START })
        
        const response = await lms.post('/News/EditNews' , formvalue , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })
        dispatch(alert.success(`خبر مورد نظر با موفقیت ویرایش شد `))
        dispatch({ type: Type.EditNews, payload: response.data })

        return true

    } catch (e) {

        dispatch({ type: STOP })
        dispatch(alert.error("خطایی هنگام ویرایش رخ داد"))

        return false

    }

}

export const RemoveNews = (token ,newsId) => async dispatch => {

    try {
        dispatch({ type: START })
        
        const response = await lms.delete(`/News/RemoveNews?newsId=${newsId}` , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })
        dispatch(alert.success(`خبر مورد نظر با موفقیت حذف شد `))
        dispatch({ type: Type.RemoveNews, payload: newsId })

        return true

    } catch (e) {

        dispatch({ type: STOP })
        if(e.response)
        {
            dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))
        }
        return false
    }

}
