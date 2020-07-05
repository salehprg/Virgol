const INITIAL_STATE = {
    'isThereSuccess' : false,
    'successMessage' : null
}

export default (state = INITIAL_STATE, action) => {

    if (action.type === "ADDED_BULK_USER") {
        return {...state, isThereSuccess: true}
    }

    if (action.type === 'ADDED_BULK_USER_SUCCESS_FADE') {
        return {...state, isThereSuccess: false, successMessage: null}
    }

    return state;

}