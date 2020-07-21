import lms from "../apis/lms";
import {alert} from "./alerts";

export const getManagers = (token) => async dispatch => {

    try {
        const response = await lms.get('/api/Admin/GetManagers', {
            headers: {
                authorization: `Bearer ${token}`
            }
        });
        dispatch({ type: 'GET_MANAGERS', payload: response.data });
    } catch (e) {
        console.log(e.response)
        dispatch(alert.error("خطا در برقراری ارتباط"))
    }

}