import lms from "../apis/lms";
import history from "../history";
import { alert } from "./alertActions";
import * as Type from './adminTypes'
import * as authType from './authTypes'
import { worker } from "./workerActions";
import {START, STOP} from "./workerTypes";


//#region Manager

export const getManagers = token => async dispatch => {

    try {
        dispatch({ type: START })
        
        const response = await lms.get('/Admin/GetManagers' , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })
        dispatch({ type: Type.GetManagers, payload: response.data })

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

export const AddNewManager = (token ,formvalue) => async dispatch => {

    try {
        dispatch({ type: START })
        
        const response = await lms.put('/Admin/AddNewManager' , formvalue , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })
        dispatch(alert.success("اطلاعات مدیر با موفقیت اضافه شد"))
        dispatch({ type: Type.AddNewManager, payload: response.data })

        return true

    } catch (e) {

        if(e.response)
        {
        switch (e.response.status) {
            case 401:
                dispatch(alert.error("اجازه دسترسی به این صفحه را ندارید"))
                history.push('/')
                break;

            default:
                dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))
        }
    }

        return false

    }

}

export const EditManager = (token ,formvalue) => async dispatch => {

    try {
        dispatch({ type: START })
        
        const response = await lms.post('/Admin/EditManager' , formvalue , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })
        dispatch(alert.success("اطلاعات مدیر با موفقیت ویرایش شد"))
        dispatch({ type: Type.EditManager, payload: response.data })

        return true

    } catch (e) {

        if(e.response)
        {
        switch (e.response.status) {
            case 401:
                dispatch(alert.error("اجازه دسترسی به این صفحه را ندارید"))
                history.push('/')
                break;

            default:
                dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))
        }
    }

        return false

    }

}

export const RemoveManager = (token ,formvalue) => async dispatch => {

    try {
        dispatch({ type: START })
        
        const response = await lms.delete('/Admin/RemoveManager' , formvalue , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })
        dispatch(alert.success(" مدیر با موفقیت حذف شد"))
        dispatch({ type: Type.RemoveManager, payload: response.data })

        return true

    } catch (e) {

        if(e.response)
        {
        switch (e.response.status) {
            case 401:
                dispatch(alert.error("اجازه دسترسی به این صفحه را ندارید"))
                history.push('/')
                break;

            default:
                dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))
        }
    }

        return false

    }

}

//#endregion

export const getDashboardInfo = token => async dispatch => {

    try {
        const response = await lms.get('/Admin/getDashboardInfo' , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: Type.getDashboardInfo, payload: response.data })

        return true

    } catch (e) {

        dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))
        return false

    }

}

export const logout = () => {
    history.push('/')
    return { type: authType.LOGOUT }
}