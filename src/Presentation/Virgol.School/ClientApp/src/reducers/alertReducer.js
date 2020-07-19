import { SUCCESS, ERROR, CLEAR } from "../constants/alertConstants";

export default alert = (state = {}, action) => {

    switch (action.type) {
        case SUCCESS: return {
            type: 'alert_success',
            message: action.payload
        }

        case ERROR: return {
            type: 'alert_error',
            message: action.payload
        }

        case CLEAR: return {}

        default: return state
    }

}