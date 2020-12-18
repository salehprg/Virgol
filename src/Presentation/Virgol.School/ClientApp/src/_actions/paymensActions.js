import lms from "../apis/lms";
import history from "../history";
import { alert } from "./alertActions";
import * as Type from './paymentsTypes'
import * as authType from './authTypes'
import { worker } from "./workerActions";
import {START, STOP} from "./workerTypes";

export const GetServices = token => async dispatch => {

    try {
        dispatch({ type: START })
        
        const response = await lms.get('/Payment/GetServices' , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })
        dispatch({ type: Type.GetServices, payload: response.data })

        return true

    } catch (e) {

            dispatch(alert.error(e.response.data))
        return false
    }

}

export const GetPaymentDetail = (token , paymentId) => async dispatch => {

    try {
        dispatch({ type: START })
        
        const response = await lms.get('/Payment/GetPaymentDetail?paymentId=' + parseInt(paymentId) , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })
        dispatch({ type: Type.GetPaymentDetail, payload: response.data })

        return true

    } catch (e) {

            dispatch(alert.error(e.response.data))
        return false
    }

}

export const GetAllPayments = (token) => async dispatch => {

    try {
        dispatch({ type: START })
        
        const response = await lms.get('/Payment/GetAllPayments' , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })
        dispatch({ type: Type.GetAllPayments, payload: response.data })

        return true

    } catch (e) {

            dispatch(alert.error(e.response.data))
        return false
    }

}

export const MakePay = (token , serviceId , userCount) => async dispatch => {

    try {
        dispatch({ type: START })
        
        const response = await lms.post('/Payment/MakePay?serviceId=' + parseInt(serviceId) + '&userCount=' + parseInt(userCount) , null , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })
        
        window.open(response.data , "_blank");

        return true

    } catch (e) {
            dispatch({ type: STOP })
            dispatch(alert.error(e.response.data))
        return false
    }

}

export const CalculateAmount = (token , serviceId , userCount) => async dispatch => {

    try {
        
        const response = await lms.get('/Payment/CalculateAmount?serviceId=' + parseInt(serviceId) + '&userCount=' + parseInt(userCount) , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: Type.CalculateAmount, payload: response.data })

        return true

    } catch (e) {

            dispatch(alert.error(e.response.data))
        return false
    }

}