import {GET_CAT_FOR_SIGNUP, GET_COURSES_IN_CAT, GET_STUDENT_CATEGORY} from "../constants/userConstants";

const INITIAL_STATE = {
    'managers': null
}

export default (state = INITIAL_STATE, action) => {

    switch (action.type) {
        case 'GET_MANAGERS': return { ...state, managers: action.payload }
        default: return INITIAL_STATE
    }

}