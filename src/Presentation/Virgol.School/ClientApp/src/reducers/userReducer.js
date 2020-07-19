import {GET_CAT_FOR_SIGNUP, GET_COURSES_IN_CAT, GET_STUDENT_CATEGORY} from "../constants/userConstants";

const INITIAL_STATE = {
    'cats' : null,
    userCat: null,
    'courses' : null
}

export default (state = INITIAL_STATE, action) => {

    switch (action.type) {
        case GET_CAT_FOR_SIGNUP: return { ...state, cats: action.payload }
        case GET_COURSES_IN_CAT: return { ...state, courses: action.payload }
        case GET_STUDENT_CATEGORY: return { ...state, userCat: action.payload, error: false }
        default: return INITIAL_STATE
    }

}