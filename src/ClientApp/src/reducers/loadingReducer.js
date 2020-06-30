const INITIAL_STATE = {
    'isThereLoading' : false,
    'loadingComponent' : null
}

export default (state = INITIAL_STATE, action) => {

    if (action.type === "LOGIN_LOADING") {
        return { ...state, isThereLoading: true, loadingComponent: 'Login'}
    }

    if (action.type === "GET_NEW_USERS_LOADING") {
        return { ...state, isThereLoading: true, loadingComponent: 'GetNewUsers'}
    }

    if (action.type === "GET_ALL_CATEGORY_LOADING") {
        return { ...state, isThereLoading: true, loadingComponent: 'GetAllCategory'}
    }

    if (action.type === "GET_ALL_TEACHERS_LOADING") {
        return { ...state, isThereLoading: true, loadingComponent: 'GetAllTeachers'}
    }

    if (action.type === 'FADE_LOADING') {
        return INITIAL_STATE
    }

    return state;

}
