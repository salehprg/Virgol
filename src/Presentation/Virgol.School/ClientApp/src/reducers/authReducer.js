const INITIAL_STATE = {
    'isLogged' : false,
    'userInfo' : null,
    'status' : null,
    'sendCode' : false
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
        return { ...state, status: action.payload }

    if (action.type === 'REMOVE_STATUS')
        return { ...state, status: null }

    if (action.type === 'SEND_CODE')
        return { ...state, sendCode: true }

    return state;

}