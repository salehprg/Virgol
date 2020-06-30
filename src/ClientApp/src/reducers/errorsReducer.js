const INITIAL_STATE = {
    'isThereError' : false,
    'errorMessage' : null
}

export default (state = INITIAL_STATE, action) => {

    if (action.type === "LOGIN_FAILED") {
        return { ...state, isThereError: true, errorMessage: action.payload }
    }

    if (action.type === "REGISTER_FAILED") {
        return { ...state, isThereError: true, errorMessage: action.payload }
    }

    if (action.type === "ERROR_ADDING_NEW_CATEGORY") {
            return { ...state, isThereError: true, errorMessage: action.payload }
    }

    if (action.type === "ERROR_ADDING_NEW_TEACHER") {
            return { ...state, isThereError: true, errorMessage: action.payload }
    }

    if (action.type === 'FADE_ERROR') {
        return INITIAL_STATE
    }

    return state;

}