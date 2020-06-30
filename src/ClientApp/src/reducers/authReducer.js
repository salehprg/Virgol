const INITIAL_STATE = {
    'isLogged' : false,
    'userInfo' : null
}

export default (state = INITIAL_STATE, action) => {

    if (action.type === 'LOGIN')
        return { ...state, isLogged: true, userInfo: action.payload };

    if (action.type === 'LOGIN_FAILED')
        return INITIAL_STATE;

    if (action.type === 'REGISTER')
        return { ...state, isLogged: true, userInfo: action.payload }

    return state;

}