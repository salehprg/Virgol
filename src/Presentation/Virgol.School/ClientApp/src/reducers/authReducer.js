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

    if (action.type === 'LOGIN')
        return { ...state, isLogged: true, userInfo: action.payload };

    if (action.type === 'LOGIN_FAILED')
        return INITIAL_STATE;

    if (action.type === 'REGISTER')
        return { ...state, isLogged: true, userInfo: action.payload }

    if (action.type === 'LOGOUT')
        return INITIAL_STATE

    if (action.type === 'USER_STATUS')
        return { ...state, status: true }

    if (action.type === 'REMOVE_STATUS')
        return { ...state, status: null }

    if (action.type === 'SEND_CODE')
        return { ...state, sendCode: { status: true, melliCode: action.payload, success: null } }

    if (action.type === 'FORGOT_PASS_OK')
        return { ...state, sendCode: { status: false, melliCode: null, success: true } }

    if (action.type === 'FORGOT_PASS_OK_FADE')
        return { ...state, sendCode: { status: false, melliCode: null, success: null } }

    if (action.type === 'FADE_SEND_CODE')
        return { ...state, sendCode: { status: false, melliCode: null, success: null } }

    return state;

}