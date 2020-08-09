import lms from "../apis/lms";
import history from "../history";
import { alert } from "./alertActions";
import * as Type from './newsTypes'
import * as authType from './authTypes'
import { worker } from "./workerActions";

//#region News

export const GetMyNews = token => async dispatch => {

    try {
        dispatch(worker.start)
        
        const response = await lms.get('/News/GetMyNews' , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch(worker.stop)


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
        dispatch(worker.start)
        
        const response = await lms.get('/News/GetIncommingNews' , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch(worker.stop)


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
        dispatch(worker.start)
        
        const response = await lms.get('/News/GetAccessRoleIds' , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch(worker.stop)


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

export const CreateNews = (token ,formvalue) => async dispatch => {

    try {
        dispatch(worker.start)
        
        const response = await lms.put('/News/CreateNews' , formvalue , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch(worker.stop)
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
        dispatch(worker.start)
        
        const response = await lms.post('/News/EditNews' , formvalue , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch(worker.stop)
        dispatch({ type: Type.EditNews, payload: response.data })

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

export const RemoveNews = (token ,formvalue) => async dispatch => {

    try {
        dispatch(worker.start)
        
        const response = await lms.delete('/News/RemoveNews' , formvalue , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch(worker.stop)
        dispatch({ type: Type.RemoveNews, payload: response.data })

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
