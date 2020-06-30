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

    if (action.type === "GET_ALL_COURSES_LOADING") {
        return { ...state, isThereLoading: true, loadingComponent: 'GetAllCourses'}
    }

    if (action.type === "GET_ALL_TEACHERS_LOADING") {
        return { ...state, isThereLoading: true, loadingComponent: 'GetAllTeachers'}
    }

    if (action.type === "GET_ALL_STUDENTS_LOADING") {
        return { ...state, isThereLoading: true, loadingComponent: 'GetAllStudents'}
    }

    if (action.type === "ADD_NEW_CATEGORY_LOADING") {
        return { ...state, isThereLoading: true, loadingComponent: 'addNewCategory'}
    }

    if (action.type === "ADD_NEW_TEACHER_LOADING") {
        return { ...state, isThereLoading: true, loadingComponent: 'addNewTeacher'}
    }

    if (action.type === 'FADE_LOADING') {
        return INITIAL_STATE
    }

    return state;

}
