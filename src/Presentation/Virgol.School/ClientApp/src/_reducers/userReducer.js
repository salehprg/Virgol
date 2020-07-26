import {GET_CAT_FOR_SIGNUP, GET_COURSES_IN_CAT, GET_STUDENT_CATEGORY} from "../_types/userTypes";

const INITIAL_STATE = {
    'cats' : null,
    userCat: null,
    'courses' : null
}

export default (state = INITIAL_STATE, action) => {

    switch (action.type) {
        case GET_CAT_FOR_SIGNUP: return { ...state, cats: action.payload }
        case GET_COURSES_IN_CAT: return { ...state, courses: action.payload.courses, userCat: action.payload.id }
        case GET_STUDENT_CATEGORY: return { ...state, userCat: action.payload, error: false }
        case 'ERROR_GETTING_USER_INFO': return { ...state, userCat: -1, courses: [] }
        default: return INITIAL_STATE
    }

}