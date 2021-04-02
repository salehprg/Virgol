import lms from '../apis/lms'

export const getLinks = (type) => async dispatch => {
    try {
        const response = await lms.post(`/GetTutorialVideo?UserType=${type}`)

        console.log(response);
    } catch (e) {
        
    }
}