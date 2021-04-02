import lms from '../apis/lms'
import * as Type from './guideTypes'
export const getLinks = (type) => async dispatch => {
    try {
        const response = await lms.get(`/Users/GetTutorialVideo?UserType=${type}`)

        switch (type) {
            case "Manager":
                dispatch({type : Type.getPrincipalLinks , payload : response.data.split(';')})
                break;
            case "Student":
                dispatch({type : Type.getStudentLinks , payload : response.data.split(';')})
                break;
            case "Teacher":
                dispatch({type:Type.getTeacherLinks , payload : response.data.split(';')})
            default:
                break;
        }
        
    } catch (e) {
        console.error(e)
    }
}