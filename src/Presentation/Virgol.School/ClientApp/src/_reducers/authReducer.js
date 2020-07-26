import * as Type from "../_types/authTypes";

const INITIAL_STATE = {
    'isLogged' : false,
    'userInfo' : null,
    'status' : null,
    'sendCode' : {
        status: false,
        melliCode: null,
        success: null
    }
}

export default (state = INITIAL_STATE, action) => {

    if (action.type === Type.LOGIN)
        return { ...state, isLogged: true, userInfo: action.payload };

    if (action.type === Type.REGISTER)
        return { ...state, isLogged: true, userInfo: action.payload }

    if (action.type === Type.LOGOUT)
        return INITIAL_STATE

    if (action.type === Type.USER_STATUS)
        return { ...state, status: true }

    if (action.type === Type.REMOVE_STATUS)
        return { ...state, status: null }

    if (action.type === Type.SEND_CODE)
        return { ...state, sendCode: { status: true, melliCode: action.payload, success: null } }

    if (action.type === Type.FADE_SEND_CODE)
        return { ...state, sendCode: { status: false, melliCode: null, success: null } }

    if (action.type === Type.FORGOT_PASS_OK)
        return { ...state, sendCode: { status: false, melliCode: null, success: true } }

    if (action.type === Type.FORGOT_PASS_OK_FADE)
        return { ...state, sendCode: { status: false, melliCode: null, success: null } }

    return state;

}